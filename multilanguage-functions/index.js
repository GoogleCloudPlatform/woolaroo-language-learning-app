const fs = require('fs');
const functions = require('firebase-functions');
const uuidv1 = require('uuid/v1');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const vision = require('@google-cloud/vision');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const {google} = require('googleapis');

ffmpeg.setFfmpegPath(ffmpegPath);
admin.initializeApp();
const visionClient = new vision.v1p3beta1.ImageAnnotatorClient();

async function getGoogleAPIAuthentication() {
    const auth = new google.auth.GoogleAuth({ scopes: ['https://www.googleapis.com/auth/drive'] });
    return await auth.getClient();
}

// Makes an ffmpeg command return a promise.
function promisifyCommand(command) {
    return new Promise((resolve, reject) => {
        command.on('end', resolve).on('error', reject).run();
    });
}

async function writeFileAsync(path, buffer) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, buffer, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

exports.saveAudioSuggestions = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        // convert base64 body to blob of webm
        const nodeBuffer = Buffer.from(req.body, 'base64');
        // convert to mp3
        const fileName = uuidv1();
        const tempLocalPath = `/tmp/${fileName}.webm`;
        const targetTempFilePath =  `/tmp/${fileName}.mp3`;
        await writeFileAsync(tempLocalPath, nodeBuffer);
        const command = new ffmpeg(tempLocalPath).toFormat('mp3').save(targetTempFilePath);
        await promisifyCommand(command);
        // upload to drive
        const drive = google.drive({version: 'v3', auth: await getGoogleAPIAuthentication()});
        const createResponse = (await drive.files.create({
            requestBody: {
                parents: [ functions.config().audio_suggestions.folder_id ],
                mimeType: 'audio/mp3',
                name: `${fileName}.mp3`
            },
            media: {
                mimeType: 'audio/mp3',
                body: fs.createReadStream(targetTempFilePath),
            }
        }));
        const fileId = createResponse.data.id;
        const file = (await drive.files.get({
            fileId: fileId,
            fields: 'webContentLink'
        })).data;
        console.log(`Audio saved to ${file.webContentLink}.`);
        res.status(200).send(file.webContentLink);
    });
});

async function saveFeedback(spreadsheetId, sheetTitle, data) {
    const sheets = google.sheets({version: 'v4', auth: await getGoogleAPIAuthentication()});
    // find spreadsheet
    const spreadsheet = (await sheets.spreadsheets.get({spreadsheetId: spreadsheetId, fields: 'sheets(properties.title)'})).data;
    if(!spreadsheet) {
        throw new Error("Spreadsheet not found");
    }
    // find sheet
    const sheet = spreadsheet.sheets.find(sh => sh.properties.title === sheetTitle);
    if(!sheet) {
        // sheet does not exist - create it
        await sheets.spreadsheets.batchUpdate({ spreadsheetId: spreadsheetId, requestBody: {
                "requests": [ {
                    "addSheet": {
                        "properties": {
                            "title": sheetTitle,
                            "sheetType": "GRID"
                        }
                    }
                } ]
            } })
    }
    // append data to sheet
    await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetTitle + '!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [data] }
    });
}

exports.addSuggestions = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        await saveFeedback(functions.config().suggestions.spreadsheet_id, req.body.native_language, [
            req.body.language || '',
            req.body.native_language || '',
            req.body.english_word || '',
            req.body.primary_word || '',
            req.body.translation || '',
            req.body.transliteration || '',
            req.body.sound_link || '',
            new Date()
        ]);
        res.status(200).send("Translation suggestions saved.");
    });
});

exports.addFeedback = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        await saveFeedback(functions.config().feedback.spreadsheet_id, req.body.native_language, [
            req.body.language || '',
            req.body.native_language || '',
            req.body.english_word || '',
            req.body.primary_word || '',
            req.body.translation || '',
            req.body.transliteration || '',
            req.body.sound_link || '',
            req.body.types ? req.body.types.join(', ') : '',
            req.body.content || '',
            new Date()
        ]);
        res.status(200).send("Feedback saved.");
    });
});

exports.getTranslations = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        const english_words = req.body.english_words || [];
        const primary_language = req.body.primary_language || '';
        const target_language = req.body.target_language || '';
        const collectionRef = admin.firestore().collection("translations");
        const promises = english_words.map(async english_word => {
            return collectionRef.doc(english_word).get()
        });
        Promise.all(promises).then(docs => {
            const translations = docs.map(x => createTranslationResponseForApp(x, primary_language, target_language));
            res.status(200).send(translations);
        }).catch(function(error) {
            console.log("Internal server error", error);
            res.status(500).send(error)
        });
    });
});

function createTranslationResponseForApp(doc, primary_language, target_language) {
    const data = doc.data();
    const primaryTranslation = data ? data[primary_language] : null;
    const targetTranslation = data ? data[target_language] : null;
    return {
        english_word: doc.id,
        primary_word: primaryTranslation ? primaryTranslation.translation || '' : '',
        translation: targetTranslation ? targetTranslation.translation || '' : '',
        transliteration: targetTranslation ? targetTranslation.transliteration || '' : '',
        sound_link: targetTranslation ? targetTranslation.sound_link || '' : ''
    };
}

exports.visionAPI = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        try {
            const requestVision = {
                image: {content: Buffer.from(req.body, 'base64')},
                features: [{type: 'LABEL_DETECTION', maxResults: 10}, {type: 'SAFE_SEARCH_DETECTION'}]
            };
            visionClient.annotateImage(requestVision)
                .then(response => {
                    res.status(200).send(response && response.length > 0 ? response[0] : null);
                    return "200"
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send(err);
                });
        } catch (err) {
            console.log(`Unable to detect objects: ${err}`)
            res.status(500).send(err);
        }
    });
});