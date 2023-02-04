const { app, BrowserWindow } = require('electron')
var fs = require('fs');
var patdzadh = require("path")
var mm = require('musicmetadata');
const recursive = require("recursive-readdir");
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
        "image":"https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png",
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
        metadata["image"] = "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png";
        

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
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }

  })
  await win.loadFile('views/index.html')
  //await win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

