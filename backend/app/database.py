import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient

load_dotenv()

MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb+srv://arenasgomez209_db_user:2z5W6miMwKtCBQlK@cluster0.74paph0.mongodb.net/?appName=Cluster0"
)
DB_NAME = os.getenv("DB_NAME", "megapunto_db")

# Async client for FastAPI routes
async_client = AsyncIOMotorClient(MONGODB_URL)
database = async_client[DB_NAME]

# Collections
users_collection = database["usuarios"]
products_collection = database["productos"]
services_collection = database["servicios"]
contacts_collection = database["contactos"]
sales_collection = database["ventas"]
sales_details_collection = database["detalle_ventas"]
invoices_collection = database["facturas"]
invoices_details_collection = database["detalle_facturas"]
pqr_collection = database["pqr"]
conversations_collection = database["conversaciones"]
messages_collection = database["mensajes"]


def get_database():
    return database

def get_sync_database():
    sync_client = MongoClient(MONGODB_URL)
    return sync_client[DB_NAME]

async def check_db_connection():
    try:
        # Ping the server
        await async_client.admin.command('ping')
        print("[DB] Conectado exitosamente a MongoDB Atlas!")
        return True
    except Exception as e:
        print(f"[DB] Error al conectar con MongoDB Atlas: {e}")
        return False

