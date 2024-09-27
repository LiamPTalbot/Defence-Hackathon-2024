from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
import os
from datetime import datetime, timezone

api_id = 27761394
api_hash = 'd9e9ed5cd908c32ded7b738a313b972a'
phone_number = '+447375315808'

client = TelegramClient('session_name', api_id, api_hash)
client.connect()

if not client.is_user_authorized():
    client.send_code_request(phone_number)
    client.sign_in(phone_number, input('Enter the code you received: '))


def scrape_messages(group_name, limit=100, output_file=None):
    if output_file is None:
        output_file = os.path.join(os.path.expanduser('~'), 'Desktop/Hackathon/BulkScrape', f'{group_name}_messages.txt')

    entity = client.get_entity(group_name)
    offset_date = datetime(2024, 9, 27, tzinfo=timezone.utc)
    history = client(GetHistoryRequest(
        peer=entity,
        offset_id=0,
        offset_date=offset_date,
        add_offset=0,
        limit=limit,
        max_id=0,
        min_id=0,
        hash=0
    ))

    with open(output_file, 'w', encoding='utf-8') as f:
        for message in history.messages:
            if message.date <= offset_date:
                f.write(f"Message ID: {message.id}, Date: {message.date}, Message: {message.message}\n")


group_names = [
    'Ukrenergo',
    'ukrainelive123',
    'pravdaGerashchenko_en',
    'mykolaivskaODA',
    'ButusovPlus',
    'informnapalm',
    'uniannet',
    'Tsaplienko'
]

for group_name in group_names:
    scrape_messages(group_name, limit=20)

client.disconnect()
