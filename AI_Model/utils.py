import pandas as pd
import numpy as np
import datetime

def transform_data_to_model_format(user_data, training_columns, mlb_days, mlb_rooms):
    # Convert the user data to a DataFrame
    user_df = pd.DataFrame([user_data])

    # Add feature engineering
    user_df = combine_room_size_type(user_df)
    user_df = add_seasonal_cleaning_factor(user_df)
    user_df = room_usage_indicator(user_df)
    user_df = allergy_pet_impact(user_df)

    # Binarize 'preferred_cleaning_days' and 'priority_rooms' for user data
    days_binarized_user = mlb_days.transform(user_df['preferred_cleaning_days'])
    rooms_binarized_user = mlb_rooms.transform(user_df['priority_rooms'])

    # Create dataframes from the binarized arrays
    days_df_user = pd.DataFrame(days_binarized_user, columns=mlb_days.classes_)
    rooms_df_user = pd.DataFrame(rooms_binarized_user, columns=mlb_rooms.classes_)

    # Concatenate the new dataframes with the user_df
    user_df = pd.concat([user_df.drop(['preferred_cleaning_days', 'priority_rooms'], axis=1), days_df_user, rooms_df_user], axis=1)

    # Apply one-hot encoding to categorical variables
    user_df = pd.get_dummies(user_df)

    # Ensure the user_df has all the columns from the training data
    missing_cols = set(training_columns) - set(user_df.columns)
    for c in missing_cols:
        user_df[c] = 0

    # Reorder the columns to match the training data
    user_df = user_df[training_columns]

    return user_df

def combine_room_size_type(df):
    df['room_size_type'] = df['room_type'] + '_' + df['room_size']

    return df

def add_seasonal_cleaning_factor(df):
    season_factors = {'Spring': 1, 'Summer': 1.2, 'Autumn': 1.1, 'Winter': 1.3}

    df['seasonal_cleaning_factor'] = df['season'].map(season_factors)

    return df

def room_usage_indicator(df):
    size_map = {'Small': 1, 'Medium': 2, 'Large': 3}
    frequency_map = {'Low': 1, 'Medium': 2, 'High': 3}

    df['room_usage_indicator'] = df['room_size'].map(size_map) * df['usage_frequency'].map(frequency_map)

    return df

def allergy_pet_impact(df):
    df['allergy_pet_impact'] = df['pets'].astype(int) + df['allergies'].astype(int)

    return df