jquery-tuber-js
===============

__jQuery Plugin that use a Youtube Movie as background of Web page.__

## Demo

[Demo Page(background of Web page.)](https://dl.dropboxusercontent.com/u/21601359/140610_tuberjs/test01.html)
[Demo Page(background of Parent element.)](https://dl.dropboxusercontent.com/u/21601359/140610_tuberjs/test02.html)

## Usage

```html
<head>
<script src="jquery.js"></script>
<script src="jquery.jquery.tuber.js"></script>
<script>
$(function() {
	$('#ytplayer').tuber({
		videoId: 'VIDEO-ID'
	});
});
</script>
</head>
<body>

<div id="ytplayer"></div>

</body>
```

## Options

- `isBackground`[boolean]: use a movie as background of page.
- `videoId`[string]: video-id of movie.
- `videoLoop`[boolean]: loop the movie.
- `videoMute'[boolean]: mute the audio.
- `videoStart'[number]: set the seconds the video should start at.
- `videoTheme'[string]: theme of movie player.('dark' or 'light')

## Browser Support

- IE9+
- Google Chrome (win/mac)
- Firefox (win/mac)
- Safari (win)

## License

MIT License.

## Copyright

©Sato Daiki. ([@Satoh_D](https://twitter.com/Satoh_D))
