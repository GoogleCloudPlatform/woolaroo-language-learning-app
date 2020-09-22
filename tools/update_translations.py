import csv
from google.cloud import firestore
import google.oauth2.credentials

words = {}
with open('./EndangeredLanguageTranslations.csv', encoding='utf-8') as translations_file:
	reader = csv.reader(translations_file)
	for row in reader:
		if len(row) == 0:
			continue
		language = row[0]
		if not language:
			continue
		english_word = row[1].lower()
		if not english_word:
			continue
		translation = row[2] if len(row) > 2 else None
		transliteration = row[3] if len(row) > 3 else None
		if not translation:
			if not transliteration:
				continue
			translation = transliteration
		translation = translation.lower()
		if transliteration:
			transliteration = transliteration.lower()
		if english_word not in words:
			word = {'en': {'sound_link': '', 'translation': english_word, 'transliteration': english_word}}
			words[english_word] = word
		else:
			word = words[english_word]
		word[language] = {'sound_link': '', 'translation': translation, 'transliteration': transliteration}


credentials = google.oauth2.service_account.Credentials.from_service_account_file(filename='google_api_key.json')
db = firestore.Client(project='ggl-woolaroo-multilang-uat', credentials=credentials)
collection = db.collection(u'translations')

print('Deleting documents')
for doc in collection.list_documents():
	doc.delete()

print('Creating documents')
for key, val in words.items():
	collection.add(val, key)