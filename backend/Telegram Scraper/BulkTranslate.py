import requests
import json
import time
import os

subscription_key = "efe3c4d9e8644bd49ac7e4de12cd1b41"
endpoint = "https://api.cognitive.microsofttranslator.com"
path = '/translate?api-version=3.0'
params = '&to=en'


def translate_text(text):
    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Content-type': 'application/json',
        'Ocp-Apim-Subscription-Region': 'uksouth',
    }
    body = [{'text': text}]
    retry_count = 0
    max_retries = 10000
    retry_delay = 1

    while retry_count < max_retries:
        try:
            request = requests.post(endpoint + path + params, headers=headers, json=body)
            request.raise_for_status()
            response = request.json()

            if isinstance(response, list) and len(response) > 0 and 'translations' in response[0]:
                return response[0]['translations'][0]['text']
            else:
                print("Unexpected response structure:", response)
                return ""
        except requests.exceptions.RequestException as e:
            if request.status_code == 429:
                retry_count += 1
                print(f"Rate limit exceeded. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                print(f"Request error: {e}")
                return ""
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return ""
        except KeyError as e:
            print(f"Key error: {e}")
            print("Unexpected response structure:", response)
            return ""
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return ""

    print("Max retries exceeded. Translation failed.")
    return ""


input_folder_path = '/Users/Spare/Desktop/Hackathon/BulkScrape'
output_folder_path = '/Users/Spare/Desktop/Hackathon/BulkScrape/English Scrapes'

os.makedirs(output_folder_path, exist_ok=True)

for filename in os.listdir(input_folder_path):
    input_file_path = os.path.join(input_folder_path, filename)

    if os.path.isfile(input_file_path) and filename.endswith('.txt'):
        output_file_path = os.path.join(output_folder_path, f'translated_{filename}')

        try:
            with open(input_file_path, 'r', encoding='utf-8') as infile:
                with open(output_file_path, 'a', encoding='utf-8') as outfile:
                    for line in infile:
                        translated_line = translate_text(line.strip())
                        if translated_line:
                            outfile.write(translated_line + '\n')
        except FileNotFoundError as e:
            print(f"File not found: {e}")
        except IOError as e:
            print(f"IO error: {e}")
        except Exception as e:
            print(f"An unexpected error occurred while reading/writing files: {e}")
