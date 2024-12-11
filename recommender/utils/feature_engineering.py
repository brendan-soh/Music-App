import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler

def scale_features(df, columns, method='standard'):
    """
    Scale features using either standard scaling or min-max scaling
    
    Args:
        df (pd.DataFrame): Input DataFrame
        columns (list): List of columns to scale.
        method (str): Scaling method ('standard' or 'minmax')
    
    Returns:
        pd.DataFrame: DataFrame with scaled features
    """
    df_scaled = df.copy()

    if method == 'standard':
        scaler = StandardScaler()
    elif method == 'minmax':
        scaler = MinMaxScaler()
    else:
        raise ValueError("Method must be 'standard' or 'minmax'")
    
    df_scaled[columns] = scaler.fit_transform(df[columns])

    return df_scaled

def compute_feature_correlations(df, feature_columns):
    """
    Compute correlations between audio features
    
    Args:
        df (pd.DataFrame): Input DataFrame
        feature_columns (list): List of feature columns
        
    Returns:
        pd.DataFrame: Correlation matrix
    """
    return df[feature_columns].corr()