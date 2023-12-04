from flask import Flask, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)

# MongoDB configuration
app.config['MONGO_URI'] = 'mongodb+srv://lakibrankovic01:portfolio123@cluster0.rfw70in.mongodb.net/'  # Update with your MongoDB URI
mongo = PyMongo(app)
db = mongo.db

@app.route('/api', methods=['GET'])
def index():
    # Access the MongoDB collection
    db.comments.insert_one({"channel": "The Show"})
    collection = db.users  # Update with your collection name

    # Example: Retrieve documents from the MongoDB collection
    data_from_mongo = collection.find_one({"channel": "The Show"})

    print(data_from_mongo)

    return {data_from_mongo}
    


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
