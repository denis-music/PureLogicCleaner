import pandas as pd
import numpy as np
from datetime import datetime, date

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

def map_day_indexes_to_names(indexes):
    day_index_to_name = {
        0: "Monday",
        1: "Tuesday",
        2: "Wednesday",
        3: "Thursday",
        4: "Friday",
        5: "Saturday",
        6: "Sunday"
    }

    day_names = [day_index_to_name.get(index, "Invalid Index") for index in indexes]
    return day_names

def get_current_season():
    now = datetime.now()

    month = now.month
    if 3 <= month <= 5:
        return 'Spring'
    elif 6 <= month <= 8:
        return 'Summer'
    elif 9 <= month <= 11:
        return 'Autumn'
    else:
        return 'Winter'

def calculate_days_between_given_date_and_today(given_date):
        date_format = "%d-%m-%Y"
        given_date_obj = datetime.strptime(given_date, date_format).date()
        today_date_obj = date.today()
        difference = (today_date_obj - given_date_obj).days

        return difference

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