/**
 * Created by merk on 14.02.17.
 */



export interface PlayerElements {

    video?: HTMLVideoElement,
    audio?: HTMLAudioElement,
    image?: HTMLImageElement

}

export interface PlaybackState {
    imageDuration: number
    paused:        boolean
    mediaType?:     string
    imageTimeout?:  number
    timeDiff?:      number
    startTime?:     number,
    pausedTime?:    number
}


export interface Player {

    element?:       Element | HTMLMediaElement,
    length?:        number,
    volume?:        number,
    stopped?:       Event,

    play():         void,
    pause():        void,
    next():         void,
    prev():         void,
    fullScreen():   void,
    volumeUp():     void,
    volumeDown():   void,
    mute():         void,
    shuffle():      void,

}


export interface MediaTypes {
    video: Array,
    audio: Array,
    image: Array,
}


export interface MediaStyle
{
    width?:         number|string,
    height?:        number|string
    background?:    number|string
}

export interface MediaControls
{
    play?:          string,
    pause?:         string,
    stop?:          string,
    next?:          string,
    prev?:          string,

    volumeUp?:      string,
    volumeDown?:    string,
    mute?:          string,

    fullScreen?:    string,

    shuffle?:       string,

}

export interface MediaPlayerOptions extends Object
{
    /**
     * playback
     */
    poster?: string,
    autoPlay?: boolean,
    startFrom?: number,
    repeat?: boolean,
    shuffle?: boolean,
    playlist?: Array<string>,
    imagePlayDuration?: number,

    /**
     * sounds
     */
    volume?: number,
    volumeStep?: number,



    // source?: Object,
    style?: MediaStyle;

    /**
     * controls
     */
    controls?: MediaControls
    showDefaultControls?: boolean
}
