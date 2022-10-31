require("dotenv").config();
const axios= require("axios");
const express = require("express");
const queryString = require("querystring");
const app = express();
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const generateRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const stateKey = "spotify-auth-state";

app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = "user-read-private user-read-email";

  const queryParams = queryString.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", (req, res) => {
  const code = req.query.code || null;
  axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: queryString.stringify({
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    headers: {
      Authorization:
            "Basic " +
            new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    }
  })
  .then(response => {
    if (response.status === 200) {

      const {access_token, refresh_token } = response.data;

      const queryParams = queryString.stringify({
        access_token,
        refresh_token
      })
      //redirect to the react app and
      res.redirect(`http://localhost:3000/?${queryParams}`)

      //pass along tokes in query params

    

    } else {
      res.redirect(`?/${queryString.stringify({ error: 'invalid_token'})}`)
    }
  })
  .catch(error => {
    res.send(error)
  })
 
});

app.get('/refresh_token', (req, res) => {
  const {refresh_token} = req.query;

  axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: queryString.stringify({
      refresh_token: refresh_token,
      grant_type: "refresh_token",
    }),
    headers: {
      Authorization:
            "Basic " +
            new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    }
  })
  .then(response => {
    res.send(response.data);
  })
  .catch(error => {
    res.send(error);
  })
})

app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});
