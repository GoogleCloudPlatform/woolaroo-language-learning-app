from __future__ import print_function
import  sys
from googleapiclient.discovery import build
import json
import requests
import os
from google.oauth2 import service_account


SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = sys.argv[1] # '1SwaTDfutAcS5V8OHe6mXQyWlX-JRVXw82hRE40erDOc'
SAMPLE_RANGE_NAME = 'xsr!A6:C'
url = "https://us-central1-%s.cloudfunctions.net/addTranslations" % os.environ['PROJECT_ID']
credentials_file = os.environ['GOOGLE_APPLICATION_CREDENTIALS']




def main():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
    credentials = service_account.Credentials.from_service_account_file(credentials_file, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=credentials)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                range=SAMPLE_RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
    else:
        for row in values:
            # Print columns A and E, which correspond to indices 0 and 4.
            if (len(row) == 3):
                english_word = row[0]
                frequency = row[1]
                translation = row[2]
                transliteration = ''
                sound_link = ''
                x = {
                      "english_word": english_word,
                      "translation": translation,
                      "frequency": frequency,
                      "transliteration": transliteration,
                      "sound_link": sound_link
                    }
                y = json.dumps(x)
                headers = {'content-type': "application/json"}
                response = requests.request("POST", url, data=y, headers=headers)
                print(response.text)


