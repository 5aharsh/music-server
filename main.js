const express = require("express")
const musics = require("./data/musics.json")
const path = require("path")
const cors = require("cors")
const fs = require("fs")
const mm = require('music-metadata')
const utils = require('./script/utils')

var server = express()

server.use(cors())

server.get("/file/:file", (req, res, next) => {
  var file = req.params.file;
  var music = musics.filter((m) => m.file == file);
  if (music.length > 0) {
    m = music[0];
    res.sendFile(m.path);
  } else {
    res.status(500);
    return res;
  }
})

server.get("/data/:name", (req, res, next) => {
  var name = req.params.name;
  res.sendFile(path.join(__dirname, "../data", name));
})

server.get("/preview/:name", (req, res, next) => {
  var name = req.params.name;
  res.sendFile(path.join(__dirname, "../data/preview", name));
})

server.get("/crawl", function (req, res) {
  (async () => {
    location = req.query.loc!=null?req.query.loc:'/'
    console.log(location)
    var result = [];
    for await (const f of utils.getFiles(location)) {
      if (utils.acceptedAudio(f)) {
        console.log(f)
        result.push(utils.hashCode(f))
      }
    }
    res.send(result);
  })()
})

server.get("/parse", function (req, res) {
    console.log(req.query.loc)
    mm.parseFile(path.join(req.query.loc))
    .then( 
        (metadata) => res.send(metadata)
    ).catch(
        (err) => console.error(err.message)
    )
})

console.log("Listening to port 3000...");
server.listen(3000);
