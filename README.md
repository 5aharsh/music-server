# music-server

Just a server to crawl, index and host all audio files for uke.

## Setup

```
npm install
```

## Run

```
npm run server
```
or
```
node ./main.js
```

## Endpoints

`/file/{filename}` - Searches file in index and returns the file itself; primarily for audios. File can be present anywhere in the system. 

`/data/{filename}` - Returns files present in data folder. Used to return index data as API or preview images for musics in `./data/preview/`.

`/crawl` or `/crawl?loc={location}` - Crawls the specified directory `{location}` (root `/` if not mentioned) to find and return all audio files. Works asynchronously with proper promises. Indexing strat is still low quality.