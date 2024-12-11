import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
from sklearn.preprocessing import StandardScaler
import os

class MusicRecommender:
    def __init__(self, csv_path='../Spotify_Youtube.csv'):
        """
        Initialize the recommender with music data
        
        Args:
            csv_path (str): Path to the CSV file containing music data
        """
        # Ensure the CSV path is absolute
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        full_csv_path = os.path.join(base_dir, 'Spotify_Youtube.csv')

        # Load and preprocess data
        self.df = pd.read_csv(full_csv_path)

        # Select relevant features for recommendation
        self.feature_columns = [
            'Danceability', 'Energy', 'Key', 'Loudness',
            'Speechiness', 'Acousticness', 'Instrumentalness',
            'Liveness', 'Valence', 'Tempo'
        ]

        # Preprocess features
        self.scaler = StandardScaler()
        self.features = self.scaler.fit_transform(self.df[self.feature_columns])

    def get_recommendations(self, song_id, num_recommendations=5):
        """
        Get music recommendations based on a song ID
        
        Args:
            song_id (int): ID of the source song
            num_recommendations (int): Number of recommendations to return
            
        Returns:
            list: List of recommended song IDs
        """
        try:
            # Find the index of the input song
            song_indices = self.df[self.df['id'] == song_id].index

            if len(song_indices) == 0:
                raise ValueError(f"Song ID {song_id} not found in the dataset")
            
            song_index = song_indices[0]

            # Get the feature vector for the input song
            song_features = self.features[song_index]

            # Calculate cosine distances between the input song and all other songs
            distances = [cosine(song_features, other_features)
                         for other_features in self.features]
            
            # Sort indices based on distances (lower distance means more similar)
            sorted_indices = np.argsort(distances)

            # Get recommended indices, excluding the original song
            recommended_indices = [
                idx for idx in sorted_indices[1:]
                if idx != song_index
            ][:num_recommendations]

            # Return recommended song IDs
            recommended_songs = self.df.iloc[recommended_indices]['id'].tolist()

            return recommended_songs
        
        except Exception as e:
            raise RuntimeError(f"Error generating recommendations: {str(e)}")
        
    def get_song_features(self, song_id):
        """
        Get feature details for a specific song
        
        Args:
            song_id (int): ID of the song
            
        Returns:
            dict: Dictionary of song features
        """
        song = self.df[self.df['id'] == song_id]

        if len(song) == 0:
            raise ValueError(f"Song ID {song_id} not found in the dataset")
        
        return song[self.feature_columns + ['track', 'artist']].to_dict('records')[0]