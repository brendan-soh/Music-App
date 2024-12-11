import unittest
from models.recommender import MusicRecommender

class TestMusicRecommender(unittest.TestCase):
    def setUp(self):
        self.recommender = MusicRecommender()

    def test_recommendations(self):
        # Assuming there's at least one song in the dataset
        test_song_id = self.recommender.df['id'].iloc[0]
        recommendations = self.recommender.get_recommendations(test_song_id)

        self.assertEqual(len(recommendations), 5)
        self.assertNotIn(test_song_id, recommendations)

    def test_invalid_song_id(self):
        with self.assertRaises(ValueError):
            self.recommender.get_recommendations(-1)

    def test_get_song_features(self):
        test_song_id = self.recommender.df['id'].iloc[0]
        song_features = self.recommender.get_song_features(test_song_id)

        # Check that all expected keys are present
        expected_keys = [
            'danceability', 'energy', 'key', 'loudness',
            'speechiness', 'acousticness', 'instrumentalness',
            'liveness', 'valence', 'tempo',
            'track', 'artist'
        ]
        for key in expected_keys:
            self.assertIn(key, song_features)

if __name__ == '__main__':
    unittest.main()