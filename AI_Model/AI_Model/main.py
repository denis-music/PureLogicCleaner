import datetime
from dotenv import load_dotenv

load_dotenv()  

from .model import get_model

from .utils import (
    transform_data_to_model_format, get_current_season, map_day_indexes_to_names, calculate_days_between_given_date_and_today, 
    get_room_names_from_ids,map_cleaning_frequency, map_cleaning_quality, map_room_size, map_surface_type, map_usage_frequency
)

from .db import (
    get_users, get_rooms, get_user_rooms, get_user_room_cleaning_history, get_room, 
    add_to_cleaning_schedule, get_user_room_active_cleaning_predictions
)

def run_prediction():
    model, X_train, mlb_days, mlb_rooms = get_model()

    user_data_iterator = get_users()
    rooms_iterator = get_rooms()

    for user_data in user_data_iterator:

        user_rooms_iterator = get_user_rooms(user_data['id'])

        for user_rooms in user_rooms_iterator:
            try:
                room = get_room(user_rooms['roomId'])
                cleaning_history = get_user_room_cleaning_history(user_rooms['id'])

                active_predictions_for_user_room = get_user_room_active_cleaning_predictions(user_rooms['id'])

                # Only one active prediction for user_rooms
                if(len(active_predictions_for_user_room) > 0):
                    continue

                real_user_data = {
                    "room_type": room['name'],
                    "room_size": map_room_size(user_rooms['roomSize']),
                    "surface_type": map_surface_type(user_rooms['surfaceType']),
                    "usage_frequency": map_usage_frequency(user_rooms['usageFrequency']),
                    "number_of_occupants": user_rooms['numberOfOccupants'],
                    "days_since_last_cleaning": 0,
                    "cleaning_duration": 0,
                    "cleaning_quality": "Basic",
                    "pets": user_data['pets'],
                    "allergies": user_data['allergies'],
                    "preferred_cleaning_days": map_day_indexes_to_names(user_data['preferredCleaningDays']),
                    "preferred_cleaning_frequency": map_cleaning_frequency(user_data['preferredCleaningFrequency']),
                    "priority_rooms": get_room_names_from_ids(user_data['priorityRoomIds'], rooms_iterator),
                    "season": get_current_season()
                }

                if cleaning_history != None:
                    real_user_data['days_since_last_cleaning']: calculate_days_between_given_date_and_today(cleaning_history['date'])
                    real_user_data["cleaning_duration"]: cleaning_history['cleaningDurationInMins']
                    real_user_data["cleaning_quality"]: map_cleaning_quality(cleaning_history['cleaningQuality'])

                # Match new input data with the AI model
                processed_user_data = transform_data_to_model_format(real_user_data, X_train.columns, mlb_days, mlb_rooms)

                # Predicting for the real user
                predicted_days_until_next_cleaning = model.predict(processed_user_data)

                # Round prediction number
                rounded_prediction_days = round(predicted_days_until_next_cleaning[0])

                # Calculate the adjusted cleaning date
                adjusted_cleaning_date = datetime.datetime.today() + datetime.timedelta(days=rounded_prediction_days)

                add_to_cleaning_schedule({
                    "userRoomId" : user_rooms['id'],
                    "completed": False,
                    "cleaningDurationInMins": None,
                    "cleaningQuality": None,
                    "date": adjusted_cleaning_date.strftime("%Y-%m-%dT%H:%M:%S"),
                    "forDays": rounded_prediction_days
                })
            except Exception as e:
                print(f"An error occurred: {e}")