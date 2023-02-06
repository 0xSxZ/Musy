var patdzadh = require("path")
var mm = require('musicmetadata');
const recursive = require("recursive-readdir");
const { app, BrowserWindow, ipcMain, nativeImage, NativeImage } = require('electron')
const fs = require('fs')
const https = require('https')


function countFileLines(filePath){
  return new Promise((resolve, reject) => {
  let lineCount = 0;
  fs.createReadStream(filePath)
    .on("data", (buffer) => {
      let idx = -1;
      lineCount--; // Because the loop will run once for idx=-1
      do {
        idx = buffer.indexOf(10, idx+1);
        lineCount++;
      } while (idx !== -1);
    }).on("end", () => {
      resolve(lineCount);
    }).on("error", reject);
  });
};


function addToDb(path){
  var complete1 = fs.readFileSync(patdzadh.join(__dirname, '.', 'db/removed.json'),{encoding:'utf8', flag:'r'});
  if(complete1.includes(path.replace(/\\/g,"\\\\"))){
    return
  }
  var parser = mm(fs.createReadStream(path), function (err, metadata) {
    if (err){
      metadata = {
        "name":path.split(/\\/)[path.split(/\\/).length-1],
        "artist":"unknown",
        "track":countFileLines(require("path").join(__dirname, 'db/db.json')),
        "image":"https://i.pinimg.com/originals/14/82/97/1482975da7275050a3a8406f90c4610d.jpg",
        "url":path,
      }
      

      var complete = fs.readFileSync(require("path").join(__dirname, 'db/db.json'),{encoding:'utf8', flag:'r'});
      if(complete.includes(path.replace(/\\/g,"\\\\"))){
      }else{
          if(fs.statSync(require("path").join(__dirname, 'db/db.json')).size == 0){
              fs.appendFileSync(require("path").join(__dirname, 'db/db.json'), JSON.stringify(metadata));
          }else{
              fs.appendFileSync(require("path").join(__dirname, 'db/db.json'),"\n,"+ JSON.stringify(metadata));
          }
         
      }
    }else{
        delete metadata["album"]
        delete metadata["track"]
        delete metadata["albumartist"]
        delete metadata["year"];
        delete metadata["genre"];
        delete metadata["disk"];
        delete metadata["genre"];
        delete metadata["picture"];
        metadata["name"] = metadata["title"]
        if(metadata["name"] == "" ||metadata["name"] == undefined){
          metadata["name"] = path.split("\\")[path.split("\\").length-1]
        }
        if(metadata["artist"]== [] || metadata["artist"]== undefined || metadata["artist"]==  ""){
          metadata["artist"] = "unknown"
        }
        
        
        delete metadata["title"];
        metadata["track"] = countFileLines(require("path").join(__dirname, 'db/db.json'));
        metadata["url"] = path 
        metadata["image"] = "https://i.pinimg.com/originals/14/82/97/1482975da7275050a3a8406f90c4610d.jpg";
        

        var complete = fs.readFileSync(require("path").join(__dirname, 'db/db.json'),{encoding:'utf8', flag:'r'});
        if(complete.includes(path.replace(/\\/g,"\\\\"))){
        }else{
            if(fs.statSync(require("path").join(__dirname, 'db/db.json')).size == 0){
                fs.appendFileSync(require("path").join(__dirname, 'db/db.json'), JSON.stringify(metadata));
            }else{
                fs.appendFileSync(require("path").join(__dirname, 'db/db.json'),"\n,"+ JSON.stringify(metadata));
            }
           
        }
    }
});
}



var resJSON = [];
const urss = require("os").userInfo().username;
const Paths = [`C:/Users/${urss}/Desktop/`, `C:/Users/${urss}/Documents/`,`C:/Users/${urss}/Pictures/`, `C:/Users/${urss}/Music/`, `C:/Users/${urss}/3D Objects/`, `C:/Users/${urss}/Videos/`, `C:/Users/${urss}/Downloads/`]
const MusicFileExt = ["mp3","wav", "m4a", "ogg"]




function FileGrabber(){

    var i = 0;
    while(i<=Paths.length-1){
      recursive(Paths[i], function (err, files) {
        try{

        
        for(n = 0; n<=files.length; n++){
        try{
            if(files[n].includes(".ini")){
                continue
            }
            var ext = files[n].substr(files.length - files.length - 3).toLowerCase()
         
            if(ext == "wav" ){
              addToDb(files[n])
            }
            if(ext == "mp3" || ext == "wav" || ext == "m4a" || ext == "ogg"){
                addToDb(files[n])
            }
        } catch{
          continue
        }
        
        }
    }catch{

    }
    });
    
    i++
    }

  }
  


const createWindow = async() => {
  try{

    await FileGrabber()
  }catch{}
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


