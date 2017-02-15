#Media Player

Plugin for extend HTML5 video/audio/image player.


Example:

    <div id="media-player"></div>

        mediaPlayer = new MediaPlayer('#media-player',
                {

                    playlist: [
                        'some_video.mp4',
                        {
                            url:    'someimage.jpg',
                            type: 'image',
                            duration: 5,
                        },
                        'some_image_2.jpg', // default duration
                        'some_audio.mp3',
                        'http://www.w3schools.com/html/mov_bbb.mp4',
                    ],


                    // javascript element.style
                    style: {
                        width:  '500px',
                    },
                    
                    // custom controls
                    controls: {
                        play:   '.play',
                        pause:  '.stop',
                        next:   '.next',
                        prev:   '.prev',
                        fullScreen: '.fullscreen',
                        mute:   '.mute'
                    },

                });
    });
