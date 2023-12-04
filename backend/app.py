from flask import Flask 
#from flask_cors import CORS

app = Flask(__name__)
#CORS(app)

@app.route('/api', methods=['GET'])
def index():
  return {
    "channel": "The Show",
    "tutorial": "Laki, Flask and Docker"
  }

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')