import pandas as pd
from datetime import datetime, date
from enum import Enum

# ENUMS

class RoomSize(Enum):
    Small = 0
    Medium = 1
    Large = 2

class SurfaceType(Enum):
    Carpet = 0
    Hardwood = 1
    Tile = 2

class UsageFrequency(Enum):
    Low = 0
    Medium = 1
    High = 2
    
class CleaningQuality(Enum):
    Quick = 0
    Basic = 1
    Thorough = 2

class CleaningFrequency(Enum):
    Daily = 0
    EveryThreeDays = 1
    TwiceAWeek = 2
    Weekly = 3
    Fortnightly = 4
    BiWeekly = 5
    TwiceAMonth = 6
    Monthly = 7
    BiMonthly = 8
    Quarterly = 9
    Seasonally = 10
    Yearly = 11
    AsNeeded = 12

# MAPPERS
    
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

def map_room_size(value):
    try:
        return RoomSize(value).name
    except ValueError:
        return "Invalid Value" 

def map_surface_type(value):
    try:
        return SurfaceType(value).name
    except ValueError:
        return "Invalid Value" 

def map_usage_frequency(value):
    try:
        return UsageFrequency(value).name
    except ValueError:
        return "Invalid Value"

def map_cleaning_quality(value):
    try:
        return CleaningQuality(value).name
    except ValueError:
        return "Invalid Value"

def map_cleaning_frequency(value):
    try:
        return CleaningFrequency(value).name
    except ValueError:
        return "Invalid Value" 

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
    
def get_room_names_from_ids(room_ids_list, rooms_list):
    room_names = []

    for room_id in room_ids_list:
        found_room = next((room for room in rooms_list if room['id'] == room_id), None)

        if found_room:
            room_names.append(found_room.get('name', 'Unknown Room'))
        else:
            room_names.append("Unknown Room")

    return room_names

# DATA TRANSFORMATION AND FEATURE ENGINEERING

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