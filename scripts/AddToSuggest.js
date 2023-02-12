const addToSuggest = (e) => {
    var fs = require("fs")
    var path = require("path")
    if(fs.readFileSync(path.join(__dirname, '.', '../db/mostListened.json'),{encoding:'utf8', flag:'r'}).includes(e)){
      return
    }
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

    if(fs.readFileSync(path.join(__dirname, '.', '../db/mostListened.json'),{encoding:'utf8', flag:'r'}).split(/\r?\n/).length >= 25){
        var FLines = fs.readFileSync(path.join(__dirname, '.', '../db/mostListened.json'),{encoding:'utf8', flag:'r'})
        randomNum = Math.floor(Math.random() * FLines.split(/\r?\n/).length)
        var choosen = FLines.split(/\r?\n/)[randomNum]
        fs.writeFileSync(path.join(__dirname, '.', '../db/mostListened.json'), FLines.replace(choosen, ""))
        fs.appendFileSync(path.join(__dirname, '.', '../db/mostListened.json'),JSON.stringify(e))
    }else{
        fs.appendFileSync(path.join(__dirname, '.', '../db/mostListened.json'),"\n"+ JSON.stringify(e))
    }
}

module.exports = { addToSuggest }
