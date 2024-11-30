####################################################################
####################################################################
####################################################################
#####################     CODE NOT WORKING     #####################
####################################################################
####################################################################
####################################################################
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
import os
from google.generativeai import Client
from clerk_backend_api import Clerk


# Initialize Flask App
app = Flask(__name__)
CORS(app)

# MongoDB Configuration
app.config["MONGO_URI"] = os.getenv("MONGO")
mongo = PyMongo(app)

# Clerk Configuration
clerk = Clerk(secret_key=os.getenv("CLERK_SECRET_KEY"))

# Google Generative AI Configuration
google_ai_client = Client(api_key=os.getenv("VITE_GEMINI_PUBLIC_KEY"))

# Collections
chat_collection = mongo.db.chat
user_chats_collection = mongo.db.userchats


# Middleware for Clerk Authentication
@app.before_request
def clerk_authentication():
    try:
        clerk.authenticate_request()
        request.user_id = clerk.user_id
    except Exception as e:
        return jsonify({"error": "Unauthenticated!"}), 401


# Route: Create a new chat
@app.route("/api/chats", methods=["POST"])
def create_chat():
    user_id = request.user_id
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        # Create new chat
        chat_data = {
            "userId": user_id,
            "history": [{"role": "user", "parts": [{"text": text}]}],
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
        }
        chat_id = chat_collection.insert_one(chat_data).inserted_id

        # Check if user chats exist
        user_chats = user_chats_collection.find_one({"userId": user_id})

        if not user_chats:
            # Create new user chats document
            user_chats_data = {
                "userId": user_id,
                "chats": [{"_id": str(chat_id), "title": text[:40], "createdAt": datetime.utcnow()}],
            }
            user_chats_collection.insert_one(user_chats_data)
        else:
            # Append to existing chats
            user_chats_collection.update_one(
                {"userId": user_id},
                {
                    "$push": {
                        "chats": {"_id": str(chat_id), "title": text[:40], "createdAt": datetime.utcnow()}
                    }
                },
            )

        return jsonify({"chatId": str(chat_id)}), 201

    except Exception as e:
        return jsonify({"error": "Error creating chat!"}), 500


# Route: Get user chats
@app.route("/api/userchats", methods=["GET"])
def get_user_chats():
    user_id = request.user_id

    try:
        user_chats = user_chats_collection.find_one({"userId": user_id})
        return jsonify(user_chats.get("chats", [])), 200
    except Exception as e:
        return jsonify({"error": "Error fetching user chats!"}), 500


# Route: Get chat by ID
@app.route("/api/chats/<chat_id>", methods=["GET"])
def get_chat(chat_id):
    user_id = request.user_id

    try:
        chat = chat_collection.find_one({"_id": ObjectId(chat_id), "userId": user_id})
        if not chat:
            return jsonify({"error": "Chat not found!"}), 404
        return jsonify(chat), 200
    except Exception as e:
        return jsonify({"error": "Error fetching chat!"}), 500


# Route: Update chat with new question/answer
@app.route("/api/chats/<chat_id>", methods=["PUT"])
def update_chat(chat_id):
    user_id = request.user_id
    data = request.json

    question = data.get("question", "")
    answer = data.get("answer", "")

    new_items = []
    if question:
        new_items.append({"role": "user", "parts": [{"text": question}]})
    if answer:
        new_items.append({"role": "model", "parts": [{"text": answer}]})

    try:
        chat_collection.update_one(
            {"_id": ObjectId(chat_id), "userId": user_id},
            {"$push": {"history": {"$each": new_items}}, "$set": {"updatedAt": datetime.utcnow()}},
        )
        return jsonify({"message": "Chat updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Error updating chat!"}), 500


# Route: Generate response using Google AI
@app.route("/api/generate-response", methods=["POST"])
def generate_response():
    data = request.json
    history = data.get("history", [])
    text = data.get("text", "")

    try:
        chat = google_ai_client.start_chat(
            history=[
                {"role": item["role"], "parts": [{"text": item["parts"][0]["text"]}]} for item in history
            ],
            generation_config={},
        )
        response = chat.send_message([text])
        answer = response.get("response", {}).get("text", "")
        return jsonify({"answer": answer}), 200
    except Exception as e:
        return jsonify({"error": "Something went wrong with the model!"}), 500


# Route: Get chat overviews
@app.route("/api/chat-overviews", methods=["GET"])
def get_chat_overviews():
    user_id = request.user_id

    try:
        user_chats = user_chats_collection.find_one({"userId": user_id})
        if not user_chats or not user_chats.get("chats"):
            return jsonify([]), 200

        overviews = []
        for chat in user_chats["chats"]:
            chat_data = chat_collection.find_one({"_id": ObjectId(chat["_id"]), "userId": user_id})
            if chat_data:
                summary = generate_chat_summary(chat["_id"], user_id)
                title = summary[:50] + "..." if len(summary) > 50 else summary
                overviews.append({
                    "_id": str(chat["_id"]),
                    "last_modified": chat_data["updatedAt"],
                    "title": title,
                    "summary": summary,
                    "createdAt": chat.get("createdAt"),
                })

        return jsonify(overviews), 200
    except Exception as e:
        return jsonify({"error": "Error fetching chat overviews!"}), 500


def generate_chat_summary(chat_id, user_id):
    """Helper function to generate chat summaries using Google AI."""
    chat = chat_collection.find_one({"_id": ObjectId(chat_id), "userId": user_id})
    if not chat:
        raise ValueError("Chat not found")

    formatted_history = [
        {"role": item["role"], "parts": [{"text": item["parts"][0]["text"]}]} for item in chat["history"]
    ]

    model_chat = google_ai_client.start_chat(
        history=formatted_history,
        generation_config={},
    )
    response = model_chat.send_message(["Please summarize this conversation in 30 words:"])
    return response.get("response", {}).get("text", "")


if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 3000)))
