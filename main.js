const express = require("express");
const musics = require("../data/musics.json");
const path = require("path");
const cors = require("cors");
const { resolve } = require("path");
const { readdir } = require("fs").promises;
const fs = require("fs")
const mm = require('music-metadata')

var server = express();

server.use(cors());

async function* getFiles(dir) {
  try {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* getFiles(res);
      } else {
        yield res;
      }
    }
  } catch (error){
    console.error(error);
  }
}

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
});

server.get("/data/:name", (req, res, next) => {
  var name = req.params.name;
  res.sendFile(path.join(__dirname, "../data", name));
});

server.get("/preview/:name", (req, res, next) => {
  var name = req.params.name;
  res.sendFile(path.join(__dirname, "../data/preview", name));
});

server.get("/crawl", function (req, res) {
  (async () => {
    location = req.query.loc
    console.log(location)
    var result = [];
    for await (const f of getFiles(location)) {
      if (
        f.toLowerCase().endsWith(".mp3")  ||
        f.toLowerCase().endsWith(".m4a")  ||
        f.toLowerCase().endsWith(".flac") ||
        f.toLowerCase().endsWith(".aac")  ||
        f.toLowerCase().endsWith(".mp4")  ||
        f.toLowerCase().endsWith(".wav")  ||
        f.toLowerCase().endsWith(".wma")  ||
        f.toLowerCase().endsWith(".ogg")
      ) {
        console.log(f)
        result.push(f)
      }
    }
    res.send(result);
  })();
});

console.log("Listening to port 3000...");
server.listen(3000);
