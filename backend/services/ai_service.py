import os
import requests
from dotenv import load_dotenv

load_dotenv()

def generate_health_remarks(
    full_name,
    date_of_birth,
    glucose,
    haemoglobin,
    cholesterol
):
    try:
        prompt = f"""
Patient: {full_name}
DOB: {date_of_birth}
Glucose: {glucose}
Haemoglobin: {haemoglobin}
Cholesterol: {cholesterol}
"""

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            },
            timeout=20
        )

        data = response.json()

        if "choices" in data:
            return data["choices"][0]["message"]["content"]

        print("OpenRouter Error:", data)

    except Exception as e:
        print("AI Error:", e)

    remarks = []

    if glucose > 140:
        remarks.append("Elevated glucose may indicate diabetes risk.")

    if cholesterol > 200:
        remarks.append("High cholesterol may increase cardiovascular risk.")

    if haemoglobin < 12:
        remarks.append("Low haemoglobin may indicate anemia.")

    if not remarks:
        remarks.append("Blood parameters appear within normal range.")

    return " ".join(remarks)