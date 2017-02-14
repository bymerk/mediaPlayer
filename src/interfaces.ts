/**
 * Created by merk on 14.02.17.
 */



export interface PlayerElements {

    video?: HTMLVideoElement,
    audio?: HTMLAudioElement,
    image?: HTMLImageElement

}

export interface PlaybackState {
    mediaType?: string
    imageTimeout?: number
}


export interface Player {

    element?:  Element | HTMLMediaElement,
    length?: number,
    volume?: number,

    play(): void,
    pause(): void,
    next(): void,
    prev(): void,
    fullScreen(): void,
    volumeUp(): void,
    volumeDown(): void,
    mute(): void,
    shuffle(): void,

}


export interface MediaTypes {
    video: Array,
    audio: Array,
    image: Array,
}


export interface MediaStyle
{
    width?: number|string,
    height?: number|string
    background?: number|string
}

export interface MediaControls
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

export interface MediaPlayerOptions extends Object
{
    /**
     * playback
     */
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
