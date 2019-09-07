const functions = require('firebase-functions');

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
  res.status(200).send("Translation saved.");
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
        // doc.data() will be undefined in this case
        console.log("No such document!");
        res.status(404).send("404");
        return "404"
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
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
