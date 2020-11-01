const { resolve, format } = require("path")
const { readdir } = require("fs").promises

const formats = [
    ".mp3",
    ".m4a",
    ".flac",
    ".aac",
    ".mp4",
    ".wav",
    ".ogg",
    ".webm"
]

module.exports = {
    getFiles:
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
            } catch (error) {
                console.error(error);
            }
        },
    acceptedAudio:
        function acceptedAudio(file) {
            for (var f in formats){
                if (file.toLowerCase().endsWith(formats[f]))
                return true
            }
            return false
        },
    hashCode:
        function hashCode(string) {
            var hash = 0
            if (string.length == 0) {
                return hash
            }
            for (var i = 0; i < string.length; i++) {
                var char = string.charCodeAt(i)
                hash = ((hash<<5)-hash)+char
                hash = hash & hash
            }
            return hash
        }
}