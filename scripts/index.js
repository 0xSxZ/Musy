
window.onload = function() {
    $(document).ready(function() {
        $("#nav-icon").click(function() {
            $(this).toggleClass("open");
            $(".overlay").toggleClass("open");
            $(".overlay a").toggleClass("open");
            $(".overlay p").toggleClass("open");
        });
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var fs = require('fs');
    const musicbar = document.querySelector(".music");
    const musicname = document.querySelector(".musicname");
    const artis = document.querySelector(".artist");
    const img = document.querySelector(".cover");
    const imgs = document.querySelector(".shadow");
    const rote = document.querySelector(".cover");
    const playBtn = document.querySelector(".play-btn");
    const pauseBtn = document.querySelector(".pause-btn");
    const preBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const music = document.getElementById("music");
    const musicList = document.getElementsByTagName("li");
    const progressBar = document.getElementById("progress-bar");
    let currentTrack = 0;
    let currentList;
    var path = require("path")
    let data = fs.readFileSync(path.join(__dirname, '.', '../db/db.json'), {
        encoding: 'utf8',
        flag: 'r'
    })

    let tracks = JSON.parse('[' + data + ']')

    function copyToClipboard(text) {
        var copyText = text;

        navigator.clipboard.writeText(copyText).then(function() {
            alert("Link copied to clipboard: " + copyText);
        });

    }

    function init() {
        if (currentTrack === 0) {
            music.src = tracks[0].url;
            music.load();
        }

        for (let i = 0; i < tracks.length; i++) {
            $("#musiclist")
                .append(`<li id="${i}"><div class="box" ><div class="icon"><img src="${tracks[i].image}"/></div>
  <div class="content">
       <svg viewBox="0 0 448 448" onclick="remove(this)" cust="${tracks[i].url}">
       
       <path d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"/>
       </svg>
      <h3>${tracks[i].name.slice(0,25)}...</h3>
      <h6>${tracks[i].artist}</h6><div></div>
     </li>`);
        }

        for (let musicIndex = 0; musicIndex < musicList.length; musicIndex++) {
            musicList[musicIndex].addEventListener("click", switchMusic, false);
        }
    }

    function switchMusic(e) {

        if (currentList !== undefined) {
            removePlayedBackground();
            music.pause();
        }
        currentTrack = this.id;
        music.src = tracks[currentTrack].url;
        music.load();
        play();
    }

    function addChoosedBackground() {
        currentList = document.getElementById(currentTrack);
        currentList.classList.add("song-play-now");
    }

    function removePlayedBackground() {
        currentList.classList.remove("song-play-now");
    }
    async function play() {
        await sleep(1000)
        img.src = tracks[currentTrack].image;
        imgs.src = tracks[currentTrack].image;
        artis.innerHTML = tracks[currentTrack].artist;
        musicname.innerHTML = tracks[currentTrack].name.slice(0, 35) + "...";
        rote.classList.add("rote");
        playBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        musicbar.classList.add("openn");
        music.play();
        musicIsPlaying = true;
        addChoosedBackground();
        document.getElementById("end-time").innerHTML = tracks[currentTrack].duration;
    }

    function pause() {
        musicIsPlaying = false;
        music.pause();
        rote.classList.remove("rote");
        pauseBtn.classList.add("hidden");
        playBtn.classList.remove("hidden");

    }

    function prePlay() {
        removePlayedBackground();
        music.pause();

        if (currentTrack > 0) {
            currentTrack--;
        } else {
            currentTrack = tracks.length - 1;
        }

        music.src = tracks[currentTrack].url;
        music.load();
        play();
    }

    function nextPlay() {
        removePlayedBackground();
        music.pause();

        if (currentTrack < tracks.length - 1) {
            currentTrack++;
        } else {
            currentTrack = 0;
        }

        music.src = tracks[currentTrack].url;
        music.load();
        play();
    }

    function calculateTotalValue(length) {
        let minutes = Math.floor(length / 60),
            seconds_int = length - minutes * 60,
            seconds_str = seconds_int.toString(),
            seconds = seconds_str.substr(0, 2),
            time = minutes + ":" + seconds;

        return time;
    }

    function formatTime() {
        let timeline = document.getElementById("start-time");
        let s = parseInt(music.currentTime % 60);
        let m = parseInt((music.currentTime / 60) % 60);
        if (s < 10) {
            timeline.innerHTML = m + ":0" + s;
        } else {
            timeline.innerHTML = m + ":" + s;
        }
    }

    function updateProgress() {
        let current = music.currentTime;
        let percent = (current / music.duration) * 100;
        progressBar.setAttribute("value", percent);
    }

    playBtn.addEventListener("click", play, false);
    pauseBtn.addEventListener("click", pause, false);
    preBtn.addEventListener("click", prePlay, false);
    nextBtn.addEventListener("click", nextPlay, false);
    music.addEventListener("ended", nextPlay, false);

    // 歌曲已播放時間
    music.addEventListener("timeupdate", formatTime, false);
    music.addEventListener("timeupdate", updateProgress, false);

    init();

}