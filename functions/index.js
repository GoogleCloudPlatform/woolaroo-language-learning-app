const fs = require('fs');
const functions = require('firebase-functions');
const uuidv1 = require('uuid/v1');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors')({origin: true});
const vision = require('@google-cloud/vision');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const request = require('request-promise');
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


const SETTINGS = {
  COLLECTION_NAME : "app_settings",
  DOCUMENT_NAME : "default",
  APP_ENABLED : "app_enabled",
  PRIVACY_POLICY : "privacy_policy",
  APP_NAME : "app_name",
  APP_URL : "app_url",
  PRIMARY_LANGUAGE : "primary_language",
  TRANSLATION_LANGUAGE : "translation_language",
  LOGO_IMAGE_ID : "logo_image_id",
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

exports.initSettings = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
      const docRef = admin.firestore().collection(SETTINGS.COLLECTION_NAME).doc(SETTINGS.DOCUMENT_NAME);
      try {
        const doc = await docRef.get();
        if (doc.exists) {
          console.log("Settings document already exists.");
          res.status(200).send("Settings already exists.");
        } else {
          const querySnapshot = admin.firestore().collection(SETTINGS.COLLECTION_NAME).doc(SETTINGS.DOCUMENT_NAME).create({
            privacy_policy: "",
            logo_image_id: "",
            app_enabled: true,
            app_name: "",
            app_url: "",
            translation_language: "",
            primary_language: "",
          });
          console.log("Settings document created.");
          res.status(404).send("Settings initialized.");
        }
      } catch (err) {
        console.log("Error creating settings document:", err);
        res.status(404).send("Error initializing settings.");
      }
  });
});

exports.updateSettings = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    console.log("Updating settings");
    const docRef = admin.firestore().collection(SETTINGS.COLLECTION_NAME).doc(SETTINGS.DOCUMENT_NAME);
    try {
      let doc = await docRef.get();
      if (!doc.exists) {
        console.log("Settings doesn't exist. Creating it...");
        const querySnapshot = await admin.firestore().collection(SETTINGS.COLLECTION_NAME).doc(SETTINGS.DOCUMENT_NAME).create({
          privacy_policy: "",
          logo_image_id: "",
          app_enabled: true,
          app_name: "",
          app_url: "",
          translation_language: "",
          primary_language: "",
        });
        doc = await docRef.get();
      }

      const privacy_policy = req.body.privacy_policy || doc.get(SETTINGS.PRIVACY_POLICY);
      const logo_image_id = req.body.logo_image_id || doc.get(SETTINGS.LOGO_IMAGE_ID);
      const app_enabled = req.body.app_enabled || doc.get(SETTINGS.APP_ENABLED);

      const snapshot = await admin.firestore().collection(SETTINGS.COLLECTION_NAME).doc(SETTINGS.DOCUMENT_NAME).set({
          privacy_policy: privacy_policy,
          logo_image_id: logo_image_id,
          app_enabled: app_enabled
        },
        {merge: true}
      );
      console.log("Settings updated");
      res.status(200).send("Settings updated.");
    } catch(err) {
      console.log("Error updating settings:", err);
      res.status(404).send("Error updating settings");
    }
  });
});

exports.readSettings = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    console.log("Reading settings");
    try {
      const doc = await admin.firestore().collection(SETTINGS.COLLECTION_NAME).doc(SETTINGS.DOCUMENT_NAME).get();
      const settings_json = JSON.stringify({data: doc.data()});
      console.log("Finished reading settings");
      res.status(200).send(settings_json);
    } catch(err) {
      console.log("Error reading settings:", err);
      res.status(404).send("Error reading settings");
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
      frequency: Number(req.body.frequency) || 11,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Translation saved.');
    res.status(200).send("Translation saved.");
  });
});


