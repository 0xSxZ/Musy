let playlistsData = fs.readFileSync(path.join(__dirname, '.', '../db/playlists.json'),{encoding:'utf8', flag:'r'})
if(playlistsData == "" || playlistsData == undefined){
    window.location.href = path.join(__dirname, '.', "../views/createPlaylist.html")
}else{
    let playlists = JSON.parse('['+data+']')
}