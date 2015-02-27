var htmlCallToAction = '<div id="playlistAction" style="float: right; cursor:pointer;background-image: url(http://i.imgur.com/M0Qb4yL.png);height: 50%;width: 35%;background-repeat: no-repeat;top: 22%;position: absolute;right: 0px;"></div>';
$(".header").append( htmlCallToAction );
var urlBase  = "http://www.simpsonizados.com";
var URLtrue  = "?autoplay=true";
var getUrl   = document.URL;

var frameBase = null;

$(document).ready(function (){
	$(document).keyup(function (e){
		if(e.keyCode == 27){
			$(location).attr('href', urlBase);
		}

		if(e.keyCode == 13){
			next();
		}

		if(e.keyCode == 39){
			otroEpisodio();
		}
	});
});

if(getUrl.indexOf("temporada") !=-1){
	frameBase = $("#frmvid")[0].contentDocument;
}

var ancho = $(window).width();
var alto  = $(window).height();

if(getUrl.indexOf("?autoplay=true") !=-1){
	next();
}

$('#playlistAction').click(function (){
	var randomEpisode = $(".random > a").attr('href');
	$(location).attr('href', randomEpisode + URLtrue);
});

function next(){
	var elementID   = $("a[style='outline:none']", frameBase).attr("id");
	var getScript   = $('div#contLista > script:eq(0)', frameBase).text();
	var scriptClear = getScript.split('"');
	verVid(scriptClear[3],scriptClear[5],0,0);
}

function verVid(key,host,gk,subs) {
	var e = $("#error");
	e.html("Cargando servidor...");
	$("#error").fadeIn(150);
	$.ajax({
		url: '/ir',
		type: 'GET',
		data: { key:key,host:host,gk:gk,subs:subs,tc:'1001' },
		success: function(u) {
			var urlIncompleta = u.replace(".tv", ".com");
			var URLfinal      = urlIncompleta.replace("http://", "http://www.");
			console.log(URLfinal);
			$('iframe').remove();
			$('body').append('<iframe id="iframeModificado" src="'+ URLfinal +'" frameborder="0" scrolling="no" width="'+ ancho +'" height="'+ alto +'" style="position: absolute; top: 0px; z-index:99999;"></iframe>');
			
			console.log("Se cargo correctamente");
			setTimeout( "cerrarPublicidad();", 2000 );
			setTimeout( "fullScreen();", 5000 );
		},
		error: function() {
			e.html("Error.");
		}
	});

}

function cerrarPublicidad(){
	var frameVideo = $("iframe")[0].contentDocument;
	var publicidad = $('#ad', frameVideo).length;
	$('#videoplayer', frameVideo).attr('style', 'top:0px');
	if(publicidad){
		console.log("habia publicidad y se cerro");
		$('#ad', frameVideo).fadeOut();
	}

	else{
		console.log("La publicidad se habia cerrado correctamente");
	}
}

function fullScreen(){
	var frameVideo   = $("iframe")[0].contentDocument;
	var getIframeURL = $('iframe[src*="730"]', frameVideo).attr('src');
	
	//hack fullscreen
	$('iframe[src*="pinit.tv"]', frameVideo).attr('width', ancho);
	$('iframe[src*="pinit.tv"]', frameVideo).attr('height', alto);
	var iframeSRC       = getIframeURL.replace("730", ancho);
	var iframeSRCResize = iframeSRC.replace("400", alto);
	$('iframe[src*="730"]', frameVideo).attr('src', iframeSRCResize);
	var count = 0;
	var timer = $.timer(function() {
    	++count
    	if(count == 1260){
    		otroEpisodio();
    	}
	});
	
	timer.set({ time : 1000, autostart : true });
}

function otroEpisodio(){
	var nextRandomEpisode = $(".random > a").attr('href');
	var capituloFinal     = urlBase + nextRandomEpisode + URLtrue;
	console.log(capituloFinal);
	$(location).attr('href', capituloFinal);
}

//TIMER STOCK
//https://github.com/jchavannes/jquery-timer/blob/master/jquery.timer.js
;(function($) {
	$.timer = function(func, time, autostart) {	
	 	this.set = function(func, time, autostart) {
	 		this.init = true;
	 	 	if(typeof func == 'object') {
		 	 	var paramList = ['autostart', 'time'];
	 	 	 	for(var arg in paramList) {if(func[paramList[arg]] != undefined) {eval(paramList[arg] + " = func[paramList[arg]]");}};
 	 			func = func.action;
	 	 	}
	 	 	if(typeof func == 'function') {this.action = func;}
		 	if(!isNaN(time)) {this.intervalTime = time;}
		 	if(autostart && !this.isActive) {
			 	this.isActive = true;
			 	this.setTimer();
		 	}
		 	return this;
	 	};
	 	this.once = function(time) {
			var timer = this;
	 	 	if(isNaN(time)) {time = 0;}
			window.setTimeout(function() {timer.action();}, time);
	 		return this;
	 	};
		this.play = function(reset) {
			if(!this.isActive) {
				if(reset) {this.setTimer();}
				else {this.setTimer(this.remaining);}
				this.isActive = true;
			}
			return this;
		};
		this.pause = function() {
			if(this.isActive) {
				this.isActive = false;
				this.remaining -= new Date() - this.last;
				this.clearTimer();
			}
			return this;
		};
		this.stop = function() {
			this.isActive = false;
			this.remaining = this.intervalTime;
			this.clearTimer();
			return this;
		};
		this.toggle = function(reset) {
			if(this.isActive) {this.pause();}
			else if(reset) {this.play(true);}
			else {this.play();}
			return this;
		};
		this.reset = function() {
			this.isActive = false;
			this.play(true);
			return this;
		};
		this.clearTimer = function() {
			window.clearTimeout(this.timeoutObject);
		};
	 	this.setTimer = function(time) {
			var timer = this;
	 	 	if(typeof this.action != 'function') {return;}
	 	 	if(isNaN(time)) {time = this.intervalTime;}
		 	this.remaining = time;
	 	 	this.last = new Date();
			this.clearTimer();
			this.timeoutObject = window.setTimeout(function() {timer.go();}, time);
		};
	 	this.go = function() {
	 		if(this.isActive) {
				try { this.action(); }
	 			finally { this.setTimer(); }
	 		}
	 	};
	 	
	 	if(this.init) {
	 		return new $.timer(func, time, autostart);
	 	} else {
			this.set(func, time, autostart);
	 		return this;
	 	}
	};
})(jQuery);
