from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

# ENV Vars
PORT = os.environ['PORT'] or 5000

from blueprints.translate.translate import translate
from blueprints.beautify.beautify import beautify

app = Flask(__name__)
CORS(app,supports_credentials=True)

# Register Blueprints
app.register_blueprint(beautify, url_prefix="/v1/beautify")
app.register_blueprint(translate, url_prefix="/v1/translate")

if __name__ == "__main__":
    app.run(port=PORT, debug=False)