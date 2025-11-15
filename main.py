#%%
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests as req
from pypdf import PdfReader, PdfWriter

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)


@app.route("/news", methods=["GET"])
def indian_news():

    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "india",
        "apiKey": "7a41bf73467b4e309902b4b597c62a4ed"
    }

    a = req.get(url, params=params)
    data = a.json()
    return jsonify(data)



@app.route("/pdf1", methods=["GET"])
def pdf1():

    writer = PdfWriter()


    pdf1 = r"C:\Users\DIPAYAN\OneDrive\Desktop\6260 (1).pdf"
    pdf2 = r"C:\Users\DIPAYAN\OneDrive\Desktop\6261.pdf"


    for page in PdfReader(pdf1).pages:
        writer.add_page(page)

    for page2 in PdfReader(pdf2).pages:
        writer.add_page(page2)

    writer.write("merged.pdf")

    reader = PdfReader("merged.pdf")

    extracted = {}

    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        extracted[f"page_{i+1}"] = text

    return jsonify(extracted)


@app.route("/syllabus", methods=["GET"])
def syllabus():

    reader = PdfReader(r"C:\Users\DIPAYAN\OneDrive\Desktop\syllabus (3).pdf")

    extracted = {}

    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        extracted[f"page_{i+1}"] = text

    return jsonify(extracted)



@app.route("/notes", methods=["GET"])
def notes():

    reader = PdfReader(r"C:\Users\DIPAYAN\OneDrive\Desktop\ES-EE-191 MANUAL STUDENT COPY.pdf")

    extracted = {}

    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        extracted[f"page_{i+1}"] = text

    return jsonify(extracted)



@app.route("/chat", methods=["POST"])
def chat():
    """Handle chat messages and return AI responses"""
    data = request.get_json()
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    # You can integrate with an AI API here (e.g., OpenAI, Gemini, etc.)
    # For now, returning a response from the Python backend
    response = f"Backend response: {user_message}"
    
    return jsonify({"reply": response})


@app.route("/api/say_hello", methods=["POST"])
def say_hello():
    data = request.get_json(silent=True) or {}
    name = data.get('name') or data.get('username') or 'Student'
    return jsonify({"message": f"Hello {name}!"})


@app.route('/')
def serve_frontend():
    # Serve the index.html (and static assets) from project root so frontend and backend are on same origin.
    return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000)