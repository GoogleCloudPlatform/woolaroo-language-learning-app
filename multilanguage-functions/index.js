const fs = require('fs');
const functions = require('firebase-functions');
const uuidv1 = require('uuid/v1');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const vision = require('@google-cloud/vision');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const {google} = require('googleapis');

admin.initializeApp();
const visionClient = new vision.v1p3beta1.ImageAnnotatorClient();

async function getGoogleAPIAuthentication() {
    const auth = new google.auth.GoogleAuth({
        // Scopes can be specified either as an array or as a single, space-delimited string.
        scopes: ['https://www.googleapis.com/auth/drive']
    });
    return await auth.getClient();
}

// Makes an ffmpeg command return a promise.
function promisifyCommand(command) {
    return new Promise((resolve, reject) => {
        command.on('end', resolve).on('error', reject).run();
    });
}

exports.saveAudioSuggestions = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        // Convert base64 body to blob of webm.
        const fileName = uuidv1();
        const nodeBuffer = Buffer.from(req.body, 'base64');
        var tempLocalPath = `/tmp/${fileName}.webm`;
        const targetTempFilePath =  `/tmp/${fileName}.mp3`;
        fs.writeFileSync(tempLocalPath, nodeBuffer);
        var command = new ffmpeg(tempLocalPath)
            .toFormat('mp3')
            .save(targetTempFilePath);
        await promisifyCommand(command);

        const drive = google.drive({version: 'v3'});
        drive.files.create({
            parents: [ functions.config().audioSuggestions.folder_id],
            requestBody: {

            }
        });
        /*await bucket.upload(targetTempFilePath, options);
        console.log(`Audio saved successfully.`);
        fs.unlinkSync(tempLocalPath);
        fs.unlinkSync(targetTempFilePath);
        // Make the file publicly accessible.
        var file = bucket.file(filePath);
        file.makePublic();
        // Rather than getting the bucket URL, get the public HTTP URL.
        const metadata = await file.getMetadata();
        const mediaLink = metadata[0].mediaLink;
        console.log(`Audio available publicly at ${mediaLink}.`);
        res.status(200).send(mediaLink);*/
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

exports.addSuggestion = functions.https.onRequest(async (req, res) => {
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
            req.body.types || '',
            req.body.content || '',
            new Date()
        ]);
        res.status(200).send("Feedback saved.");
    });
});

exports.getTranslations = functions.https.onRequest(async (req, res) => {
    const english_words = req.body.english_words || [];
    const primary_language = req.body.primary_language || '';
    const target_language = req.body.target_language || '';
    const collectionRef = admin.firestore().collection("translations");
    const promises = english_words.map(async english_word => {
        return collectionRef.doc(english_word).get()
    });
    Promise.all(promises).then(docs => {
        const translations = docs.map(x => createTranslationResponseForApp(x.data(), primary_language, target_language));
        console.log(translations);
        res.set('Access-Control-Allow-Origin', "*");
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).send(translations);
        return "200"
    }).catch(function(error) {
        console.log("Internal server error", error);
        res.status(500).send(error)
    });
});

function createTranslationResponseForApp(data, primary_language, target_language) {
    if (data === undefined) {
        return {
            english_word: "",
            primary_word: "",
            translation: "",
            transliteration: "",
            sound_link: ""
        };
    } else {
        const primaryTranslation = data[primary_language];
        const targetTranslation = data[target_language];
        return {
            english_word: data.english_word || '',
            primary_word: primaryTranslation ? primaryTranslation.translation || '' : '',
            translation: targetTranslation ? targetTranslation.translation || '' : '',
            transliteration: targetTranslation ? targetTranslation.transliteration || '' : '',
            sound_link: targetTranslation ? targetTranslation.sound_link || '' : ''
        };
    }
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