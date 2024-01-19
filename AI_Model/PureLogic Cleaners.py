import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
import datetime

from utils import transform_data_to_model_format, combine_room_size_type, add_seasonal_cleaning_factor, room_usage_indicator, allergy_pet_impact

n_samples = 10000
np.random.seed(0)

survey_df = pd.DataFrame({
    'room_type': np.random.choice(['Kitchen', 'Living Room', 'Bathroom', 'Bedroom', 'Dining Room', 'Study', 'Hallway', 'Garage'], n_samples),
    'room_size': np.random.choice(['Small', 'Medium', 'Large'], n_samples),
    'surface_type': np.random.choice(['Carpet', 'Hardwood', 'Tile'], n_samples),
    'usage_frequency': np.random.choice(['High', 'Medium', 'Low'], n_samples),
    'days_since_last_cleaning': np.random.randint(1, 15, n_samples),
    'cleaning_duration': np.random.randint(15, 120, n_samples),
    'cleaning_quality': np.random.choice(['Thorough', 'Basic', 'Quick'], n_samples),
    'number_of_occupants': np.random.randint(1, 6, n_samples),
    'pets': np.random.choice([True, False], n_samples),
    'allergies': np.random.choice([True, False], n_samples),
    'preferred_cleaning_days': np.random.choice(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], n_samples),
    'preferred_cleaning_frequency': np.random.choice([
        'Daily', 'Every 3 Days', 'Twice a Week', 'Weekly', 'Fortnightly', 
        'Bi-Weekly', 'Twice a Month', 'Monthly', 'Bi-Monthly', 
        'Quarterly', 'Seasonally', 'Yearly', 'As Needed'
    ], n_samples),
    'priority_rooms': np.random.choice(['Kitchen', 'Living Room', 'Bathroom', 'Bedroom', 'Dining Room', 'Study', 'Hallway', 'Garage'], n_samples),
    'season': np.random.choice(['Spring', 'Summer', 'Autumn', 'Winter'], n_samples),
    'days_until_next_cleaning': np.random.randint(1, 15, n_samples)
})

survey_df['preferred_cleaning_days'] = survey_df['preferred_cleaning_days'].apply(lambda x: [x])
survey_df['priority_rooms'] = survey_df['priority_rooms'].apply(lambda x: [x])

# Implement Feature Engineering
survey_df = combine_room_size_type(survey_df)
survey_df = add_seasonal_cleaning_factor(survey_df)
survey_df = room_usage_indicator(survey_df)
survey_df = allergy_pet_impact(survey_df)

# Initialize MultiLabelBinarizer
mlb_days = MultiLabelBinarizer()
mlb_rooms = MultiLabelBinarizer()

# Binarize 'preferred_cleaning_days' and 'priority_rooms'
days_binarized = mlb_days.fit_transform(survey_df['preferred_cleaning_days'])
rooms_binarized = mlb_rooms.fit_transform(survey_df['priority_rooms'])

# Create dataframes from the binarized arrays and add them back to the survey_df
days_df = pd.DataFrame(days_binarized, columns=mlb_days.classes_)
rooms_df = pd.DataFrame(rooms_binarized, columns=mlb_rooms.classes_)

# Concatenate the new dataframes with the original survey_df
survey_df = pd.concat([survey_df.drop(['preferred_cleaning_days', 'priority_rooms'], axis=1), days_df, rooms_df], axis=1)

# Preparing the features and targets
X = pd.get_dummies(survey_df.drop(['days_until_next_cleaning'], axis=1))
Y = survey_df['days_until_next_cleaning']

# Splitting the dataset
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# Training the models
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Example real user data
real_user_data = {
    'room_type': 'Kitchen',
    'room_size': 'Small',
    'surface_type': 'Tile',
    'usage_frequency': 'Medium',
    'days_since_last_cleaning': 3,
    'cleaning_duration': 25,
    'cleaning_quality': 'Basic',
    'number_of_occupants': 4,
    'pets': True,
    'allergies': False,
    'preferred_cleaning_days': ['Monday','Saturday', 'Sunday'],
    'preferred_cleaning_frequency': 'Weekly',
    'priority_rooms':['Bedroom'],
    'season': 'Summer',
}

# Match new input data with the AI model
processed_user_data = transform_data_to_model_format(real_user_data, X_train.columns, mlb_days, mlb_rooms)

# Predicting for the real user
predicted_days_until_next_cleaning = model.predict(processed_user_data)

# Round prediction number
rounded_prediction_days = round(predicted_days_until_next_cleaning[0])

# Calculate the adjusted cleaning date
adjusted_cleaning_date = datetime.datetime.today() + datetime.timedelta(days=rounded_prediction_days)

# Output
room_type = real_user_data['room_type']
predicted_cleaning_days = rounded_prediction_days
cleaning_date = adjusted_cleaning_date.strftime('%A, %d-%m-%Y')

print(f"For the {room_type}, the next predicted cleaning is in {predicted_cleaning_days} days, scheduled for {cleaning_date}.")