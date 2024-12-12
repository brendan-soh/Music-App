package main

/* We’ll be working with JSON data so the encoding/json dependency is required. While we’ll be working
   with HTTP requests, the net/http dependency is not quite enough. The mux dependency is a helper to
   not only make endpoints easier to create, but also give us more features. Since this is an external
   dependency, it must be downloaded like follows: go get github.com/gorilla/mux */

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

/* Create struct object that will house our data. We are defining what properties exist in the struct,
   but we are also defining tags that describe how the struct will appear as JSON. Inside each of the
   tags there is an omitempty parameter. This means that if the property is null, it will be excluded
   from the JSON data rather than showing up as an empty string or value. */

type Song struct {
	ID               int     `json:"id,omitempty"`
	Artist           string  `json:"artist,omitempty"`
	URL_Spotify      string  `json:"url_spotify,omitempty"`
	Track            string  `json:"track,omitempty"`
	Album            string  `json:"album,omitempty"`
	Album_Type       string  `json:"album_type,omitempty"`
	URI              string  `json:"uri,omitempty"`
	Danceability     float64 `json:"danceability,omitempty"`
	Energy           float64 `json:"energy,omitempty"`
	Key              int     `json:"key,omitempty"`
	Loudness         float64 `json:"loudness,omitempty"`
	Speechiness      float64 `json:"speechiness,omitempty"`
	Acousticness     float64 `json:"acousticness,omitempty"`
	Instrumentalness float64 `json:"instrumentalness,omitempty"`
	Liveness         float64 `json:"liveness,omitempty"`
	Valence          float64 `json:"valence,omitempty"`
	Tempo            float64 `json:"tempo,omitempty"`
	Duration_ms      int     `json:"duration_ms,omitempty"`
	URL_Youtube      string  `json:"url_youtube,omitempty"`
	Title            string  `json:"title,omitempty"`
	Channel          string  `json:"channel,omitempty"`
	Views            int     `json:"views,omitempty"`
	Likes            int     `json:"likes,omitempty"`
	Comments         int     `json:"comments,omitempty"`
	Description      string  `json:"description,omitempty"`
	Licensed         bool    `json:"licensed,omitempty"`
	Official_Video   bool    `json:"official_video,omitempty"`
	Stream           int     `json:"stream,omitempty"`
}

// Create public variables that are global to the project (since we are not using a database).

var song Song
var songs []Song

// Create endpoint that returns all records

func GetSongs(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(songs)
}

/* Create endpoint that returns a single record. Using the mux library we can get any parameters that
   were passed in with the request. We then loop over our global slice and look for any ids that match
   the id found in the request parameters. If a match is found, use the JSON encoder to display it,
   otherwise create an empty JSON object. */

func GetSong(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	for _, item := range songs {
		params_ID, _ := strconv.Atoi(params["id"])
		if item.ID == params_ID {
			json.NewEncoder(w).Encode(item)
			return
		}
	}
	json.NewEncoder(w).Encode(&Song{})
}

/* The CreateSong endpoint decodes the JSON data that was passed in and stores it in a Song object.
   We assign the new object an id based on what mux found and then we append it to our global slice.
   In the end, our global array will be returned and it should include everything including our newly
   added piece of data. */

func CreateSong(w http.ResponseWriter, r *http.Request) {
	var song Song
	_ = json.NewDecoder(r.Body).Decode(&song)
	songs = append(songs, song)
	json.NewEncoder(w).Encode(song)
}

// Create endpoint that updates a record

func UpdateSong(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	for index, item := range songs {
		params_ID, _ := strconv.Atoi(params["id"])
		if item.ID == params_ID {
			songs = append(songs[:index], songs[index+1:]...)
			var song Song
			_ = json.NewDecoder(r.Body).Decode(&song)
			song.ID = params_ID
			songs = append(songs, song)
			json.NewEncoder(w).Encode(song)
			return
		}
	}
	json.NewEncoder(w).Encode(songs)
}