exports.getTranslation = functions.https.onRequest(async (req, res) => {
  const hasAccess = await checkAccess_(req, res);
  if (!hasAccess) {
    return;
  }
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
  const hasAccess = await checkAccess_(req, res);
  if (!hasAccess) {
    return;
  }
  const start = Number(req.query.start) || 1;
  const limit = Number(req.query.limit) || 20;
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

  docRef.get().then(querySnapshot => { 
    if (querySnapshot.empty) {
        res.status(404).send("NO translations");
    } else {
        var docs = querySnapshot.docs.map(doc => doc.data())
        var translations_json = JSON.stringify({data: docs})
        res.status(200).send(translations_json)
    }
    return "200"
  }).catch(error => {
    console.log("Error getting document:", error);
    res.status(500).send(error);
  });  
});

exports.getEntireCollection = functions.https.onRequest(async (req, res) => {
  const pageSize = +req.query.pageSize;
  const pageNum = +req.query.pageNum;
  const state = req.query.state;
  const needsRecording = Boolean(req.query.needsRecording && req.query.needsRecording !== '0');
  const search = req.query.search;
  const top500 = Boolean(req.query.top500 && req.query.top500 !== '0');
  return cors(req, res, async () => {
    const hasAccess = await checkAccess_(req, res);
    if (!hasAccess) {
      return;
    }
    let collection = admin.firestore().collection(req.query.collectionName);
    const limitQuery = pageSize && pageNum && pageNum === 1 &&
      state !== 'incomplete' && state !== 'complete' && !needsRecording &&
      !search;

    if (top500) {
      collection = collection.where('frequency', '>', 10)
        .orderBy("frequency", "desc");
    } else {
      collection = collection.orderBy("english_word");
    }

    if (limitQuery) {
      collection = collection.limit(pageSize);
    }

    try {
      const collectionDocs = await collection.get();
      if (collectionDocs.docs.length) {
          let filteredCollection = [];
          collectionDocs.docs.forEach((doc, docIdx) => {
            const docData = doc.data();

            if (state === 'incomplete' && docData.translation) {
              return;
            }

            if (state === 'complete' && !docData.translation) {
              return;
            }

            if (needsRecording && docData.sound_link) {
              return;
            }

            if (search && docData.english_word.indexOf(search) === -1) {
              return;
            }

            filteredCollection.push({...docData, id: doc.id});
          });

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
          res.status(200).send(collectionDocs.docs);
          return collectionDocs.docs;
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
      sound_link: req.body.sound_link,
      types: req.body.types,
      content: req.body.content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).send("feedback saved.");
  });
});

exports.getEntireFeedbackCollection = functions.https.onRequest(async (req, res) => {
  const hasAccess = await checkAccess_(req, res);
  if (!hasAccess) {
    return;
  }
  var docRef = admin.firestore().collection("feedback");
    let querySnapshot;
    querySnapshot = await docRef.get();
    docRef.get().then(querySnapshot => { 
      if (querySnapshot.empty) {
          res.status(404).send("NO translations");
      } else {
          var docs = querySnapshot.docs.map(doc => doc.data())
          var translations_json = JSON.stringify({data: docs})
          res.status(200).send(translations_json)
      }
      return "200"
    }).catch(error => {
      console.log("Error getting document:", error);
      res.status(500).send(error);
  });  



  return cors(req, res, async () => {
    var snapshot = await admin.firestore().collection('feedback').add({
      english_word: req.body.english_word,
      translation: req.body.translation,
      transliteration: req.body.transliteration,
      sound_link: req.body.sound_link,
      types: req.body.types,
      content: req.body.content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).send("feedback saved.");
  });
});

exports.deleteRow = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const hasAccess = await checkAccess_(req, res);
    if (!hasAccess) {
      return;
    }
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
      const hasAccess = await checkAdminAccess_(req, res);
      if (!hasAccess) {
        return;
      }
      const revoke = Boolean(req.body.revoke);
      const user = await admin.auth().getUserByEmail(req.body.email);

      if (!user) {
        res.status(404);
        return;
      }

      console.log(revoke);
      if (revoke) {
        if (!(user.customClaims && user.customClaims.moderator)) {
          res.status(200).send(JSON.stringify("Already not a moderator."));
          return;
        }
      } else {
        if (user.customClaims && user.customClaims.moderator) {
          res.status(200).send(JSON.stringify("Already a moderator."));
          return;
        }
        // Clears any existing role before granting moderator role. A user can
        // have at most one role at a time.
        admin.auth().setCustomUserClaims(user.uid, {});
      }

      admin.auth().setCustomUserClaims(user.uid, {
          moderator: !revoke,
      });
      res.status(200).send(JSON.stringify("Success"));
    } catch(err) {
      res.status(500).send(err);
      console.log("Error", err);
    }
  });
});

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

