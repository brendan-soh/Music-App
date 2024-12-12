import os
from flask import Flask, request, jsonify
from models.recommender import MusicRecommender

app = Flask(__name__)
recommender = MusicRecommender()

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    """
    Endpoint to get music recommendations based on input song
    """
    try:
        data = request.get_json()
        song_id = data.get('song_id')
        num_recommendations = data.get('num_recommendations', 5)

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
    app.run(host='0.0.0.0', port=5000)