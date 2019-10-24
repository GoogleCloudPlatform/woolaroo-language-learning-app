const functions = require('firebase-functions');
const uuidv1 = require('uuid/v1');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors')({origin: true});


admin.initializeApp();
const projectId = admin.instanceId().app.options.projectId;
const bucketName = `${projectId}.appspot.com`;

exports.saveAudioSuggestions = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const fileName = uuidv1();
    const filePath = `suggestions/${fileName}.webm`
    const options = {
      metadata: {
        contentType: 'audio/webm',
      }
    };
    const file = admin.storage().bucket(bucketName).file(filePath);
    try {
      // Convert base64 body to blob of webm.
      const nodeBuffer = Buffer.from(req.body, 'base64');
      await file.save(nodeBuffer, options);
      console.log(`Audio saved successfully.`);
      // Make the file publicly accessible.
      file.makePublic();
      // TODO(smus): Convert webm to the format we want to store audio in,
      // probably audio/mp3.
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
// https://us-central1-barnard-project.cloudfunctions.net/translations?limit=2&reverse=true
exports.translations = functions.https.onRequest(async (req, res) => {
  const start = +req.query.start || 1;
  const limit = +req.query.limit || 20;
  const reverse = req.query.reverse || "false";
  //const array_contains = req.query.array_contains || "";

  var reverse_order = (reverse === "true") ? "desc" : "asc";
  var docRef = admin.firestore().collection("translations")
    .orderBy("english_word", reverse_order).limit(limit);

  try {
    const querySnapshot = await docRef.get();
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
  const pageSize = +req.query.pageSize;
  const pageNum = +req.query.pageNum;
  const state = req.query.state;
  const needsRecording = req.query.needsRecording;
  return cors(req, res, async () => {
    let collection = admin.firestore().collection(req.query.collectionName)
      .orderBy("english_word");

    try {
      const collectionDocs = await collection.get();
      if (collectionDocs.docs.length) {
          let filteredCollection = collectionDocs.docs.map((doc) => {
            return {...doc.data(), id: doc.id};
          });

          if (state === 'incomplete') {
            filteredCollection = filteredCollection.filter((doc) => {
              return !doc.translation;
            });
          } else if (state === 'complete') {
            filteredCollection = filteredCollection.filter((doc) => {
              return doc.translation;
            });
          }

          if (needsRecording && needsRecording !== '0') {
            filteredCollection = filteredCollection.filter((doc) => {
              return !doc.sound_link;
            });
          }

          if (pageNum && pageSize) {
            const startIdx = (pageNum - 1)*pageSize;
            const endIdx = startIdx + pageSize;
            res.status(200).send(filteredCollection.slice(startIdx, endIdx));
          } else {
            res.status(200).send(filteredCollection);
          }
          return filteredCollection;
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

exports.deleteRow = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const doc = admin.firestore().collection(req.body.collectionName)
      .doc(req.body.id);
    try {
      await doc.delete();
      console.log("successful deletion!");
      res.status(200).send(JSON.stringify("Row deleted."));
    } catch(err) {
      console.log("Error getting translations:", err);
    }
  });
});

// Auth functions
exports.grantModeratorRole = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const idToken = req.body.idToken;
      const customClaims = await admin.auth().verifyIdToken(idToken);
      if (!(customClaims && customClaims.admin)) {
        res.status(200).send(JSON.stringify("You are not authenticated to grant this role."));
        return;
      }
      const user = await admin.auth().getUserByEmail(req.body.email);

      if (!user) {
        res.status(404);
        return;
      }

      if (user.customClaims && user.customClaims.moderator === true) {
          res.status(200).send(JSON.stringify("Already a moderator."));
          return;
      }

      admin.auth().setCustomUserClaims(user.uid, {
          moderator: true
      });
      res.status(200).send(JSON.stringify("Success"));
    } catch(err) {
      res.status(500).send(err);
      console.log("Error", err);
    }
  });
});

exports.grantAdminRole = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const idToken = req.body.idToken;
      const customClaims = await admin.auth().verifyIdToken(idToken);
      if (!(customClaims && customClaims.admin)) {
        res.status(200).send(JSON.stringify("You are not authenticated to grant this role."));
        return;
      }
      const user = await admin.auth().getUserByEmail(req.body.email); // 1

      if (!user) {
        res.status(404);
        return;
      }

      if (user.customClaims && user.customClaims.admin === true) {
          res.status(200).send(JSON.stringify("Already an admin."));
          return;
      }

      admin.auth().setCustomUserClaims(user.uid, {
          admin: true
      });
      res.status(200).send(JSON.stringify("Success"));
    } catch(err) {
      res.status(500).send(err);
      console.log("Error", err);
    }
  });
});

exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  // todo(parikhshiv): make sure this is triggered properly
  await setFirstUserAsAdmin();
});


// exports.getBatchTranslations = functions.https.onRequest(async (req, res) => {
//   console.log('getBatchTranslations');
//   db.collection("translations").get().then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//     });
//   });
//   res.status(200).send("Translation returned..");
// });

async function setFirstUserAsAdmin() {
  try {
    const listUsersResult = await admin.auth().listUsers();
    console.log(listUsersResult.users.length);
    if (listUsersResult.users.length === 1) {
      const user = listUsersResult.users[0];
      admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    }
  } catch(err) {
    console.log('error', err);
  }
}
