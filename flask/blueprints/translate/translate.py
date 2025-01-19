from flask import Blueprint, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import concurrent.futures

# Load the tokenizer and model
model_name = "facebook/nllb-200-distilled-600M"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer.src_lang = "eng"  # Source language code (English)

translate = Blueprint("translate", __name__)

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

def translate_text(content, target_language):
    # Tokenize the input
    inputs = tokenizer(content, return_tensors="pt")

    # Convert language token to ID (e.g., "mar_Deva" for Marathi in Devanagari)
    forced_bos_token_id = tokenizer.convert_tokens_to_ids(target_language)

    # Generate translation
    translated_tokens = model.generate(**inputs, forced_bos_token_id=forced_bos_token_id)

    # Decode the translated text
    translated_text = tokenizer.decode(translated_tokens[0], skip_special_tokens=True)
    return translated_text

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
            translated_text = translate_text(content, code)
            translations.append({lang_name: translated_text})
            print(f"Translated Text ({lang_name}): {translated_text}")
    return {"translations": translations}
    # except Exception as e:
    #     print(e)
    #     return {"ERROR": "Some error has occured"}

