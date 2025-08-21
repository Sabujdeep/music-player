let currentSong = new Audio();

function secondsToMinuteSeconds(totalSeconds) {
     const wholeSeconds = Math.floor(totalSeconds); // ignore fractional part
  const minutes = Math.floor(wholeSeconds / 60);
  const seconds = wholeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const getSongs = async () => {
    let a = await fetch('http://127.0.0.1:5500/cb/');
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;

    let as = div.getElementsByTagName('a');
    let songs = []; // Correct: Empty array to hold individual song names

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith('.mp3')) {
            // More robust way to extract the song name
            let songName = decodeURIComponent(element.href.split('/').pop());

            // Push the song name string, not an array or joined text
            songs.push(songName);
        }
    }

    // console.log(songs);
    return songs;

}

const playMusic = (songName, pause = false) => {
    // let audio = new Audio(`http://127.0.0.1:5500/cb/${encodeURIComponent(songName)}`);
    currentSong.src = `http://127.0.0.1:5500/cb/${encodeURIComponent(songName)}`
    if(!pause){
        currentSong.play();
        play.src = "/img/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = songName
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
    // console.log("Playing:", songName);
};


async function main() {

    // let currenSong = 

    let songs = await getSongs();
    playMusic(songs[0], true)

    let songsUL = document.querySelector(".songLists").getElementsByTagName("ul")[0];

    // Clear any existing list items before populating
    // songsUL.innerHTML = "";

    for (const song of songs) {
        // Correctly add a single list item for each song
        songsUL.innerHTML += `<li data-song="${song}">
                            <img class = "invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>
                                    ${song.replace(".mp3", "")}
                                </div>
                                <div>Sabujdeep</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`;
    }


    Array.from(document.querySelector(".songLists").getElementsByTagName("li")).forEach(e => {
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)

        e.addEventListener("click", () => {
            playMusic(e.getAttribute("data-song"))
        })
    })


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/img/pause.svg"

        } else {
            currentSong.pause()
            play.src = "/img/play.svg"
        }
    })


    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)}
        /${secondsToMinuteSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%"
    })

    // add an event lisener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"

        currentSong.currentTime = ((currentSong.duration) * percent)/100
    })

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

        // add an event listener for hamburger
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })
}

main();