/* The DeleteSong endpoint loops through the data similarly to the GetSong endpoint. The difference
   is that instead of printing the data, we need to remove it. When the id to be deleted has been found,
   we can recreate our slice with all data excluding that found at the index. */

func DeleteSong(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	for index, item := range songs {
		params_ID, _ := strconv.Atoi(params["id"])
		if item.ID == params_ID {
			songs = append(songs[:index], songs[index+1:]...)
			break
		}
	}
	json.NewEncoder(w).Encode(songs)
}

func GetRecommendations(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	songID, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid song ID", http.StatusBadRequest)
		return
	}

	// Create request to recommender service with GET method
	req, err := http.NewRequest("GET", "http://recommender:5000/recommend", nil)
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	// Add query parameters
	query := req.URL.Query()
	query.Add("song_id", strconv.Itoa(songID))
	query.Add("num_recommendations", "5")
	req.URL.RawQuery = query.Encode()

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Error communicating with recommender service", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Forward the response from the recommender service
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Error reading response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(body)
}

/* Create a new router and add objects to the slice. Create each of the endpoints that will call our
   endpoint functions. Define that our server will run on port 8000. */

func main() {
	router := mux.NewRouter()

	csvFile, err := os.Open("C:/Users/brendan.soh/Projects/Spotify_Youtube_API/Spotify_Youtube_API_Backend/Spotify_Youtube.csv")
	if err != nil {
		fmt.Println(err)
		defer csvFile.Close()
		return // Ensure you return here to avoid further execution
	}

	reader := csv.NewReader(csvFile)
	reader.FieldsPerRecord = -1

	csvData, err := reader.ReadAll()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	for _, each := range csvData {
		song.ID, _ = strconv.Atoi(each[0])
		song.Artist = each[1]
		song.URL_Spotify = each[2]
		song.Track = each[3]
		song.Album = each[4]
		song.Album_Type = each[5]
		song.URI = each[6]
		song.Danceability, _ = strconv.ParseFloat(each[7], 64)
		song.Energy, _ = strconv.ParseFloat(each[8], 64)
		song.Key, _ = strconv.Atoi(each[9])
		song.Loudness, _ = strconv.ParseFloat(each[10], 64)
		song.Speechiness, _ = strconv.ParseFloat(each[11], 64)
		song.Acousticness, _ = strconv.ParseFloat(each[12], 64)
		song.Instrumentalness, _ = strconv.ParseFloat(each[13], 64)
		song.Liveness, _ = strconv.ParseFloat(each[14], 64)
		song.Valence, _ = strconv.ParseFloat(each[15], 64)
		song.Tempo, _ = strconv.ParseFloat(each[16], 64)
		song.Duration_ms, _ = strconv.Atoi(each[17])
		song.URL_Youtube = each[18]
		song.Title = each[19]
		song.Channel = each[20]
		song.Views, _ = strconv.Atoi(each[21])
		song.Likes, _ = strconv.Atoi(each[22])
		song.Comments, _ = strconv.Atoi(each[23])
		song.Description = each[24]
		song.Licensed, _ = strconv.ParseBool(each[25])
		song.Official_Video, _ = strconv.ParseBool(each[26])
		song.Stream, _ = strconv.Atoi(each[27])
		songs = append(songs, song)
	}

	//Define the routes
	router.HandleFunc("/songs", GetSongs).Methods("GET")
	router.HandleFunc("/songs/{id}", GetSong).Methods("GET")
	router.HandleFunc("/songs", CreateSong).Methods("POST")
	router.HandleFunc("/songs/{id}", UpdateSong).Methods("PUT")
	router.HandleFunc("/songs/{id}", DeleteSong).Methods("DELETE")
	router.HandleFunc("/recommendations/{id}", GetRecommendations).Methods("GET")

	// CORS configuration
	corsOptions := handlers.AllowedOrigins([]string{"*"})                                                 // Allow all origins
	corsMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})           // Allowed methods
	corsHeaders := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}) // Allowed headers

	// Start the server with CORS enabled
	log.Fatal(http.ListenAndServe(":8000", handlers.CORS(corsOptions, corsMethods, corsHeaders)(router)))
}
