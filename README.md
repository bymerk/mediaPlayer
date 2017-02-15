#Media Player

Smart HTML5 media player, can works with **video**, **audio** and **image**.
Unlike the default HTML5 media player it can play media from **playlist**.
Just specify in options which media files should be played in the order.

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
   



----------

#Media Player - RU

Умный HTML5 медиа плеер, работает с **видео**, **аудио** и **изображением**. В отличие от стандартного HTML5 плеера может воспроизводить **плейлисты**.

Просто укажите в настройках файлы, который вы хотите воспроизвести.

Пример смотрите выше.