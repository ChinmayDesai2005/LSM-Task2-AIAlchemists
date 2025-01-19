from flask import Blueprint, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os, json, codecs
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

languages = [
    {"hindi": "hin_Deva"},
    {"marathi": "mar_Deva"},
    {"gujarati": "guj_Gujr"},
    {"bengali": "asm_Beng"},
    {"oriya": "ory_Orya"},
    {"tamil": "tam_Taml"},
    {"malayalam": "mal_Mlym"},
    {"kannada": "kan_Knda"},
    {"telugu": "tel_Telu"},
    {"punjabi": "pan_Guru"}
]

languages = [{"hindi" : ""}]

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
#   "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction="You are multilingual chatbot, Who is able to translate in 10 different languages. You will translate the given content into the given language.",
)

translate = Blueprint("translate", __name__)
chat = model.start_chat()


# def translate_text(content, target_language):
#     # Tokenize the input
#     inputs = tokenizer(content, return_tensors="pt")

#     # Convert language token to ID (e.g., "mar_Deva" for Marathi in Devanagari)
#     forced_bos_token_id = tokenizer.convert_tokens_to_ids(target_language)

#     # Generate translation
#     translated_tokens = model.generate(**inputs, forced_bos_token_id=forced_bos_token_id)

#     # Decode the translated text
#     translated_text = tokenizer.decode(translated_tokens[0], skip_special_tokens=True)
#     return translated_text

@translate.route('/', methods=['POST'])
def translateFromEnglish():
    # try:
    data = request.get_json()
    content = data.get('content', '')
    translations = []
    
    if content:
        for lang in languages:
            lang_name, code = list(lang.keys())[0], list(lang.values())[0]
            print(lang_name, code)
            translated_text = chat.send_message(f'''Convert the below content into {lang_name}:\n {content}''')
            # translated_text = model.generate_content(f'''Convert the below content into {lang_name}:\n {content}''')
            translations.append({"content": codecs.decode(json.dumps(translated_text.text), 'unicode_escape'), "language": lang_name})
            print(f"Translated Text ({lang_name}): {translated_text}")
    return {"translations": translations}
    # except Exception as e:
    #     print(e)
    #     return {"ERROR": "Some error has occured"}

