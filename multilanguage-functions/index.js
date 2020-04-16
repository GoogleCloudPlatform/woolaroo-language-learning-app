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
const projectId = admin.instanceId().app.options.projectId;
const bucketName = `${projectId}.appspot.com`;
const visionClient = new vision.v1p3beta1.ImageAnnotatorClient();

// Makes an ffmpeg command return a promise.
function promisifyCommand(command) {
    return new Promise((resolve, reject) => {
        command.on('end', resolve).on('error', reject).run();
    });
}

exports.saveAudioSuggestions = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        const fileName = uuidv1();
        const filePath = `suggestions/${fileName}.mp3`
        const options = {
            destination: filePath,
            metadata: {
                contentType: 'audio/mp3',
            }
        };
        const bucket = admin.storage().bucket(bucketName);
        try {
            // Convert base64 body to blob of webm.
            const nodeBuffer = Buffer.from(req.body, 'base64');
            var tempLocalPath = `/tmp/${fileName}.webm`;
            const targetTempFilePath =  `/tmp/${fileName}.mp3`;
            fs.writeFileSync(tempLocalPath, nodeBuffer);
            var command = new ffmpeg(tempLocalPath)
                .toFormat('mp3')
                .save(targetTempFilePath);
            await promisifyCommand(command);
            await bucket.upload(targetTempFilePath, options);
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
            res.status(200).send(mediaLink);
        } catch (err) {
            console.log(`Unable to upload audio ${err}`)
        }
    });
});

exports.addSuggestions = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        await admin.firestore().collection('suggestions').add({
            english_word: req.body.english_word || '',
            primary_word: req.body.primary_word || '',
            translation: req.body.translation || '',
            transliteration: req.body.transliteration || '',
            sound_link: req.body.sound_link || '',
            primary_language: req.body.language || '',
            translation_language: req.body.native_language || '',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Translation suggestions saved.');
        res.status(200).send("Translation suggestions saved.");
    });
});

exports.addFeedback = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        await admin.firestore().collection('feedback').add({
            english_word: req.body.english_word || '',
            primary_word: req.body.primary_word || '',
            translation: req.body.translation || '',
            transliteration: req.body.transliteration || '',
            primary_language: req.body.language || '',
            translation_language: req.body.native_language || '',
            sound_link: req.body.sound_link || '',
            types: req.body.types || '',
            content: req.body.content || '',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(200).send("feedback saved.");
    });
});

// For App, which will be used by app users
// https://us-central1-barnard-project.cloudfunctions.net/getTranslations
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

// For App, a quick fix to support multiple langauges.
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