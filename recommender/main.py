import os
from flask import Flask, request, jsonify
from models.recommender import MusicRecommender

app = Flask(__name__)
recommender = MusicRecommender()

@app.route('/', methods=['GET'])
def index():
    """
    Root route to provide service information
    """
    return jsonify({
        "service": "Music Recommender",
        "status": "running",
        "available_endpoints": {
            "/recommend": "GET - Get song recommendations",
            "/health": "GET - Check service health"
        }
    }), 200

@app.route('/recommend', methods=['GET'])
def get_recommendations():
    """
    Endpoint to get music recommendations based on input song
    """
    try:
        # Use query parameters instead of JSON body
        song_id = request.args.get('song_id', type=int)
        num_recommendations = request.args.get('num_recommendations', default=5, type=int)

        if not song_id:
            return jsonify({"error": "Song ID is required"}), 400

        # Get recommendations
        recommendations = recommender.get_recommendations(song_id, num_recommendations)

        return jsonify({
            "recommended_tracks": recommendations
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)