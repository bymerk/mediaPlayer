#Media Player

Plugin for extend HTML5 video/~~audio~~ player.

Example:

	var  mediaPlayer = new MediaPlayer('#video',
                {

                    playlist: [
                        'http://www.w3schools.com/html/mov_bbb.mp4'
                    ],

                    controls: {
                        play: '.play',
                        pause: '.stop',
                        next: '.next',
                        prev: '.prev',
                        fullscreen: '.fullscreen',
                        mute: '.mute'
                    },
	})
