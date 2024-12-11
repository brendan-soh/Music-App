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

    def test_song_details(self):
        test_song_id = self.recommender.df['id'].iloc[0]
        song_details = self.recommender.get_song_details(test_song_id)

        self.assertIsNotNone(song_details)
        self.assertEqual(song_details['id'], test_song_id)

    def test_no_song_details(self):
        song_details = self.recommender.get_song_details(-1)
        self.assertIsNone(song_details)

if __name__ == '__main__':
    unittest.main()