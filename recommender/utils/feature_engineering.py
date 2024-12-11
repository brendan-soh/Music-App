import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler

def scale_audio_features(df, columns='None'):
    """
    Scale audio features using standard scaling
    
    Args:
        df (pd.DataFrame): Input DataFrame
        columns (list): List of columns to scale. If None, uses default audio features.
    
    Returns:
        pd.DataFrame: DataFrame with normalized features
    """
    if columns is None:
        columns = [
            'danceability', 'energy', 'key', 'loudness',
            'speechiness', 'acousticness', 'instrumentalness',
            'liveness', 'valence', 'tempo'
        ]

    df_normalized = df.copy()
    scaler = MinMaxScaler()

    df_normalized[columns] = scaler.fit_transform(df[columns])

    return df_normalized

def calculate_feature_importance(df, target_column=None):
    """
    Calculate feature importance using correlation
    
    Args:
        df (pd.DataFrame): Input DataFrame
        target_column (str): Target column for correlation. If None, uses all features.
    
    Returns:
        dict: Feature importance scores
    """
    audio_features = [
        'danceability', 'energy', 'key', 'loudness',
        'speechiness', 'acousticness', 'instrumentalness',
        'liveness', 'valence', 'tempo'
    ]

    if target_column:
        # Calculate correlation with a specific target column
        correlations = df[audio_features + [target_column]].corr()[target_column][audio_features]
    else:
        # Calculate inter-feature correlations
        correlations = np.abs(df[audio_features].corr()).mean()

    return dict(correlations)