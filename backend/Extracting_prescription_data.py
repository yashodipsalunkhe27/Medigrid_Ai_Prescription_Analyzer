from dotenv import load_dotenv, find_dotenv
import os
import base64
import io
import json
from groq import Groq
from PIL import Image
import location

load_dotenv()
api_key = os.getenv('GROQ_API_KEY')


class Handwritting_Extraction():

    def __init__(self):
        load_dotenv(find_dotenv())
        self.client = Groq(api_key=api_key)
        self.model_name = "qwen/qwen3.8-27b"  # current Groq vision-capable model

    def get_system_prompt(self, location_data):

        self.map_link_url = location.get_location(location_data)

        self.sys_prompt = '''
        You are an expert-level Medical Data Extraction tool. Your primary function is to analyze images of medical prescriptions and extract key information in a highly structured, machine-readable format.

        ## Your Task
        1. Perform OCR on all provided handwritten and printed text.
        2. Identify and extract key medical entities.
        3. **Ensure that no two medication entries are identical.**
        4. Include timings (e.g., 'after meals') within the frequency column.
        5. Add this link to the `Map_link` column for every entry: {}
        6. Fetch the patient details as patient_info compulsory, if not found return 'not provided'
        7. Importantly : only i want this columns : 'medications','Dosage','Frequency','Duration','Map_link' and
           in patient_info the columns are : 'Name','Age','Date'.

        ## Output Format
        You MUST return your findings in a strict json format only.
        patient_info and prescription data separate dictionaries in nested with other dictionary.

        The json structure must be:
        {{
            "patient_info": {{
                "patient_name": "johny",
                "age": "25",
                "Date": "25-10-2025"
            }},
            "Prescription_info": [
                {{
                    "medications": "Amoxilin",
                    "Dosage": "400mg",
                    "Frequency": "1-0-1 (after meals)",
                    "Duration": "5 days",
                    "Map_link": "https://...."
                }}
            ]
        }}

        ## Critical Guardrails
        * You are NOT a doctor. Do not provide medical advice.
        * If the image is blurry, return "Error: Image is unreadable".
        * If a field is missing, use "Not provided".
        '''.format(self.map_link_url)

        return self.sys_prompt

    def extracting_presc_data(self, image_file, location_data):
        self.system_Prompt = self.get_system_prompt(location_data)

        try:
            # Open and resize the image
            image = Image.open(image_file)

            max_width = 1024
            if image.width > max_width:
                ratio = max_width / image.width
                new_height = int(image.height * ratio)
                image = image.resize((max_width, new_height), Image.LANCZOS)

            # Convert PIL image to base64 data URL (Groq needs base64 or a public URL)
            if image.mode != "RGB":
                image = image.convert("RGB")
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG")
            img_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
            data_url = f"data:image/jpeg;base64,{img_base64}"

            # Groq chat completion with vision input, JSON mode, streaming
            stream = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": self.system_Prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Extract the prescription data from this image as JSON."},
                            {"type": "image_url", "image_url": {"url": data_url}},
                        ],
                    },
                ],
                response_format={"type": "json_object"},
                stream=True,
            )

            return stream

        except Exception as e:
            raise Exception(f'Error occured in Extracting prescription data: {e}')