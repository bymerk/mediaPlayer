/**
 * MediaPlayer Class
 * For working with html5 video/audio api
 *
 *
 * Created by merk on 07.11.16.
 * @author Evgeny Merkushev <byMerk@live.ru>
 * @git
 *
 *
 */
var MediaPlayer = (function () {
    /**
     * Media player constructor
     *
     * @param target string
     * @param options
     */
    function MediaPlayer(target, options) {
        /**
         * Default Options
         *
         * @type {{volume: number}}
         * @private
         */
        this._options = {
            autoplay: true,
            browserControls: false,
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
         * Control callbacks
         *
         *
         * @type {{}}
         * @private
         */
        this._controlMethods = {
            play: this.play,
            pause: this.pause,
            next: this.next,
            prev: this.prev,
            fullscreen: this.fullscreen,
            volumeUp: this.volumeUp,
            volumeDown: this.volumeDown,
            mute: this.mute,
            shuffle: this.shuffle
        };
        /**
         * Playlist height
         *
         * @type {number}
         * @private
         */
        this._playlistLength = 0;
        this._styleDisableFullScreenControls = '::-webkit-media-controls { display:none !important;}';
        /**
         * @type {boolean}
         * @private
         */
        this._fullscreenEnable = false;
        try {
            if (!target.length) {
                console.error('Can\'t find target');
                return;
            }
            this._player = document.querySelector(target);
            if (!this._player) {
                console.error('Can\'t find player');
                return;
            }
            if (typeof options == 'object' && options) {
                this._options = Object.assign(this._options, options);
            }
            console.log(this._options);
            this._playlistLength = this._options.playlist.length;
            if (this._playlistLength == 0) {
                console.error('Empty playlist');
                return;
            }
            this._init();
            if (this._options.shuffle) {
                this.shuffle();
            }
            this._play(this._options.autoplay);
        }
        catch (err) {
            console.warn(err);
        }
    }
    /**
     * Initialize player
     *
     * @private
     */
    MediaPlayer.prototype._init = function () {
        var _this = this;
        // options
        this._player.volume = this._options.volume;
        if (this._options.style.width) {
            this._player.style.width = this._options.style.width.toString();
        }
        if (this._options.style.height) {
            this._player.style.height = this._options.style.height.toString();
        }
        this._player.controls = this._options.browserControls;
        //events
        this._player.addEventListener('ended', function () { return _this.next(); });
        // controls
        if (this._options.controls) {
            var target;
            for (var i in this._options.controls) {
                if (this._controlMethods[i]) {
                    target = document.querySelectorAll(this._options.controls[i].toString());
                    var _length = target.length;
                    if (_length) {
                        for (var j = 0; j < _length; j++) {
                            target[j]['control'] = this._controlMethods[i];
                            target[j].addEventListener('click', function () {
                                this.control.call(_this);
                            });
                        }
                    }
                }
            }
        }
    };
    /**
     * Play url
     *
     * @param withOutPlay boolean
     * @private
     */
    MediaPlayer.prototype._play = function (withOutPlay) {
        var url = this._getMediaUrl(this._options.startFrom);
        if (url && url != false) {
            this._options.startFrom++;
            this._player.src = url.toString();
            this._player.load();
            if (withOutPlay != false) {
                this.play();
            }
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
        return false;
    };
    /**
     * Starting playing next media
     *
     * @private
     */
    MediaPlayer.prototype.next = function () {
        this._play();
    };
    /**
     * Starting playing prev media
     *
     * @private
     */
    MediaPlayer.prototype.prev = function () {
        this._options.startFrom -= 2;
        this._play();
    };
    /**
     * Stop playing
     */
    MediaPlayer.prototype.pause = function () {
        this._player.pause();
    };
    /**
     * Start playing
     */
    MediaPlayer.prototype.play = function () {
        this._player.play();
    };
    /**
     * Mute media
     */
    MediaPlayer.prototype.mute = function () {
        this._player.volume = 0;
    };
    /**
     * Fullscreen
     *
     */
    MediaPlayer.prototype.fullscreen = function () {
        if (this._player.requestFullscreen) {
            this._player.requestFullscreen();
        }
        else if (this._player.mozRequestFullScreen) {
            this._player.mozRequestFullScreen();
        }
        else if (this._player.webkitRequestFullscreen) {
            this._player.webkitRequestFullscreen();
        }
        else if (this._player.webkitSupportsFullscreen) {
            this._player.webkitSupportsFullscreen();
        }
        if (!this._styleElement) {
            this._styleElement = document.createElement('style');
            this._styleElement.setAttribute('id', 'media-player-style');
            this._styleElement.innerHTML = this._styleDisableFullScreenControls;
            document.body.appendChild(this._styleElement);
        }
    };
    /**
     * Volume Up
     *
     */
    MediaPlayer.prototype.volumeUp = function () {
        this.changeVolume(this._player.volume + this._options.volumeStep);
        return this._player.volume;
    };
    /**
     * Volume Down
     */
    MediaPlayer.prototype.volumeDown = function () {
        this.changeVolume(this._player.volume - this._options.volumeStep);
        return this._player.volume;
    };
    /**
     * Change player sound volume
     *
     * @param volume
     */
    MediaPlayer.prototype.changeVolume = function (volume) {
        volume = volume > 0 ? volume : 0;
        volume = volume < 1 ? volume : 1;
        this._player.volume = volume;
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
     * Getting media player options
     *
     * @returns {MediaPlayerOptions}
     */
    MediaPlayer.prototype.getOptions = function () {
        return this._options;
    };
    /**
     * Return player js object
     *
     * @returns {HTMLMediaElement}
     */
    MediaPlayer.prototype.getPlayer = function () {
        return this._player;
    };
    return MediaPlayer;
}());
