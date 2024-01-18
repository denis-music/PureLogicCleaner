import pandas as pd
import numpy as np
import datetime

def random_multiple_indexes(num_choices, n_samples, max_selections=3):
    return [np.random.choice(range(num_choices), size=np.random.randint(1, max_selections+1), replace=False).tolist() for _ in range(n_samples)]

def process_real_user_data(user_data, mlb_days, mlb_rooms):
    user_df = pd.DataFrame([user_data])
    one_hot_preferred_days = pd.DataFrame(mlb_days.transform([user_data['preferred_days']]),
                                          columns=['day_' + str(i) for i in mlb_days.classes_])
    one_hot_priority_rooms = pd.DataFrame(mlb_rooms.transform([user_data['priority_rooms']]),
                                          columns=['room_' + str(i) for i in mlb_rooms.classes_])
    user_df = pd.concat([user_df.drop(['preferred_days', 'priority_rooms'], axis=1), 
                         one_hot_preferred_days, one_hot_priority_rooms], axis=1)
    return user_df.values[0]

def find_next_preferred_day(predicted_days, preferred_days):
    predicted_date = datetime.datetime.today() + datetime.timedelta(days=predicted_days)
    predicted_weekday = predicted_date.weekday()  # Monday is 0, Sunday is 6

    # Find the next preferred day
    days_until_next_preferred = min([(preferred_day - predicted_weekday) % 7 for preferred_day in preferred_days])

    # If the predicted day is already a preferred day, keep the original prediction
    if days_until_next_preferred == 0:
        return predicted_days
    else:
        return predicted_days + days_until_next_preferred

def adjust_for_pets_allergies(predicted_days, has_pets_allergies):
    if has_pets_allergies:
        return max(1, predicted_days - 2)  
    else:
        return predicted_days