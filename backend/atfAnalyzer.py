from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

skills = [
    # Programming Languages
    'python',
    'java',
    'javascript',
    'typescript',
    'c',
    'c++',
    'c#',
    'php',
    'ruby',
    'swift',
    'kotlin',
    'go',
    'rust',
    'r',

    # Frontend
    'html',
    'css',
    'tailwind',
    'bootstrap',
    'react',
    'nextjs',
    'vue',
    'angular',

    # Backend
    'nodejs',
    'express',
    'django',
    'flask',
    'fastapi',
    'spring boot',
    'laravel',

    # Databases
    'mongodb',
    'mysql',
    'postgresql',
    'sqlite',
    'firebase',
    'redis',

    # DevOps / Cloud
    'docker',
    'kubernetes',
    'aws',
    'azure',
    'gcp',
    'jenkins',
    'nginx',
    'linux',
    'git',
    'github',

    # AI / ML
    'machine learning',
    'deep learning',
    'tensorflow',
    'pytorch',
    'scikit-learn',
    'nlp',
    'opencv',
    'pandas',
    'numpy',

    # Mobile
    'react native',
    'flutter',
    'android',
    'ios',

    # Tools
    'figma',
    'postman',
    'jira',
    'photoshop',

    # Concepts
    'data structures',
    'algorithms',
    'oop',
    'rest api',
    'microservices',
    'problem solving',

    # Soft Skills
    'communication',
    'leadership',
    'teamwork',
    'time management'
]

def analyze_resume(resume_text, job_description):

    resume_text = resume_text.lower()
    job_description = job_description.lower()

    found_skills = []

    for skill in skills:
        if skill in resume_text:
            found_skills.append(skill)

    required_skills = []

    for skill in skills:
        if skill in job_description:
            required_skills.append(skill)

    missing_skills = []

    for skill in required_skills:
        if skill not in found_skills:
            missing_skills.append(skill)

    # ATS SCORE
    resume_skills_text = " ".join(found_skills)
    job_roles_text = " ".join(required_skills)

    text = [resume_skills_text, job_roles_text]

    vectorizer = TfidfVectorizer()

    vectors = vectorizer.fit_transform(text)

    similarity = cosine_similarity(vectors[0], vectors[1])

    score = similarity[0][0] * 100

    return {
        "score": round(score, 2),
        "found_skills": found_skills,
        "missing_skills": missing_skills
    }