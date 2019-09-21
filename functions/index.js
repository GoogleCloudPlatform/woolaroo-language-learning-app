const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

const admin = require('firebase-admin');
admin.initializeApp();

exports.addSuggestions = functions.https.onRequest(async (req, res) => {
  console.log('Add a suggestion');

  //req content type should be application/json
  snapshot = await admin.firestore().collection('suggestions').add({
    english_word: req.body.english_word,
    translation: req.body.translation,
    transliteration: req.body.transliteration,
    sound_link: req.body.sound_link,
    status: 'pending_review',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('Translation suggestions saved.');
  res.status(200).send("Translation suggestions saved.");
});

exports.addTranslations = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    console.log('Add a translation');

    //req content type should be application/json
    snapshot = await admin.firestore().collection('translations').doc(req.body.english_word).set({
      english_word: req.body.english_word,
      translation: req.body.translation,
      transliteration: req.body.transliteration,
      sound_link: req.body.sound_link,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Translation saved.');
    res.status(200).send(JSON.stringify("Translation saved."));
  });
});

exports.getTranslation = functions.https.onRequest(async (req, res) => {
  console.log('getTranslation');
  var docRef = admin.firestore().collection("translations").doc(req.body);
  docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        res.status(200).send(doc.data());
        return doc.data()
    } else {
        console.log("No such document!");
        res.status(404).send("404");
        return "404"
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
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
  var docRef = admin.firestore().collection("translations").orderBy("english_word", reverse_order).limit(limit);
  docRef.get().then(querySnapshot => { 
    if (querySnapshot.empty) {
        res.status(404).send("NO translations");
        return "404"
    } else {
        var docs = querySnapshot.docs.map(doc => doc.data());
        translations_json = JSON.stringify({data: docs})
        res.status(200).send(translations_json);
        return translations_json
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
});

// todo(parikhshiv) - made this method mainly for development, can be
// replaced / expanded
exports.getEntireCollection = functions.https.onRequest(async (req, res) => {
  return cors(req, res, () => {
    const collection = admin.firestore().collection(req.query.collectionName);
    collection.get().then(function(collectionDocs) {
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
    }).catch(function(error) {
        console.log("Error getting translations:", error);
    });
  });
});

exports.deleteRow = functions.https.onRequest(async (req, res) => {
  return cors(req, res, () => {
    const doc = admin.firestore().collection(req.body.collectionName)
      .doc(req.body.id);
    doc.delete().then(function() {
      console.log("successful deletion!");
      res.status(200).send(JSON.stringify("Row deleted."));
    }).catch(function(error) {
        console.log("Error getting translations:", error);
    });
  });
});

// For testing purposes only
exports.testEndpoint = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.send({ 'a': 'hello from firebase'});
  });
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