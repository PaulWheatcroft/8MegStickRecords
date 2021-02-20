function addNewRelease() {
    event.preventDefault();

    let artist = document.getElementById("artist-name").value;
    let song = document.getElementById("song-name").value;
    let releaseId = song.toLowerCaser();
    let image = document.getElementById("image-cover").value;
    let spotify = document.getElementById("spotify").value;
    let apple = document.getElementById("apple-music").value;
    let youtube = document.getElementById("youtube-music").value;
    let tidal = document.getElementById("tidal").value;
    let deezer = document.getElementById("deezer").value;
    let amazon = document.getElementById("amazon-music").value;

    let htmlRelease = `
    <!-- ${song} by ${artist} -->
    <div class="release-container p-2">
        <div class="release-cover" id="${releaseId}">
        </div>
        <div class="release-details">
            <h2>${song}</h2>
            <h3>${artist}</h3>
            <ul class="list-inline">
                <li class="list-inline-item">
                    <a href="${spotify}" title="Play ${song} on Spotify" target="_blank" class="release-icon">
                        <img src="images/spotify.svg" alt="Spotify">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="${apple}" title="Play ${song} on Apple Music" target="_blank" class="release-icon">
                        <img src="images/applemusic.svg" alt="Apple Music">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="${youtube}" title="Play ${song} on YouTube Music" target="_blank" class="release-icon">
                        <img src="images/youtubemusic.svg" alt="YouTube Music">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="${deezer}" title="Play ${song} on Deezer" target="_blank" class="release-icon">
                        <img src="images/deezer.svg" alt="Deezer">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="${tidal}" title="Play ${song} on Tidal" target="_blank" class="release-icon">
                        <img src="images/tidal.svg" alt="Tidal">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="${amazon}" title="Play ${song} on Amazon Music" target="_blank" class="release-icon">
                        <img src="images/amazon.svg" alt="Amazon Music">
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <!-- /Tunneling by ${artist} -->
    `;
    alert(htmlRelease);
}

let form = document.getElementById('new-release-form');
form.addEventListener('submit', addNewRelease);


