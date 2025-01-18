from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os, json

beautify = Blueprint("beautify", __name__)

genai.configure(api_key=os.environ['GEMINI_API_KEY'])
MODEL = genai.GenerativeModel('gemini-1.5-flash')

@beautify.route('/markdown', methods=['POST'])
def beautifyMarkdown():
    try:
        data = request.get_json()
        content = data.get("content", "")
        response = MODEL.generate_content(f'''Beautify this raw transcription by converting it into markdown. Style and emphasize appropriate words as needed in the context of the content.
                                           {content}
                                            Only return markdown and nothing else.''').text
        return {'content': json.dumps(response)}
    
    except Exception as e:
        print(e)
        return {"error": "An error occurred!"}