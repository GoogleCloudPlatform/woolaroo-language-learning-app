const fs = require('fs');
const functions = require('firebase-functions');
const uuidv1 = require('uuid/v1');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors')({origin: true});
const vision = require('@google-cloud/vision');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


// Makes an ffmpeg command return a promise.
function promisifyCommand(command) {
  return new Promise((resolve, reject) => {
    command.on('end', resolve).on('error', reject).run();
  });
}

admin.initializeApp();
const projectId = admin.instanceId().app.options.projectId;
const bucketName = `${projectId}.appspot.com`;
const visionClient = new vision.v1p3beta1.ImageAnnotatorClient();

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
    var snapshot = await admin.firestore().collection('suggestions').add({
      english_word: req.body.english_word,
      translation: req.body.translation,
      transliteration: req.body.transliteration,
      sound_link: req.body.sound_link,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Translation suggestions saved.');
    res.status(200).send("Translation suggestions saved.");
  });
});

exports.addTranslations = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    var snapshot = await admin.firestore().collection('translations').doc(req.body.english_word).set({
      english_word: req.body.english_word,
      translation: req.body.translation,
      transliteration: req.body.transliteration,
      sound_link: req.body.sound_link,
      frequency: +req.body.frequency || -1,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Translation saved.');
    res.status(200).send("Translation saved.");
  });
});


exports.getTranslation = functions.https.onRequest(async (req, res) => {
  var docRef = admin.firestore().collection("translations").doc(req.body);
  try {
    const doc = await docRef.get();
    if (doc.exists) {
        console.log("Document data:", doc.data());
        res.status(200).send(doc.data());
        return doc.data()
    } else {
        console.log("No such document!");
        res.status(404).send("404");
        return "404"
    }
  } catch(err) {
    console.log("Error getting document:", err);
  }
});

// For App, which will be used by app users
// https://us-central1-barnard-project.cloudfunctions.net/getTranslations
exports.getTranslations = functions.https.onRequest(async (req, res) => {
  const english_words = req.body.english_words || [];
  console.log(english_words);
  const collectionRef = admin.firestore().collection("translations");
  const createResponse = (res) => {
    var data = {
        english_word: (res === undefined) ? '' : res.english_word ,
        translation: (res === undefined) ? '' : res.translation ,
        transliteration: (res === undefined) ? '' : res.transliteration,
        sound_link: (res === undefined) ? '' : res.sound_link
    }
    return data;
  }
  const promises = english_words.map(async english_word => {
    return collectionRef.doc(english_word).get()
  })
  Promise.all(promises).then(docs => {
    var translations = docs.map(x => createResponse(x.data()))
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

// For translation page, which will be used by admin & moderators.
// https://us-central1-barnard-project.cloudfunctions.net/translations?limit=2&reverse=true&first500=true
exports.translations = functions.https.onRequest(async (req, res) => {
  const start = +req.query.start || 1;
  const limit = +req.query.limit || 20;
  const reverse = Boolean(req.query.reverse) || false;
  const first500 = Boolean(req.query.first500) || false;
  //const array_contains = req.query.array_contains || "";

  var reverse_order = (reverse) ? "asc" : "desc";
  var docRef = admin.firestore().collection("translations")
    .orderBy("frequency", reverse_order).limit(limit);

  let querySnapshot;

  if (first500) {
    querySnapshot = await docRef.where('frequency', '>', 10).get();
  } else {
    querySnapshot = await docRef.get();
  }
  
  try {
    if (querySnapshot.empty) {
        res.status(404).send("NO translations");
    } else {
        var docs = querySnapshot.docs.map(doc => doc.data())
        var translations_json = JSON.stringify({data: docs})
        res.status(200).send(translations_json)
    }
  } catch(err) {
    console.log("Error getting document:", err);
  }
});

// todo(parikhshiv) - made this method mainly for development, can be
// replaced / expanded
exports.getEntireCollection = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const collection = admin.firestore().collection(req.query.collectionName);

    try {
      const collectionDocs = await collection.get();
      if (collectionDocs.docs.length) {
          const entireCollection = collectionDocs.docs.map((doc) => {
            return {...doc.data(), id: doc.id};
          });
          console.log("Collection:", entireCollection);
          res.status(200).send(entireCollection);
          return entireCollection;
      } else {
          console.log("No such collection");
          res.status(404).send("404");
          return "404";
      }
    } catch(err) {
      console.log("Error getting translations:", err);
    }
  });
});


exports.addFeedback = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    var snapshot = await admin.firestore().collection('feedback').add({
      english_word: req.body.english_word,
      translation: req.body.translation,
      transliteration: req.body.transliteration,
      types: req.body.types,
      content: req.body.content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).send("feedback saved.");
  });
});


exports.deleteRow = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const doc = admin.firestore().collection(req.body.collectionName).doc(req.body.id);
    try {
      await doc.delete();
      console.log("successful deletion!");
      res.status(200).send(JSON.stringify("Row deleted."));
    } catch(err) {
      console.log("Error getting translations:", err);
    }
  });
});

exports.visionAPI = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      console.log("hi")
      const requestVision = {
        image: {content: Buffer.from(req.body, 'base64')},
        features: [{type: 'LABEL_DETECTION'}, {type: 'SAFE_SEARCH_DETECTION'}]
      };
      visionClient.annotateImage(requestVision)
        .then(response => {
          const labels = response[0].labelAnnotations;
          var objects = labels.map(label => label.description);
          res.status(200).send(objects);
          return "200"
        })
        .catch(err => {
          console.error(err);
        });
    } catch (err) {
      console.log(`Unable to detect objects: ${err}`)
    }
  });
});


// For testing purposes only
exports.testEndpoint = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.send({ 'a': 'hello from firebase'});
  });
});