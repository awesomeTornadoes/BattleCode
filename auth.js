const GoogleAuth = require('google-auth-library');

const auth = new GoogleAuth;
const CLIENT_ID = '414320534713-9r05dhe2spf3fid09lk1vfhdhegth1da.apps.googleusercontent.com';
const client = new auth.OAuth2(CLIENT_ID);
exports.tokenCheck = (token, cb) => {
  client.verifyIdToken(
    token,
    CLIENT_ID,
    (e, login) => {
      const payload = login.getPayload();
      // const userid = payload.sub;
      cb({
        email: payload.email,
      });
    })};
