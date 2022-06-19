import csv
from html.parser import HTMLParser
import sys

from google.cloud import firestore
from auth import get_credentials


class HTMLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = ''

    def feed(self, *args, **kwargs):
        self.text = ''
        return super().feed(*args, **kwargs)

    def handle_data(self, d):
        self.text += d

    def get_data(self):
        return self.text


html_stripper = HTMLStripper()

words = {}
with open('./EndangeredLanguageTranslations.csv', encoding='utf-8') as translations_file:
    reader = csv.reader(translations_file)
    for row in reader:
        if len(row) == 0:
            continue
        language = row[0]
        if not language:
            continue
        english_word = row[1].lower().strip()
        if not english_word:
            continue
        html_stripper.feed(english_word)
        english_word = html_stripper.get_data()
        english_word = english_word.split('/')[0]
        translation = row[2] if len(row) > 2 else None
        transliteration = row[3] if len(row) > 3 else None
        if not translation:
            if not transliteration:
                continue
            translation = transliteration
        translation = translation.lower().strip()
        html_stripper.feed(translation)
        translation = html_stripper.get_data()
        if transliteration:
            transliteration = transliteration.lower().strip()
            html_stripper.feed(transliteration)
            transliteration = html_stripper.get_data()
        if english_word not in words:
            word = {'en': {'sound_link': '', 'translation': english_word,
                           'transliteration': english_word}}
            words[english_word] = word
        else:
            word = words[english_word]
        word[language] = {
            'sound_link': '', 'translation': translation, 'transliteration': transliteration}

# Get credemtials for the user or SA authorised in glcoud
credentials, project = get_credentials()

if credentials.token is None:
    # If auth worked and we have a proper Google Cloud Identity we should have a token
    print('No token credentials')
    sys.exit()
else:
    print(f'Credentials obtained for project ${project}, exit if not correct!')

db = firestore.Client(project='ggl-woolaroo-multilang-uat',
                      credentials=credentials)
collection = db.collection(u'translations')
batch = firestore.WriteBatch(db)

print('Deleting documents')
count = 1
for doc in collection.list_documents():
    batch.delete(doc)
    if count % 500 == 0:
        batch.commit()
    if count % 100 == 0:
        print(f'{count} deleted')
    count = count + 1
batch.commit()

print('Creating documents')
count = 1
for key, val in words.items():
    batch.create(firestore.DocumentReference(
        'translations', key, client=db), val)
    if count % 500 == 0:
        batch.commit()
    if count % 100 == 0:
        print(f'{count}/{len(words)} created')
    count = count + 1
batch.commit()
