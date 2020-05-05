"use strict";
const redis = require("redis");
const express = require("express");
const multer = require('multer');
const util = require("./util");
const base62 = require("base62/lib/ascii");
const expressHan = require("express-handlebars");

const upload = multer();

const REDIS_ID_COUNTER = "urlid";
const REDIS_URLS_HASH = "urls";
const REDIS_URL_VISITS_HASH = "urlvisits";

let redisClient = redis.createClient();
redisClient.on("error", (err) => {
  console.log("Redis error " + err);
});

redisClient.set(REDIS_ID_COUNTER, 1);

const app = express();
const port = 3000;

// HTML templatimg
app.engine("handlebars", expressHan({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/favicon.ico", (req, res) => res.status(204));

// главня страница с формой для ввода URL
app.get("/", (req, res) => {
  res.render("index");
});

// при сабмите формы сохраняем url в базе и выдаем уникальный идентификатор
app.post("/", upload.none(), (req, res) => {
  if (!util.isURLValid(req.body.url)) {
    return res.json({ error: "Некорректно указан URL!" });
  }
  redisClient.incr(REDIS_ID_COUNTER, (err, id) => {
    if (err) {
      console.log(err);
      return res.json({ error: err });
    }
    let idstr = base62.encode(id);
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    redisClient.hset(REDIS_URLS_HASH, idstr, req.body.url, (err) => {
      if (err) {
        console.log(err);
        return res.json({ error: "Некорректно указан URL!" });
      } else {
        let newUrl = fullUrl + idstr;
        res.json({ ok: newUrl });
      }
    });
  });
});

// requested any url
app.get("/:idstr", (req, res) => {
  redisClient.hget(REDIS_URLS_HASH, req.params.idstr, (err, url) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    redisClient.hincrby(REDIS_URL_VISITS_HASH, req.params.idstr, 1);
    res.redirect(url);
  });
});

app.listen(3000, () => {
  console.log("Server listening on port: ", 3000);
});
