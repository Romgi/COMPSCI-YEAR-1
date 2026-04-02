/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Controls background music playback order, looping, and mute synchronization for the Whiplash game page.
*/

window.addEventListener("load", function () {
    if (!window.clicker) {
        return;
    }

    const state = window.clicker.state;
    const musicTracks = [
        "audio/music/Caravan.mp3",
        "audio/music/Overture.mp3",
        "audio/music/Upswingin.mp3",
        "audio/music/Whiplash.mp3"
    ];

    const player = new Audio();
    let order = [];
    let index = 0;
    let started = false;

    /**
     * Builds a play order that starts at a random track and wraps through the full playlist.
     *
     * @returns {void} No value is returned.
     */
    function buildOrder() {
        const startIndex = Math.floor(Math.random() * musicTracks.length);
        order = [];

        for (let currentIndex = 0; currentIndex < musicTracks.length; currentIndex += 1) {
            order.push(musicTracks[(startIndex + currentIndex) % musicTracks.length]);
        }

        index = 0;
    }

    /**
     * Loads and plays the current background music track.
     *
     * @returns {void} No value is returned.
     */
    function playCurrent() {
        if (order.length === 0) {
            return;
        }

        player.src = order[index];
        player.volume = state.isMuted ? 0 : 0.18;
        player.play().then(function () {
            started = true;
        }).catch(function () {
            return;
        });
    }

    /**
     * Ensures that playback starts once the player interacts with the game.
     *
     * @returns {void} No value is returned.
     */
    function ensurePlaying() {
        if (!started) {
            playCurrent();
        }
    }

    /**
     * Updates the active music volume to reflect the muted state.
     *
     * @param {boolean} isMuted True when the music should be muted, otherwise false.
     * @returns {void} No value is returned.
     */
    function setMuted(isMuted) {
        player.volume = isMuted ? 0 : 0.18;
    }

    player.addEventListener("ended", function () {
        if (order.length === 0) {
            return;
        }

        index = (index + 1) % order.length;
        playCurrent();
    });

    window.clicker.music = {
        ensurePlaying: ensurePlaying,
        setMuted: setMuted
    };

    buildOrder();
    playCurrent();
});
