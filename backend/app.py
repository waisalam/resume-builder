from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import PyPDF2

from atfAnalyzer import analyze_resume

app = Flask(__name__)
CORS(app)

# LOAD MODEL
model = pickle.load(open('resume_model.pkl', 'rb'))

# LOAD VECTORIZER
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))# LOAD MODEL
model = pickle.load(open('resume_model.pkl', 'rb'))

# LOAD VECTORIZER
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))

@app.route('/analyze',methods=['POST'])
def analyze():
    file = request.files['resume']
    job_description = request.form['job_description']

    reader = PyPDF2.PdfReader(file)
    text =""
    for page in reader.pages:
        extracted= page.extract_text()

        if extracted:
            text += extracted 

    resume_text = text.lower()

    resume_vector = vectorizer.transform([resume_text])    

    prediction = model.predict(resume_vector)    
    predicted_role= prediction[0]


    #ATS analyze
    ats_result = analyze_resume(
        resume_text,
        job_description
    )

    return jsonify({
        "predicted_role":predicted_role,
        "ats_score" : ats_result['score'],
        'found_skills': ats_result['found_skills'],
        'missing_skills':ats_result['missing_skills']
    })

if __name__ == "__main__":
    app.run(debug=True)
