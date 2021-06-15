$.getJSON('data/releases.json', function(data){
    $(data).each(function(i) {
        releaseHTML = `
        <div class="release-container p-2 wow animate__animated animate__fadeIn">
            <div class="release-cover" id="${data[i].id}">
            </div>
            <div class="release-details">
                <h2>${data[i].title}</h2>
                <h3>${data[i].artist}</h3>
                <ul class="list-inline">
                    <li class="list-inline-item">
                        <a href="${data[i].spotify}" title="Play ${data[i].title} on Spotify" target="_blank" class="release-icon">
                            <img src="images/spotify.svg" alt="Spotify">
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="${data[i].apple_music}" title="Play ${data[i].title} on Apple Music" target="_blank" class="release-icon">
                            <img src="images/applemusic.svg" alt="Apple Music">
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="${data[i].youtube_music}" title="Play ${data[i].title} on YouTube Music" target="_blank" class="release-icon">
                            <img src="images/youtubemusic.svg" alt="YouTube Music">
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="${data[i].deezer}" title="Play ${data[i].title} on Deezer" target="_blank" class="release-icon">
                            <img src="images/deezer.svg" alt="Deezer">
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="${data[i].tidal}" title="Play ${data[i].title} on Tidal" target="_blank" class="release-icon">
                            <img src="images/tidal.svg" alt="Tidal">
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="${data[i].amazon_music}" title="Play ${data[i].title} on Amazon Music" target="_blank" class="release-icon">
                            <img src="images/amazon.svg" alt="Amazon Music">
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        `;
        $( "#catalogue" ).append( $( releaseHTML ) );        
    })    
})