exports.visionAPIProxy = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      visionClient.annotateImage(req)
        .then(response => {
          res.status(200).send(response);
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


exports.grantAdminRole = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const hasAccess = await checkAdminAccess_(req, res);
      if (!hasAccess) {
        return;
      }
      const revoke = Boolean(req.body.revoke);
      const user = await admin.auth().getUserByEmail(req.body.email); // 1

      if (!user) {
        res.status(404);
        return;
      }

      if (revoke) {
        if (!(user.customClaims && user.customClaims.admin)) {
          res.status(200).send(JSON.stringify("Already not an admin."));
          return;
        }
      } else {
        if (user.customClaims && user.customClaims.admin) {
          res.status(200).send(JSON.stringify("Already an admin."));
          return;
        }
        // Clears any existing role before granting admin role. A user can
        // have at most one role at a time.
        admin.auth().setCustomUserClaims(user.uid, {});    
      }

      admin.auth().setCustomUserClaims(user.uid, {
          admin: !revoke,
      });
      res.status(200).send(JSON.stringify("Success"));
    } catch(err) {
      res.status(500).send(err);
      console.log("Error", err);
    }
  });
});

exports.getUsers = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const hasAccess = await checkAccess_(req, res);
      if (!hasAccess) {
        return;
      }
      const listUsersResult = await admin.auth().listUsers();
      const users = listUsersResult.users.map((user) => {
          let role = 'None';
          if (user.customClaims) {
            if (user.customClaims.admin) {
              role = 'Admin';
            } else if (user.customClaims.moderator) {
              role = 'Moderator'
            }
          }
          return {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            role,
          };
      });
      res.status(200).send(users);
      return "200"
    } catch(err) {
      res.status(500).send(err);
      console.log("Error", err);
    }
  });
});

// Auth Methods

exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  await setFirstUserAsAdmin();
});

exports.createTrigger = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    console.log("Reading settings");
    try {
      const doc = await admin.firestore().collection(SETTINGS.COLLECTION_NAME).doc(SETTINGS.DOCUMENT_NAME).get();
      const settings_json = JSON.stringify({data: doc.data()});
      console.log("Finished reading settings");
      res.status(200).send(settings_json);
    } catch(err) {
      console.log("Error reading settings:", err);
      res.status(404).send("Error reading settings");
    }
  });
});

async function setFirstUserAsAdmin() {
  try {
    const listUsersResult = await admin.auth().listUsers();
    let anyAdmins = listUsersResult.users.some((user) => {
      return user.customClaims && user.customClaims.admin;
    });

    if (!anyAdmins && listUsersResult.users.length < 10) {
      // For new apps (smaller number of users), make every existing user
      // an admin if none exist yet.
      listUsersResult.users.forEach((user) => {
        admin.auth().setCustomUserClaims(user.uid, {
          admin: true,
          moderator: false,
        });
      });
    }
  } catch(err) {
    console.log('error', err);
  }
}

async function checkAccess_(req, res) {
  try {
    const customClaims = await getCustomClaims_(req, res);
    if (!customClaims) {
      res.status(403).send(JSON.stringify("Permission Denied."));
      return false;
    }

    if (!(customClaims.moderator || customClaims.admin)) {
      res.status(403).send(JSON.stringify("Permission Denied."));
      return false;
    }

    return true;
  } catch(err) {
    res.status(403).send(JSON.stringify("Permission Denied."));
    return false;
  }
}

