# backend-python/postgres_check.py
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()  # loads DATABASE_URL

def connect_and_check():
    try:
        print("🔹 Attempting to connect to Postgres...")
        conn = psycopg2.connect(os.getenv("DATABASE_URL"), sslmode="require")
        cur = conn.cursor()
        cur.execute("SELECT NOW();")
        print("✅ Connected successfully!")
        print("Current time in Postgres:", cur.fetchone())
        cur.close()
        conn.close()
    except Exception as e:
        print("❌ Connection failed:", e)

if __name__ == "__main__":
    connect_and_check()
