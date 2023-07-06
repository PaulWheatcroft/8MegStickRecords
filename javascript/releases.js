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
    heroHTML = `
        <header class="hero-details p-2">
            <h2 class="hero-details">PAULI</h2>
            <h2 class="hero-details">Love Life</h2>
            <p>Would you be you?</p>
            <div class="hero-links">
                <ul class="list-inline">
                <li class="list-inline-item">
                    <a href="https://open.spotify.com/track/60DAJKWJVB6e44T2ZTdbEJ" title="Play Love Life on Spotify" target="_blank" class="release-icon">
                        <img src="images/spotify.svg" alt="Spotify">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="https://music.apple.com/gb/album/love-life/1695696635?i=1695696686&app=music" title="Play LOve Life on Apple Music" target="_blank" class="release-icon">
                        <img src="images/applemusic.svg" alt="Apple Music">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="https://music.youtube.com/watch?v=2qWUVIUog0w" title="Play Love Life on YouTube Music" target="_blank" class="release-icon">
                        <img src="images/youtubemusic.svg" alt="YouTube Music">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="https://listen.tidal.com/track/303064386" title="Play Love Life on Tidal" target="_blank" class="release-icon">
                        <img src="images/tidal.svg" alt="Tidal">
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="https://music.amazon.co.uk/albums/B0CB42FNFQ?trackAsin=B0CB3YMMN4" title="Play Love Life on Amazon Music" target="_blank" class="release-icon">
                        <img src="images/amazon.svg" alt="Amazon Music">
                    </a>
                </li>
            </ul>
            </div>
           
            
            
        </header>
    `;
    $( "#hero-release" ).html(heroHTML); 
})

