
var admin = require("firebase-admin");

var serviceAccount = require(process.env.FIREBASE_ACCOUNT_URL);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
