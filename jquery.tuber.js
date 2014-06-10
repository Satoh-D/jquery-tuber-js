/**
 * jQuery.tuber.js
 *
 * jQuery Plugin that use a Youtube Movie as background of Web page.
 *
 * @category    jQuery Plugin
 * @license     http://www.opensource.org/licenses/mit-license.html  MIT License
 * @copyright   2014, Sato Daiki
 * @author      Daiki Sato <sato.dik@gmail.com>
 * @link        http://orememo-v2.tumblr.com/
 * @version     1.0
 * @since       2014.06.06
 */

var tuber = tuber || {};

function onYouTubeIframeAPIReady() {
	tuber.$player.data('plugin_tuber').buildPlayer();
}

;(function($, window, document, undefined) {

	var pluginName = 'tuber',
			defaults = {
				isBackground: true,
				namespace: 'tuber-',
				videoId: '',
				videoLoop: true,
				videoMute: true,
				videoStart: 0,
				videoTheme: 'dark'
			},
			$w = $(window);

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		if(!this.settings.videoId) throw new Error('videoIDが設定されていません');

		this.init();
	}

	Plugin.prototype.init = function() {
		var self = this;

		// 変数設定
		self.$element = $(self.element);
		self.$parent = self.$element.parent();
		self.elementId = self.$element.attr('id');
		self.playerVars = {
			allowfullscreen: true,
			autohide: 2,
			autoplay: 0,
			controls: 0,
			disablekb: 0,
			modestbranding: 1,
			origin: '*',
			rel: 0,
			showinfo: 0,
			start: self.settings.videoStart,
			theme: self.settings.videoTheme,
			wmode: 'transparent'
		}

		if(!self.elementId) {
			self.elementId = self.settings.namespace + 'player'
			self.$element.attr('id', self.elementId);
		}

		// 外部からメソッドにアクセスできるようにする
		tuber.$player = self.$element;

		appendIframeAPI();
	}

	Plugin.prototype.buildPlayer = function() {
		var self = this;

		// プレイヤー部分CSS設定
		self.$elementWrap = $('<div />').attr('id', self.settings.namespace + 'wrap');
		self.$elementOverlay = $('<div />').attr('id', self.settings.namespace + 'overlay');
		self.$parent.css('position', 'relative').children();

		self.$parent.children().each(function() {
			if($(this).css('position') == 'static') $(this).css('position', 'relative');
		});

		self.$elementWrap.css({
			'display': 'none',
			'height': '100%',
			'left': 0,
			'position': 'absolute',
			'top': 0,
			'width': '100%',
			'z-index': 0
		});
		self.$elementOverlay.css({
			'height': '100%',
			'left': 0,
			'position': 'absolute',
			'top': 0,
			'width': '100%'
		});
		if(self.settings.isBackground) {
			$('html, body').css({
				'height': '100%',
				'width': '100%'
			});
			self.$elementWrap.css('position', 'fixed');
			self.$elementOverlay.css('position', 'fixed');
		}
		self.$element.wrap(self.$elementWrap).after(self.$elementOverlay);

		self.player = new YT.Player(self.elementId, {
			videoId: self.settings.videoId,
			playerVars: self.playerVars,
			events: {
				onReady: function(event) {
					self.onPlayerReady(event);
				},
				onStateChange: function(event) {
					self.onPlayerStateChange(event);
				}
			}
		});
	}

	Plugin.prototype.onPlayerReady = function(event) {
		var self = this,
				player = event.target;

		self.$element = $(player.getIframe());
		self.resizePlayer(event);
		$w.on('resize', function() { self.resizePlayer(event); });

		self.seekToSecond(player, 0);
		player.pauseVideo();
		if(self.settings.videoMute) player.mute();
		$('#' + self.settings.namespace + 'wrap').fadeIn(400, function() { player.playVideo(); });
	}

	Plugin.prototype.onPlayerStateChange = function(event) {
		var self = this,
				player = event.target,
				state = player.getPlayerState();

		// 0: 終了
		if(state == 0) {
			if(self.settings.videoLoop) self.seekToSecond(player, 0);
		}

		// 1: 再生中
		// 2: 停止
		// 3: バッファリング中
		// 5: 頭出し済み
		// -1: 未開始
	}

	Plugin.prototype.seekToSecond = function(player, second) {
		player.seekTo(second);
	}

	Plugin.prototype.resizePlayer = function(event) {
		var self = this,
				parentW = 0,
				parentH = 0,
				playerW = 0,
				playerH = 0,
				marginT = 0,
				marginL = 0;

		parentW = self.$parent.innerWidth();
		parentH = self.$parent.innerHeight();

		playerW = parentW;
		playerH = (parentW / 16) * 9;
		marginL = 0;
		marginT = -(Math.abs(parentH - playerH) / 2);

		// プレイヤーの縦幅がウィンドウの縦幅より小さい場合、
		// プレイヤーの縦幅を基準にプレイヤーのサイズを調整
		if(playerH < parentH) {
			playerH = parentH;
			playerW = (playerH / 9) * 16;
			marginT = 0;
			marginL = -(Math.abs(parentW - playerW) / 2);
		}

		event.target.setSize(playerW, playerH);
		self.$element.css({
			'margin-top': marginT,
			'margin-left': marginL
		});
	}

	function appendIframeAPI() {
			var tag = document.createElement('script'),
	    		firstScriptTag = document.getElementsByTagName('script')[0];

	    tag.src = "https://www.youtube.com/iframe_api";
	    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	} // end of appendIframeAPI

	$.fn[pluginName] = function(options) {
		this.each(function() {
			if(!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});

		return this;
	}

})(jQuery, window, document, undefined);