async function checkAdminAccess_(req, res) {
  try {
    const customClaims = await getCustomClaims_(req, res);
    if (!customClaims) {
      res.status(403).send(JSON.stringify("Permission Denied."));
      return false;
    }

    if (!customClaims.admin) {
      res.status(403).send(JSON.stringify("Permission Denied."));
      return false;
    }

    return true;
  } catch(err) {
    res.status(403).send(JSON.stringify("Permission Denied."));
    return false;
  }
}

async function getCustomClaims_(req, res) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(403).send(JSON.stringify("Permission Denied."));
    return false;
  }
  const tokenId = req.get('Authorization').split('Bearer ')[1];
  return await admin.auth().verifyIdToken(tokenId);
}


// For testing purposes only
exports.testEndpoint = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.send({ 'a': 'hello from firebase'});
  });
});


const newProjectId = "final-test-woolaroo"
const currentProjectId = admin.instanceId().app.options.projectId;
const repoName = "bitbucket_rushdigital_google-barnard"
const wizardRepoName = "github_googlecloudplatform_barnard-language-learning-app"

// API calls & Resources
const cloudResourceManager = google.cloudresourcemanager('v1');
const serviceusage = google.serviceusage('v1');

// resources
const projectResource = {
  "projectId": newProjectId,
  "name": newProjectId
}
const clientSecretJson = JSON.parse('{"web":{"client_id":"929114075380-c2csr93icen7igh6qquhhf047l8esnin.apps.googleusercontent.com","project_id":"barnard-project","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"xxxxxx","javascript_origins":["https://us-central1.cloudfunctions.net"]}}');
const oauth2Client = new google.auth.OAuth2(
  clientSecretJson.web.client_id,
  clientSecretJson.web.client_secret,
  `https://us-central1-${currentProjectId}.cloudfunctions.net/oauth2callback`
);





function parseCookies(rc) {
    var list = {};

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function postOptions(token, uri, body){
  var option = {};
  option.method = 'POST';
  option.headers = {
      'content-type': 'application/json',
      'accept': 'application/json',
      'authorization': `Bearer ${token.access_token}` 
    };
  option.uri = uri;
  if (Object.keys(body).length > 0) {
    option.body = JSON.stringify(body);
  }
  return option;
}


exports.oauth2init = functions.https.onRequest(async (req, res) => {
  // Parse session cookie
  // Note: this presumes 'token' is the only value in the cookie
  const cookieStr = parseCookies(req.headers.cookie)
  console.log(cookieStr)
  const token = cookieStr ? decodeURIComponent(cookieStr) : null;
  // If the current OAuth token hasn't expired yet, go to /listlabels
  if (token && token.expiry_date && token.expiry_date >= Date.now() + 60000) {
    return res.redirect('/createProject');
  }
  // Define OAuth2 scopes
  const scopes = [
    'https://www.googleapis.com/auth/cloud-platform'
  ];
  // Generate + redirect to OAuth2 consent form URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: scopes
  });
  res.redirect(authUrl);
});

/**
 * Get an access token from the authorization code and store token in a cookie
 */
exports.oauth2callback = functions.https.onRequest(async (req, res) => {
  // Get authorization code from request
  const code = req.query.code;

  return new Promise((resolve, reject) => {
    // OAuth2: Exchange authorization code for access token
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  })
    .then((token) => {
      // Respond with OAuth token stored as a cookie
      res.cookie('token', JSON.stringify(token));
      res.redirect('/createProject');
    })
    .catch((err) => {
      // Handle error
      console.error(err);
      res.status(500).send('Something went wrong; check the logs.');
    });
});

