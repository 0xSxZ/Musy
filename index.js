const { app, BrowserWindow, ipcMain, nativeImage, NativeImage } = require('electron')
var pathModule = require("path")
var mm = require('musicmetadata');
const recursive = require("recursive-readdir");
const fs = require('fs')
const https = require('https')
var resJSON = [];
const urss = require("os").userInfo().username;
const Paths = [`C:/Users/${urss}/Desktop/`, `C:/Users/${urss}/Documents/`,`C:/Users/${urss}/Pictures/`, `C:/Users/${urss}/Music/`, `C:/Users/${urss}/3D Objects/`, `C:/Users/${urss}/Videos/`, `C:/Users/${urss}/Downloads/`]
const MusicFileExt = ["mp3","wav", "m4a", "ogg"]
const dbPath = require("path").join(__dirname, 'db/db.json');







function countFileLines(filePath) {
    return new Promise((resolve, reject) => {
        let lineCount = 0;
        fs.createReadStream(filePath)
            .on("data", (buffer) => {
                let idx = -1;
                lineCount--; // Because the loop will run once for idx=-1
                do {
                    idx = buffer.indexOf(10, idx + 1);
                    lineCount++;
                } while (idx !== -1);
            }).on("end", () => {
                resolve(lineCount);
            }).on("error", reject);
    });
};







function addToDb(path) {
    if (fs.readFileSync(pathModule.join(__dirname, '.', 'db/removed.json'), {
            encoding: 'utf8',
            flag: 'r'
        }).includes(path.replace(/\\/g, "\\\\"))) {
        return
    }
    var parser = mm(fs.createReadStream(path), function(err, metadata) {
        if (err) {
            metadata = {
                "name": path.split(/\\/)[path.split(/\\/).length - 1],
                "artist": "unknown",
                "track": countFileLines(dbPath),
                "image": "https://i.pinimg.com/originals/14/82/97/1482975da7275050a3a8406f90c4610d.jpg",
                "url": path,
            }



            if (fs.readFileSync(dbPath, {
                    encoding: 'utf8',
                    flag: 'r'
                }).includes(path.replace(/\\/g, "\\\\"))) {} else {
                if (fs.statSync(dbPath).size == 0) {
                    fs.appendFileSync(dbPath, JSON.stringify(metadata));
                } else {
                    fs.appendFileSync(dbPath, "\n," + JSON.stringify(metadata));
                }

            }
        } else {
            delete metadata["album"]
            delete metadata["track"]
            delete metadata["albumartist"]
            delete metadata["year"];
            delete metadata["genre"];
            delete metadata["disk"];
            delete metadata["genre"];
            delete metadata["picture"];
            metadata["name"] = metadata["title"]
            if (metadata["name"] == "" || metadata["name"] == undefined) {
                metadata["name"] = path.split("\\")[path.split("\\").length - 1]
            }
            if (metadata["artist"] == [] || metadata["artist"] == undefined || metadata["artist"] == "") {
                metadata["artist"] = "unknown"
            }


            delete metadata["title"];
            metadata["track"] = countFileLines(dbPath);
            metadata["url"] = path
            metadata["image"] = "https://i.pinimg.com/originals/14/82/97/1482975da7275050a3a8406f90c4610d.jpg";



            if (!fs.readFileSync(dbPath, {
                    encoding: 'utf8',
                    flag: 'r'
                }).includes(path.replace(/\\/g, "\\\\"))) {
                if (fs.statSync(dbPath).size == 0) {
                    var toWrite = JSON.stringify(metadata)
                } else {
                    var toWrite = "\n," + JSON.stringify(metadata);
                }
                fs.appendFileSync(dbPath, toWrite);
            }
        }
    });
}











function FileGrabber() {
    var i = 0;
    while (i <= Paths.length - 1) {
        recursive(Paths[i], function(err, files) {
            try {
                for (n = 0; n <= files.length; n++) {
                    try {
                        if (files[n].includes(".ini")) {
                            continue
                        }
                        var ext = files[n].substr(files.length - files.length - 3).toLowerCase()
                        // don't touch or it wont work for wavs, ik i'm a retard
                        if (ext == "wav") {
                            addToDb(files[n])
                        }
                        if (ext == "mp3" || ext == "wav" || ext == "m4a" || ext == "ogg") {
                            addToDb(files[n])
                        }
                    } catch {
                        continue
                    }

                }
            } catch {

            }
        });

        i++
    }

}










const createWindow = async() => {
  try{

    await FileGrabber()
  }catch{

  }
  const win = new BrowserWindow({
    width: 700,
    height: 850,
    frame:false,
    resizable:false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }

  })
  await win.loadFile('views/index.html')
  //await win.webContents.openDevTools()
}


app.whenReady().then(() => {
  createWindow()
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


