from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import json
import requests

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1vGmY34onv1CrWdmT7jK8p_vZ3K7OWnGnXYZKb0xz6AQ'
SAMPLE_RANGE_NAME = 'xsr!A6:C'
url = "https://us-central1-barnard-project.cloudfunctions.net/addTranslations"

def main():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'client_secret.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                range=SAMPLE_RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
    else:
        print('Name, Major:')
        for row in values:
            # Print columns A and E, which correspond to indices 0 and 4.
            if (len(row) == 3):
                english_word = row[0]
                translation = row[2]
                transliteration = ''
                sound_link = ''
                x = {
                      "english_word": english_word,
                      "translation": translation,
                      "transliteration": transliteration,
                      "sound_link": sound_link
                    }
                y = json.dumps(x)
                the_file.write('\n')
                headers = {'content-type': "application/json"}
                response = requests.request("POST", url, data=y, headers=headers)
                print(response.text)



if __name__ == '__main__':
    main()