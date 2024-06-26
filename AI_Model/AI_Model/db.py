from azure.cosmos import CosmosClient
import uuid
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
import os

# Initialize Cosmos DB client
cosmos_client = CosmosClient(os.environ.get('DB_URL'), os.environ.get('DB_KEY'))

# Define the Cosmos DB database and container
database_name = os.environ.get('DB_NAME')

def get_users():
    try:
        container = cosmos_client.get_database_client(database_name).get_container_client('Users')

        query = f"SELECT * FROM c"
        
        users = list(container.query_items(query, enable_cross_partition_query=True))

        return users
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def get_rooms():
    try:
        container = cosmos_client.get_database_client(database_name).get_container_client('Rooms')

        query = f"SELECT * FROM c"
        
        rooms = list(container.query_items(query, enable_cross_partition_query=True))

        return rooms
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def get_user_rooms(user_id):
    try:
        container = cosmos_client.get_database_client(database_name).get_container_client('UserRooms')

        query = f"SELECT * FROM c WHERE c.userId = '{user_id}'"
        
        rooms = list(container.query_items(query, enable_cross_partition_query=True))

        return rooms
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def get_room(room_id):
    try:
        container = cosmos_client.get_database_client(database_name).get_container_client('Rooms')

        query = "SELECT * FROM c WHERE c.id = @room_id"
        parameters = [{"name": "@room_id", "value": room_id}]
        
        rooms = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))

        if rooms:
            return rooms[0]
        else:
            return None 
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def get_user_room_cleaning_history(user_room_id):
    try:
        container = cosmos_client.get_database_client(database_name).get_container_client('CleaningHistory')

        query = "SELECT * FROM c WHERE c.userRoomId = @user_room_id AND c.completed = true ORDER BY c.id DESC"
        parameters = [{"name": "@user_room_id", "value": user_room_id}]

        history = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))

        if history:
            return history[0]
        else:
            return None 
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def get_user_room_active_cleaning_predictions(user_room_id):
    try:
        container = cosmos_client.get_database_client(database_name).get_container_client('CleaningHistory')

        query = "SELECT * FROM c WHERE c.userRoomId = @user_room_id AND c.completed = false"
        parameters = [{"name": "@user_room_id", "value": user_room_id}]

        history = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))

        return history
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def add_to_cleaning_schedule(data):
    try:
        container = cosmos_client.get_database_client(database_name).get_container_client('CleaningHistory')

        if 'id' not in data:
            data['id'] = str(uuid.uuid4())

        container.create_item(body=data)
    except Exception as e:
        print(f"An error occurred: {e}")
        return None