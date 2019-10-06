"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");

var app = express();

// require("dotenv").config();
var port = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .catch(error => {
    console.log("connection error");
    console.log(error);
  });

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// app.get("/test", (req, res) => {
//   res.json({ hi: "hi" });
// });

const Schema = mongoose.Schema;
var urlSchema = new Schema({
  original: String,
  short: Number
});

mongoose.set("debug", true);

var Url = mongoose.model("Url", urlSchema);

app.post("/api/shorturl/new", function(req, res) {
  var orig_url = req.body["url"];

  // validate url
  var valid = validateUrl(orig_url);
  if (!valid) {
    res.json({ error: "invalid Url" });
  } else {
    // check if url already exists in db
    Url.findOne({ original: orig_url }, (err, data) => {
      if (err) return res.send("Error occurred when querying database");
      if (data) {
        res.json({ original_url: orig_url, short_url: data["short"] });
      } else {
        // create new entry in db

        // count number of entries
        var count = 0;
        Url.find({}, (err, data) => {
          if (err) return res.send("Error occurred when querying database");
          count = data.length + 1;
          var addUrl = new Url({
            original: orig_url,
            short: count
          });
          addUrl.save(err => {
            if (err) {
              return res.send("Error occurred saving entry to database");
            }
            res.json({ original_url: orig_url, short_url: count });
          });
        });
      }
    });
  }
});

app.get("/api/shorturl/:shorturl", function(req, res) {
  var short = req.params.shorturl;
  // check if shorturl is a valid integer
  if (isNaN(short)) {
    return res.json({ error: "Wrong Format" });
  }
  // convert to number
  +short;
  // check if shortened url has been previously registered in db
  Url.findOne({ short: short }, (err, data) => {
    if (err) {
      return res.send("Error occurred when querying database");
    }
    if (data) {
      res.redirect(data["original"]);
    } else {
      res.json({ error: "No short url found for given input" });
    }
  });
});

app.listen(port, function() {
  console.log("Node.js listening on port", port);
});

function validateUrl(url) {
  var regex = new RegExp(
    // format: http(s)://www.<domain_name>.<extension>(/more/routes)
    // entries in parentheses () are optional
    "^(http://www.|https://www.)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$"
  );
  return regex.test(url);
}
