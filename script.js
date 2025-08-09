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

const playMusic = (songs) =>{
    // let audio = new Audio(+songs);
    //     audio.play();

    console.log(songs)
}

async function main() {

    // let currenSong = 

    let songs = await getSongs();

    let songsUL = document.querySelector(".songLists").getElementsByTagName("ul")[0];

    // Clear any existing list items before populating
    // songsUL.innerHTML = "";

    for (const song of songs) {
        // Correctly add a single list item for each song
        songsUL.innerHTML += `<li>
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

    // This part remains the same
    if (songs.length > 0) {
        let audio = new Audio(songs[0]);
        // audio.play();

        audio.addEventListener("loadeddata", () => {
            let duration = audio.duration;
            // console.log(duration); 
        });
    }


    Array.from(document.querySelector(".songLists").getElementsByTagName("li")).forEach(e=>{
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)

        e.addEventListener("click", element =>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        } )
    })
}

main();