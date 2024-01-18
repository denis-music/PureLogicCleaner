import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
import datetime

from utils import random_multiple_indexes, process_real_user_data, find_next_preferred_day, adjust_for_pets_allergies

# Survey data setup
n_samples = 20000
np.random.seed(0)
rooms = ['Kitchen', 'Living Room', 'Bathroom', 'Bedroom', 'Dining Room', 'Study', 'Hallway', 'Garage']
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
frequencies = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Bi-Monthly', 'Quarterly', 'Yearly']
time_spent = ['<30 mins', '30-60 mins', '1-2 hours', '>2 hours']
pets_allergies = ['Pets', 'Allergies', 'None', 'Both']

cleaning_frequency_indexes = np.random.choice(range(len(frequencies)), n_samples)
time_spent_cleaning_indexes = np.random.choice(range(len(time_spent)), n_samples)
selected_pets_allergies_indexes = np.random.choice(range(len(pets_allergies)), n_samples)
number_of_occupants_indexes = np.random.randint(1, 6, n_samples)
preferred_days_indexes = random_multiple_indexes(len(days), n_samples, 7)
priority_rooms_indexes = random_multiple_indexes(len(rooms), n_samples)

survey_df = pd.DataFrame({
    'preferred_days': preferred_days_indexes,
    'priority_rooms': priority_rooms_indexes,
    'cleaning_frequency': cleaning_frequency_indexes,
    'time_spent_cleaning': time_spent_cleaning_indexes,
    'pets_allergies': selected_pets_allergies_indexes,
    'number_of_occupants': number_of_occupants_indexes,
    'days_until_next_cleaning': np.random.randint(1, 30, size=n_samples),
    'target_room': [np.random.choice(rooms) for _ in range(n_samples)]
})

mlb_days = MultiLabelBinarizer(classes=range(len(days)))
mlb_rooms = MultiLabelBinarizer(classes=range(len(rooms)))

one_hot_preferred_days = pd.DataFrame(mlb_days.fit_transform(survey_df.pop('preferred_days')),
                                      columns=['day_' + str(i) for i in mlb_days.classes_],
                                      index=survey_df.index)

survey_df = survey_df.join(one_hot_preferred_days)

one_hot_priority_rooms = pd.DataFrame(mlb_rooms.fit_transform(survey_df.pop('priority_rooms')),
                                      columns=['room_' + str(i) for i in mlb_rooms.classes_],
                                      index=survey_df.index)
survey_df = survey_df.join(one_hot_priority_rooms)

# Preparing the features and targets
X = survey_df.drop(['days_until_next_cleaning', 'target_room'], axis=1).to_numpy()
y_days = survey_df['days_until_next_cleaning']
y_room = survey_df['target_room']

# Splitting the dataset
X_train_days, X_test_days, y_train_days, y_test_days = train_test_split(X, y_days, test_size=0.2, random_state=42)
X_train_room, X_test_room, y_train_room, y_test_room = train_test_split(X, y_room, test_size=0.2, random_state=42)

# Training the models
model_days = RandomForestRegressor(n_estimators=100, random_state=42)
model_days.fit(X_train_days, y_train_days)

model_room = RandomForestClassifier(n_estimators=100, random_state=42)
model_room.fit(X_train_room, y_train_room)

# Example real user data
real_user_data = {
    'preferred_days': [0, 1, 2, 3, 4],
    'priority_rooms': [0, 2], 
    'cleaning_frequency': 1, 
    'time_spent_cleaning': 2,
    'pets_allergies': 3,
    'number_of_occupants': 2
}

# Process real user data
processed_user_data = process_real_user_data(real_user_data, mlb_days, mlb_rooms)

# Check for pets or allergies in real user data
has_pets_allergies = real_user_data['pets_allergies'] in [0, 3]  # Assuming 0 is 'Pets' and 3 is 'Both'

# Predicting for the real user
predicted_days_until_next_cleaning = model_days.predict([processed_user_data])[0]

rounded_prediction_days = round(predicted_days_until_next_cleaning)

# Adjust for pets or allergies
adjusted_days_for_pets_allergies = adjust_for_pets_allergies(rounded_prediction_days, has_pets_allergies)

# Adjusting to the next preferred day
adjusted_days_until_next_cleaning = find_next_preferred_day(adjusted_days_for_pets_allergies, real_user_data['preferred_days'])

# Calculate the adjusted cleaning date
adjusted_cleaning_date = datetime.datetime.today() + datetime.timedelta(days=adjusted_days_until_next_cleaning)

# Predict the room
predicted_room = model_room.predict([processed_user_data])[0]

print(f"Predicted days until next cleaning: {rounded_prediction_days}, Date: {adjusted_cleaning_date.strftime('%d-%m-%Y')}")
print(f"Predicted room to clean next: {predicted_room}")
