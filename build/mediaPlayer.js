/**
 * Created by merk on 14.02.17.
 */
"use strict";

/**
 * Created by merk on 14.02.17.
 */
"use strict";
var MediaPlayer = (function () {
    /**
     * Media player constructor
     *
     * @param target string
     * @param options
     */
    function MediaPlayer(target, options) {
        // try {
        /**
         * Player allowed media types
         *
         * @type {{video: [string,string,string]; image: [string,string,string,string]; audio: [string]}}
         * @private
         */
        this._mediaTypes = {
            video: ['mp4', 'ogg', 'webm'],
            image: ['jpg', 'jpeg', 'png', 'gif'],
            audio: ['mp3']
        };
        /**
         * class for control media items
         *
         * @type {string}
         * @private
         */
        this._mediaItemClass = 'media-player-item';
        /**
         * Style for disable default browser controls in fullscreen mode
         *
         * @type {string}
         * @private
         */
        this._styleDisableFullScreenControls = '::-webkit-media-controls { display:none !important;}';
        /**
         * @type {boolean}
         * @private
         */
        this._fullscreenEnable = false;
        /**
         * Default Options
         *
         * @type {{volume: number}}
         * @private
         */
        this._options = {
            autoPlay: true,
            showDefaultControls: false,
            imagePlayDuration: 25,
            repeat: true,
            volume: 0.75,
            volumeStep: 0.05,
            shuffle: false,
            playlist: [],
            startFrom: 0,
            style: {
                width: '100%',
                background: '#000'
            }
        };
        /**
         * Player
         *
         */
        this._player = {
            play: this.play.bind(this),
            pause: this.pause.bind(this),
            next: this.next.bind(this),
            prev: this.prev.bind(this),
            stop: this.stop.bind(this),
            fullScreen: this.fullScreen.bind(this),
            volumeUp: this.volumeUp.bind(this),
            volumeDown: this.volumeDown.bind(this),
            mute: this.mute.bind(this),
            shuffle: this.shuffle.bind(this)
        };
        /**
         * Player element from playback
         *
         */
        this._elements = {};
        this._playbackState = {};
        if (!target.length) {
            console.error('Can\'t get target');
            return;
        }
        console.log('target', target);
        this._player.element = document.querySelector(target);
        if (!this._player.element) {
            console.error('Can\'t find player');
            return;
        }
        if (typeof options == 'object' && options) {
            this._options = Object.assign(this._options, options);
        }
        console.log('options:', this._options);
        this._player.length = this._options.playlist.length;
        this._player.volume = this._options.volume;
        if (this._player.length == 0) {
            console.error('Empty playlist');
            return;
        }
        this._init();
        if (this._options.shuffle) {
            this.shuffle();
        }
        if (this._options.autoPlay) {
            this._player.play();
        }
        // } catch (err) {
        //     console.warn(err);
        // }
    }
    /**
     * Initialize player
     *
     * @private
     */
    MediaPlayer.prototype._init = function () {
        var _this = this;
        this._elements.video = document.createElement("video");
        this._elements.audio = document.createElement("audio");
        this._elements.image = document.createElement("img");
        this._elements.video.addEventListener('ended', function () { return _this._player.next(); });
        this._elements.audio.addEventListener('ended', function () { return _this._player.next(); });
        this._elements.image.addEventListener('ended', function () { return _this._player.next(); });
        for (var elem in this._elements) {
            this._elements[elem].style.display = "none";
            this._elements[elem].className = this._mediaItemClass;
            this._player.element.appendChild(this._elements[elem]);
        }
    };
    /**
     * Play next media item
     *
     */
    MediaPlayer.prototype.next = function () {
        this.pause();
        this._options.startFrom++;
        this._player.play();
    };
    /**
     * Play prev media item
     *
     */
    MediaPlayer.prototype.prev = function () {
        this.pause();
        this._options.startFrom -= 1;
        this._player.play();
    };
    /**
     * Pause playing media
     *
     */
    MediaPlayer.prototype.pause = function () {
        if (this._isActiveMedia()) {
            this._elements[this._playbackState.mediaType].pause();
        }
        else if (this._playbackState.imageTimeout) {
            clearTimeout(this._playbackState.imageTimeout);
        }
    };
    /**
     * Start playing media
     *
     */
    MediaPlayer.prototype.play = function () {
        var url = this._getMediaUrl(this._options.startFrom);
        if (!url) {
            return;
        }
        this._playbackState.mediaType = this._getMediaType(url);
        if (!this._playbackState.mediaType) {
            return;
        }
        for (var elem in this._elements) {
            this._elements[elem].style.display = "none";
        }
        this._elements[this._playbackState.mediaType].style.display = '';
        url = url.toString();
        if (this._isActiveMedia()) {
            this._elements[this._playbackState.mediaType].src = url.toString();
            this._elements[this._playbackState.mediaType].load();
            this._elements[this._playbackState.mediaType].play();
        }
        else {
            var _this_1 = this;
            this._elements.image.style.display = '';
            this._elements.image.src = url;
            this._playbackState.imageTimeout = setTimeout(function () { return _this_1._player.next(); }, this._options.imagePlayDuration * 1000);
        }
    };
    /**
     * Stop playing media
     *
     */
    MediaPlayer.prototype.stop = function () {
        this._options.startFrom = 0;
        this._player.play();
        this._player.pause();
    };
    /**
     * Change video/audio element sound volume
     *
     */
    MediaPlayer.prototype.changeVolume = function (volume) {
        volume = volume > 0 ? volume : 0;
        volume = volume < 1 ? volume : 1;
        if (this._isActiveMedia()) {
            this._elements[this._playbackState.mediaType].volume = volume;
            this._player.volume = volume;
        }
    };
    /**
     * Mute audio or video
     *
     */
    MediaPlayer.prototype.mute = function () {
        console.log('changed volume');
        this.changeVolume(0);
    };
    /**
     * Volume Up
     *
     */
    MediaPlayer.prototype.volumeUp = function () {
        this.changeVolume(this._player.volume + this._options.volumeStep);
    };
    /**
     * Volume Down
     */
    MediaPlayer.prototype.volumeDown = function () {
        this.changeVolume(this._player.volume - this._options.volumeStep);
    };
    /**
     * Fullscreen
     *
     */
    MediaPlayer.prototype.fullScreen = function () {
        if (this._player.element.requestFullscreen) {
            this._player.element.requestFullscreen();
        }
        else if (this._player.element.mozRequestFullScreen) {
            this._player.element.mozRequestFullScreen();
        }
        else if (this._player.element.webkitRequestFullscreen) {
            this._player.element.webkitRequestFullscreen();
        }
        else if (this._player.element.webkitSupportsFullscreen) {
            this._player.element.webkitSupportsFullscreen();
        }
        if (!this._styleElement) {
            this._styleElement = document.createElement('style');
            this._styleElement.setAttribute('id', 'media-player-style');
            this._styleElement.innerHTML = this._styleDisableFullScreenControls;
            this._player.element.appendChild(this._styleElement);
        }
    };
    /**
     * Shuffle playlist
     *
     */
    MediaPlayer.prototype.shuffle = function () {
        var j, x, i;
        for (i = this._options.playlist.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = this._options.playlist[i - 1];
            this._options.playlist[i - 1] = this._options.playlist[j];
            this._options.playlist[j] = x;
        }
    };
    /**
     * Getting media url
     *
     *
     * @param position
     * @returns {any}
     * @private
     */
    MediaPlayer.prototype._getMediaUrl = function (position) {
        if (typeof this._options.playlist[position] == 'string') {
            return this._options.playlist[position];
        }
        if (!this._options.repeat) {
            this.pause();
            return;
        }
        if (this._options.startFrom != 0) {
            this._options.startFrom = 0;
            return this._getMediaUrl(this._options.startFrom);
        }
        return '';
    };
    /**
     * Return media type
     *
     *
     * @param url
     * @private
     */
    MediaPlayer.prototype._getMediaType = function (url) {
        var ext = url.split('.').pop().toLowerCase();
        for (var i in this._mediaTypes) {
            if (this._mediaTypes[i].indexOf(ext) >= 0) {
                return i;
            }
        }
        return '';
    };
    /**
     * if it audio or video element we can use js audio/video api
     */
    MediaPlayer.prototype._isActiveMedia = function () {
        return this._playbackState.mediaType == 'video' || this._playbackState.mediaType == 'audio';
    };
    /**
 * Getting media player options
 *
 * @returns {MediaPlayerOptions}
 */
    MediaPlayer.prototype.getOptions = function () {
        return this._options;
    };
    return MediaPlayer;
}());
