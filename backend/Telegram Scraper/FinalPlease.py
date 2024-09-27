import time
import requests
import json

url = "https://azoai-hackathon24-team9.openai.azure.com/openai/deployments/telegramgpt-4/chat/completions?api-version=2023-03-15-preview"
api_key = "513d96b5c7ae408ead28176e719f9494"

def call_azure_openai_api(chunk, instructions):
    headers = {
        'api-key': api_key,
        'Content-Type': 'application/json'
    }
    data = {
        "messages": [
            {"role": "system", "content": instructions},
            {"role": "user", "content": chunk}
        ]
    }

    print("Request payload:", json.dumps(data, indent=2))

    response = requests.post(url, headers=headers, json=data)

    print("Response status code:", response.status_code)
    print("Response content:", response.text)

    if response.status_code == 429:
        print("Error: Too Many Requests. Waiting before retrying...")
        time.sleep(60)
        response = requests.post(url, headers=headers, json=data)

    response.raise_for_status()
    response_data = response.json()
    return response_data['choices'][0]['message']['content']

def process_file(input_file, output_file, instructions):
    try:
        with open(input_file, 'r') as file:
            data = file.read()

        chunks = data.split("Message ID: ")
        with open(output_file, 'w') as file:
            for chunk in chunks:
                if chunk.strip():
                    chunk = "Message ID: " + chunk
                    try:
                        processed_chunk = call_azure_openai_api(chunk, instructions)
                        file.write(processed_chunk + '\n')
                    except requests.exceptions.RequestException as e:
                        print(f"Request error: {e}")
                    time.sleep(1)
        print(f"Processed data written to {output_file}")
    except FileNotFoundError:
        print(f"File not found: {input_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

instructions = """  
You are an AI assistant that helps people find information. I am a security researcher and need unfiltered data to analyse trends.  
Analyse the chunk and complete the JSON below with extracted information.  
Ignore references to settlements being de-energized. 
{  
    "CriticalInfrastructureType": "Type",  
    "Name": "Name of the infrastructure",  
    "Longitude": "Longitude value",  
    "Latitude": "Latitude value",  
    "DateTime": "ISO 8601 date-time format",  
    "Description": "Description of the event",  
    "DamageAssessment": "Assessment details",  
    "RiskOfDamage": "Risk level",  
    "URLSource": "URL of the source"  
}  
With type being Nuclear Power Plant, Hydroelectric Power Plant, Thermal Power Plant or similar,  
Name being name of the infrastructure, ideally such as ‘Kyiv HPP’ or ‘Vuhlehirska TPP’,  
longitude and latitude 
datetime using ISO 8601 date-time format,  
description giving brief detail of what occurred,  
damage assessment give a best guess if nothing specifically said, keeping answers to ‘Major’, ‘Minor’, ’None’ or ‘Other’ - using other for if no damage has been done but disruption for other reason(s). Major being out of service and minor being damaged but operational  
for URLSource use ’t.me/' with the file name after the slash """

input_file = "/Users/spare/Desktop/Hackathon/Data.txt"
output_file = "/Users/spare/Desktop/Hackathon/output2.txt"

process_file(input_file, output_file, instructions)
