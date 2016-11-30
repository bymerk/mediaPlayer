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


interface MediaStyle
{
    width?: number|string,
    height?: number|string
    background?: number|string
}


interface MediaControls
{
    play?: string|Element,
    pause?: string|Element,

    next?: string|Element,
    prev?: string|Element,

    volumeUp?: string|Element,
    volumeDown?: string|Element,
    mute?: string|Element,

    fullscreen?: string|Element,

    shuffle?: string|Element,

}

interface MediaPlayerOptions
{
    autoplay?: boolean,

    startFrom?: number
    volume?: number,
    repeat?: boolean,
    shuffle?: boolean,

    volumeStep?: number,


    playlist?: Array<string>,
    source?: Object,

    style?: MediaStyle;

    controls?: MediaControls
    browserControls?: boolean
}


class MediaPlayer {


    /**
     * Default Options
     *
     * @type {{volume: number}}
     * @private
     */
    private _options: MediaPlayerOptions =
    {
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
        },

    };

    /**
     * Control callbacks
     *
     *
     * @type {{}}
     * @private
     */
    private _controlMethods: Object =
    {
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
     * Player element
     */
    private _player: HTMLMediaElement;

    private _playlistLength: number = 0;

    /**
     * Media player constructor
     *
     * @param target string
     * @param options
     */
    constructor(target: string, options?: MediaPlayerOptions)
    {

        try {

            if (!target.length) {
                console.error('Can\'t find target');
                return;
            }

            this._player = document.querySelector(target);

            if (!this._player)
            {
                console.error('Can\'t find player');
                return;
            }


            if (typeof options == 'object' && options)
            {
                this._options = Object.assign(this._options, options);
            }

            console.log(this._options);

            this._playlistLength = this._options.playlist.length;

            if (this._playlistLength == 0)
            {
                console.error('Empty playlist');
                return;
            }


            this._init();

            if (this._options.shuffle)
            {
                this.shuffle();
            }

            this._play(this._options.autoplay);

        } catch (err) {
            console.warn(err);
        }

    }

    /**
     * Initialize player 
     * 
     * @private
     */
    private _init() : void 
    {
        var _this = this;

        // options
        this._player.volume = this._options.volume;

        if (this._options.style.width)
        {
            this._player.style.width = this._options.style.width.toString();
        }

        if (this._options.style.height)
        {
            this._player.style.height = this._options.style.height.toString();
        }

        this._player.controls = this._options.browserControls;


        //events
        this._player.addEventListener('ended', () => _this.next());


        // controls
        if (this._options.controls)
        {
            var target;

            for(var i in this._options.controls)
            {
                if (this._controlMethods[i])
                {
                    target = document.querySelectorAll(this._options.controls[i].toString());

                    var _length = target.length;

                    if (_length)
                    {
                        for (var j = 0; j < _length; j++)
                        {
                            target[j]['control'] = this._controlMethods[i];

                            target[j].addEventListener('click', function () {
                                this.control.call(_this);
                            });
                        }
                    }
                }
            }
        }

    }

    /**
     * Play url
     *
     * @param withOutPlay boolean
     * @private
     */
    private _play(withOutPlay?: boolean) : void
    {

        var url = this._getMediaUrl(this._options.startFrom);

        if (url && url != false)
        {
            this._options.startFrom++;
            this._player.src = url.toString();
            this._player.load();

            if (withOutPlay != false)
            {
                this.play();
            }
        }
    }



    /**
     * Getting media url
     *
     *
     * @param position
     * @returns {any}
     * @private
     */
    private _getMediaUrl(position: number) : string|boolean
    {

        if (typeof this._options.playlist[position] == 'string')
        {
            return this._options.playlist[position];
        }

        if (!this._options.repeat)
        {
            this.pause();
            return;
        }

        if (this._options.startFrom != 0)
        {
            this._options.startFrom = 0;
            return this._getMediaUrl(this._options.startFrom);
        }

        return false;

    }


    /**
     * Starting playing next media
     *
     * @private
     */
    public next() : void
    {
        this._play();
    }

    /**
     * Starting playing prev media
     *
     * @private
     */
    public prev() : void
    {
        this._options.startFrom -=2;
        this._play();
    }


    /**
     * Stop playing
     */
    public pause() : void
    {
        this._player.pause();
    }

    /**
     * Start playing
     */
    public play() : void
    {
        this._player.play();
    }


    /**
     * Mute media
     */
    public mute() : void
    {
        this._player.volume = 0;
    }

    /**
     * Fullscreen
     *
     */
    public fullscreen() : void
    {
        if (this._player.requestFullscreen)
        {
            this._player.requestFullscreen();
        } else if (this._player.mozRequestFullScreen) {
            this._player.mozRequestFullScreen();
        } else if (this._player.webkitRequestFullscreen) {
            this._player.webkitRequestFullscreen();
        } else  if(this._player.webkitSupportsFullscreen) {
            this._player.webkitSupportsFullscreen();
        }
    }


    /**
     * Volume Up
     *
     */
    public volumeUp() : number
    {
        this.changeVolume(this._player.volume + this._options.volumeStep);
        return this._player.volume;
    }

    /**
     * Volume Down
     */
    public volumeDown() : number
    {
        this.changeVolume(this._player.volume - this._options.volumeStep);
        return this._player.volume;
    }


    /**
     * Change player sound volume
     *
     * @param volume
     */
    public changeVolume(volume: number) : void
    {
        volume = volume > 0 ? volume : 0;
        volume = volume < 1 ? volume : 1;

        this._player.volume = volume;
    }


    /**
     * Shuffle playlist
     *
     */
    public shuffle() : void
    {
        var j, x, i;
        for (i = this._options.playlist.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = this._options.playlist[i - 1];
            this._options.playlist[i - 1] = this._options.playlist[j];
            this._options.playlist[j] = x;
        }
    }

    /**
     * Getting media player options
     *
     * @returns {MediaPlayerOptions}
     */
    public getOptions() : MediaPlayerOptions
    {
        return this._options;
    }


    /**
     * Return player js object
     *
     * @returns {HTMLMediaElement}
     */
    public getPlayer() : HTMLMediaElement
    {
        return this._player;
    }
}


