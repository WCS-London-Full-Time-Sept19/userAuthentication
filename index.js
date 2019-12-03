const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./mysql");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

function getToken() {
  return (token =
    Math.round(Math.random() * 100000000000000) + "" + Date.now());
}
console.log(getToken());

app.post("/login", (req, res) => {
  console.log("request ", req.body.username, req.body.password);
  connection.query(
    `SELECT * from user WHERE username LIKE '${req.body.username}' AND password LIKE '${req.body.password}'`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results.length === 0) {
          res.send(
            "This username and password combination is not correct, please try again!"
          );
        } else {
          let token = getToken();
          connection.query(
            `INSERT INTO token (userId, token, token_expiry) VALUES (${results[0].userId}, ${token}, now() + interval 30 day)`,
            (err, result) => {
              if (err) {
                console.log(err);
                throw new Error("something went wrong");
              } else {
                res.send(token);
                // set token and userId in localstorage
              }
            }
          );
        }
      }
    }
  );
});

app.post("/secret", (req, res) => {
  connection.query(
    `SELECT userId FROM token WHERE userId LIKE '${req.body.userId}' AND token = '${req.body.token}' AND token_expiry > now()`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("something went wrong");
      } else {
        if (result.length === 1) {
          res.send("welcome");
        } else {
          res.send("go away");
        }
      }
    }
  );
});

app.listen(5000, function() {
  console.log("Listening on port 5000");
});
