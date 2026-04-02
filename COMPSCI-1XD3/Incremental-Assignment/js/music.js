/*
    Names: Charles Chen and Jonathan Graydon
    Date Modified: Feb 27, 2026
    File Description: Controls background music playback order, looping, and mute sync for Whiplash.
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

    /*
        Purpose: Builds a playlist order that starts at a random track and then wraps through all tracks.
        Parameters: None.
    */
    function buildOrder() {
        const start = Math.floor(Math.random() * musicTracks.length);
        order = [];

        for (let i = 0; i < musicTracks.length; i += 1) {
            order.push(musicTracks[(start + i) % musicTracks.length]);
        }

        index = 0;
    }

    /*
        Purpose: Loads and plays the current track index from the playlist order.
        Parameters: None.
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

    /*
        Purpose: Starts music playback only if playback has not already started.
        Parameters: None.
    */
    function ensurePlaying() {
        if (!started) {
            playCurrent();
        }
    }

    /*
        Purpose: Applies mute state to the current music player volume.
        Parameters:
            isMuted (boolean): True to mute music, false to unmute.
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