exports.createProject = functions.runWith({timeoutSeconds: 540 ,memory: '1GB'}).https.onRequest(async (req, res) => {
  //Create new project, 
  //This works: http://cloud.google.com/resource-manager/reference/rest/v1/projects/create
  const cookie = parseCookies(req.headers.cookie)
  const cookieStr = cookie.token;
  const token = cookieStr ? JSON.parse(decodeURIComponent(cookieStr)) : null;
  console.log('token!')
  console.log(token)
  // If the stored OAuth 2.0 access token has expired, request a new one
  if (!token || !token.expiry_date || token.expiry_date < Date.now() + 60000) {
    return res.redirect('/oauth2init').end();
  }
  oauth2Client.credentials = token;

  //Create project
  console.log('creating project.')
  function createNewProject() {
    return new Promise((resolve, reject) => {
      cloudResourceManager.projects.create({auth: oauth2Client, resource: projectResource}, (err, response) => {
        if (err) {
          return reject(err);
        }
        return resolve(response);
      });
    });
  }
  var response = await createNewProject();
  console.log(response);
  console.log('created project.');

  //Scary clown waiting
  function scaryClown() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('🤡');
      }, 5000);
    });
  }
  var msg = await scaryClown();
  console.log('Message:', msg);

  //Add firebase
  console.log('adding firebase');
  var addFirebaseOptions = postOptions(token, 
    `https://firebase.googleapis.com/v1beta1/projects/${newProjectId}:addFirebase`,{});
  var msg = await request(addFirebaseOptions);
  console.log('Message:', msg);
  console.log('added firebase');

  var msg = await scaryClown();
  console.log('Message:', msg);

  console.log('enabling services');
  var services = [
    // "serviceusage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "cloudbilling.googleapis.com",
    "iam.googleapis.com",
    "firebase.googleapis.com",
    //"credentials.googleapis.com",
    "firestore.googleapis.com",
    "appengine.googleapis.com",
    "firebasehosting.googleapis.com",
    "sheets.googleapis.com",
    "vision.googleapis.com",
    "cloudbuild.googleapis.com"
    // "cloudtrigger.googleapis.com"
    ];

  console.log('Message:', msg);
  for (var i in services) {
    var url = `https://serviceusage.googleapis.com/v1/projects/${newProjectId}/services/${services[i]}:enable`;
    console.log(`enbaling service with ${url}`);
    var enableServiceOptions = postOptions(token, url, {});
    var msg = await request(enableServiceOptions);
    console.log('essage:', msg);
  }
  console.log('finished enabling all services');


  console.log('finished adding firebase to project')
  //Set default location
  var setDefaultLocationOptions = postOptions(token, 
    `https://firebase.googleapis.com/v1beta1/projects/${newProjectId}/defaultLocation:finalize`, {"locationId":"us-central"});
  await request(setDefaultLocationOptions);
  res.status(200).send('Finished everything.');
});

