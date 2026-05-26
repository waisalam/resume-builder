import pandas as pd 
import re
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

df = pd.read_csv('Resume.csv')

def clean_text(text):
    text = re.sub(r'http\S+\s*', ' ', text)

    text = re.sub(r'RT|cc', ' ', text)

    text = re.sub(r'#\S+', ' ', text)

    text = re.sub(r'@\S+', ' ', text)

    text = re.sub(r'[^\w\s]', ' ', text)

    text = re.sub(r'\s+', ' ', text)

    return text.lower()

df['cleanedResume'] = df['Resume_str'].apply(clean_text)

x = df['cleanedResume']
y = df['Category']

x_train, x_test, y_train, y_test = train_test_split(
    x,
    y,
    test_size=0.2,
    random_state=42
)

model = LogisticRegression()
vectorizer = TfidfVectorizer()
x_train_vectorized = vectorizer.fit_transform(x_train)
x_test_vectorized = vectorizer.transform(x_test)
model.fit(x_train_vectorized, y_train)

prediction = model.predict(x_test_vectorized)
print(prediction)

# SAVE MODEL
pickle.dump(model, open('resume_model.pkl', 'wb'))

# SAVE VECTORIZER
pickle.dump(vectorizer, open('vectorizer.pkl', 'wb'))
#checking accuracy
accuracy = accuracy_score(y_test, prediction)
print('Accuracy:', accuracy)