exports.deployWizard = functions.https.onRequest(async (req, res) => {
  const cookie = parseCookies(req.headers.cookie)
  const cookieStr = cookie.token;
  const token = cookieStr ? JSON.parse(decodeURIComponent(cookieStr)) : null;
  console.log('token!')
  console.log(token)
  // If the stored OAuth 2.0 access token has expired, request a new one
  if (!token || !token.expiry_date || token.expiry_date < Date.now() + 60000) {
    return res.redirect('/oauth2init').end();
  }
  oauth2Client.credentials = token;
  //Set default location

  // Get firebase config object
  var getWebAppsOptions = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      'authorization': `Bearer ${token.access_token}` 
    },
    uri: `https://firebase.googleapis.com/v1beta1/projects/${newProjectId}/webApps`,
  }
  var webApps = await request(getWebAppsOptions);
  const appId = JSON.parse(decodeURIComponent(webApps)).apps[0].appId;
  console.log(appId);
  var getFirebaseConfigOptions = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      'authorization': `Bearer ${token.access_token}` 
    },
    uri: `https://firebase.googleapis.com/v1beta1/projects/${newProjectId}/webApps/${appId}/config`,
  }
  var firebaseConfig = await request(getFirebaseConfigOptions);
  console.log(firebaseConfig);
  var projectNumber = JSON.parse(decodeURIComponent(firebaseConfig)).messagingSenderId;
  console.log(`Current project number is ${projectNumber}`);


  // Create Wizard Trigger & Run Trigger
  const wizardRepoSource = {
    "projectId": newProjectId,
    "repoName": wizardRepoName,
    "dir": "./",
    "substitutions": {
      "_FIREBASE_CONFIG_OBJECT": firebaseConfig,
      "_PROJECT_NAME": newProjectId
    },
    "branchName": "^master$" 
  }
  const wizardBuildTrigger = {
    "description": "Auto deployment of Wizard",
    "name": "wizard-trigger",
    "triggerTemplate": wizardRepoSource,
    "disabled": false,
    "substitutions": {
      "_FIREBASE_CONFIG_OBJECT": firebaseConfig,
      "_PROJECT_NAME": newProjectId
    },
    "filename": "cloudbuild.yaml"
  }
  var createWizardTriggerOptions = postOptions(token, 
    `https://cloudbuild.googleapis.com/v1/projects/${newProjectId}/triggers`, wizardBuildTrigger);
  var response = await request(createWizardTriggerOptions);

  //Run trigger
  var triggerId = JSON.parse(response).id;
  console.log("Run trigger")
  console.log(triggerId);

  var runWizardTriggerOptions = postOptions(token, `https://cloudbuild.googleapis.com/v1/projects/${newProjectId}/triggers/${triggerId}:run`,wizardRepoSource);
  var response = await request(runWizardTriggerOptions);
  console.log("Finished running trigger")
  console.log(response);
  res.status(200).send(firebaseConfig);
});

// Create Trigger & Run Trigger
exports.deployApp = functions.https.onRequest(async (req, res) => {
  // Parse session cookie
  const cookie = parseCookies(req.headers.cookie)
  const cookieStr = cookie.token;
  const token = cookieStr ? JSON.parse(decodeURIComponent(cookieStr)) : null;
  console.log('token!');
  console.log(token);
  //Create trigger and run the trigger
  console.log("Create trigger and run")
  const buildTrigger = {
    "description": "Auto deployment of App",
    "name": "uat-barnard",
    "triggerTemplate": {
      "projectId": newProjectId,
      "repoName": repoName,
      "tagName": "uat-*"
    },
    "disabled": false,
    "substitutions": {
      "_API_URL": "https://us-central1-barnard-project.cloudfunctions.net",
      "_BUCKET_LOCATION": "asia",
      "_BUCKET_NAME": "barnard-project",
      "_ENDANGERED_LANGUAGE": "Sicilian",
      "_LANGUAGE": "en",
      "_TERRAFORM_BUCKET_NAME": "barnard-project-terraform",
      "_THEME": "red"
    },
    "filename": "cloudbuild.yaml"
  }
  var createAppTriggerOptions = postOptions(token, 
    `https://cloudbuild.googleapis.com/v1/projects/${newProjectId}/triggers`,buildTrigger);
  var trigger = await request(createAppTriggerOptions);
  var triggerId = JSON.parse(trigger).id;
  const repoSource = {
    "projectId": newProjectId,
    "repoName": repoName,
    "dir": "./",
    "substitutions": {
      "_API_URL": "https://us-central1-barnard-project.cloudfunctions.net",
      "_BUCKET_LOCATION": "asia",
      "_BUCKET_NAME": "barnard-project",
      "_ENDANGERED_LANGUAGE": "Sicilian",
      "_LANGUAGE": "en",
      "_TERRAFORM_BUCKET_NAME": "barnard-project-terraform",
      "_THEME": "red"
    },
    "tagName": "uat-v0.02.11" // Change this
  };
  var runAppTriggerOptions = postOptions(token, 
    `https://cloudbuild.googleapis.com/v1/projects/${newProjectId}/triggers/${triggerId}:run`,repoSource);
  var build = await request(runAppTriggerOptions);
  res.status(200).send(JSON.parse(build));
});



