// ====================================================================================
//  MATHIGON SLIDESHOWS SCRIPT
//
//  (c) Mathigon / Philipp Legner
//  info@mathigon.org
//  Not to be copied or edited without permission
// ====================================================================================


// ====================================================================================
// JQUERY UI TOUCH PUNCH PLUGIN 0.2.2
// (c) Dave Furfero MIT or GPL licence

(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);


// ====================================================================================
// VARIABLES SETUP

$('infobox h1').html('Loading...');
$('infobox p').html('On slower networks, this may take a few moments.');

var max_sld = $('section').size()-1;
var max_stp = 0;
var n_slide = 0;
var n_step  = 0;
var transit = '';
var durat   = 0;
var title   = '';
var pnotes  = 0;
var pbar    = '';
var sound   = 1;
var help    = 0;
var share   = 0;
var Xaudio;
var t       = setTimeout( function(){}, 0);
var autoGo  = setTimeout( function(){}, 0);
var paused  = 0;

// ====================================================================================
// HIDE AND SHOW TOOLBAR

function showToolbar() {
	$('header, #pbar').removeClass('off');
	clearTimeout(t);
	t = setTimeout( function() { $('header, #pbar').addClass('off'); }, 3000 );
};


// ====================================================================================
// TOUCHEVENT PLUGIN
// Courtesy of PADILICIOUS.COM and MACOSXAUTOMATION.COM

var triggerElementID = null; // this variable is used to identity the triggering element
var fingerCount = 0;
var startX = 0;
var startY = 0;
var curX = 0;
var curY = 0;
var deltaX = 0;
var deltaY = 0;
var horzDiff = 0;
var vertDiff = 0;
var minLength = 72; // the shortest distance the user may swipe
var swipeLength = 0;
var swipeAngle = null;
var swipeDirection = null;
	
	// The 4 Touch Event Handlers
	
	// NOTE: the touchStart handler should also receive the ID of the triggering element
	// make sure its ID is passed in the event call placed in the element declaration, like:
	// <div id="picture-frame" ontouchstart="touchStart(event,'picture-frame');"  ontouchend="touchEnd(event);" ontouchmove="touchMove(event);" ontouchcancel="touchCancel(event);">

	function touchStart(event,passedName) {
		// disable the standard ability to select the touched object
		event.preventDefault();
		// get the total number of fingers touching the screen
		fingerCount = event.touches.length;
		// since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
		// check that only one finger was used
		if ( fingerCount == 1 ) {
			// get the coordinates of the touch
			startX = event.touches[0].pageX;
			startY = event.touches[0].pageY;
			// store the triggering element ID
			triggerElementID = passedName;
		} else {
			// more than one finger touched so cancel
			showToolbar();
			touchCancel(event);
		}
	}

	function touchMove(event) {
		event.preventDefault();
		if ( event.touches.length == 1 ) {
			curX = event.touches[0].pageX;
			curY = event.touches[0].pageY;
		} else {
			touchCancel(event);
		}
	}
	
	function touchEnd(event) {
		event.preventDefault();
		// check to see if more than one finger was used and that there is an ending coordinate
		if ( fingerCount == 1 && curX != 0 ) {
			// use the Distance Formula to determine the length of the swipe
			swipeLength = Math.round(Math.sqrt(Math.pow(curX - startX,2) + Math.pow(curY - startY,2)));
			// if the user swiped more than the minimum length, perform the appropriate action
			if ( swipeLength >= minLength ) {
				caluculateAngle();
				determineSwipeDirection();
				processingRoutine();
				touchCancel(event); // reset the variables
			} else {
				showToolbar();
				touchCancel(event);
			}	
		} else {
			showToolbar();
			touchCancel(event);
		}
	}

	function touchCancel(event) {
		// reset the variables back to default values
		fingerCount = 0;
		startX = 0;
		startY = 0;
		curX = 0;
		curY = 0;
		deltaX = 0;
		deltaY = 0;
		horzDiff = 0;
		vertDiff = 0;
		swipeLength = 0;
		swipeAngle = null;
		swipeDirection = null;
		triggerElementID = null;
	}
	
	function caluculateAngle() {
		var X = startX-curX;
		var Y = curY-startY;
		var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
		var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
		swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
		if ( swipeAngle < 0 ) { swipeAngle =  360 - Math.abs(swipeAngle); }
	}
	
	function determineSwipeDirection() {
		if ( (swipeAngle <= 45) && (swipeAngle >= 0) ) {
			swipeDirection = 'left';
		} else if ( (swipeAngle <= 360) && (swipeAngle >= 315) ) {
			swipeDirection = 'left';
		} else if ( (swipeAngle >= 135) && (swipeAngle <= 225) ) {
			swipeDirection = 'right';
		} else if ( (swipeAngle > 45) && (swipeAngle < 135) ) {
			swipeDirection = 'down';
		} else {
			swipeDirection = 'up';
		}
	}
	
function processingRoutine() {
	var swipedElement = document.getElementById(triggerElementID);
	if ( swipeDirection == 'left' ) {
		goNext();
	} else if ( swipeDirection == 'right' ) {
		goBack();
	} else if ( swipeDirection == 'up' ) {
		showToolbar();
	} else if ( swipeDirection == 'down' ) {
		showToolbar();
	}
}


// ====================================================================================
// SLIDE TRANSITIONS

function goTo(m) { if (m != n_slide &&  m >= 0 && m <= max_sld) {

	s_old = $('#stage').children('section:eq('+n_slide+')');
	s_new = $('#stage').children('section:eq('+m+')');

    transit = s_old.attr('data-transition') || '';
    durat   = Number(s_old.attr('data-duration') || 0);
    title   = s_new.attr('data-title') || '';

	paused = 1;
	setTimeout( function() { paused = 0; }, durat );
	window.location.hash = String(m);

	switch(transit)
	{
		case '':
  			s_new.css('display','block');
			s_old.css('display','none' );
  			break;

		case 'fade':
			s_old.css('z-index','0' );
  			s_new.css('z-index','10');
			s_new.fadeIn( durat );
			setTimeout( function() { s_old.css('display','none') } , durat );
			break;

		case 'objects': //TO BE EDITED
			s_old.children().fadeOut(durat/2);
			setTimeout( function() {
				s_old.css('display','none')
				s_old.children().css('display','block');
				s_new.css('display','block')
				s_new.children().each( function(){
					if( $(this).is(':visible') && !($(this).is('script, .pnotes, .saudio')) ) {
						$(this).css('display','none');
						$(this).fadeIn(durat/2);
					}
				});
			} , durat/2 );
			break;

		case 'color':
  			$('#stage').css('background-color',(s_old.attr('data-viacolor') || '#000'));
			s_old.fadeOut( durat/2 );
			setTimeout( function() {
				s_new.fadeIn( durat/2 );
				$('#stage').css('background-color','#000');
			}, durat/2 );
			break;

		/*case 'blur':
			s_old.css('z-index','0' );
  			//s_new.css({'z-index':'10','display':'block','opacity':0,'-webkit-filter':'blur(10px)','border-spacing':10});
			s_new.animate({'border-spacing':0,'opacity':1},{
					duration: durat,
					step: function(now,fx){
						s_old.css('-webkit-filter','blur('+10-now+'px)');
						//s_new.css('-webkit-filter','blur('+   now+'px)');
					},
     			});
			setTimeout( function() { s_old.css('display','none') } , durat );
			break;*/

		// SLIDE TRANSITIONS -----------------------------------------------------------------------------
		case 'slideLeft':
  			s_new.css('display','block').css('left','100%').animate({'left':'0%'},durat);
			s_old.animate({'left':'-100%'},durat)
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat+5 );
			break;
		case 'slideRight':
  			s_new.css('display','block').css('left','-100%').animate({'left':'0%'},durat);
			s_old.animate({'left':'100%'},durat)
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat+5 );
			break;
		case 'slideUp':
  			s_new.css('display','block').css('top','100%').animate({'top':'0%'},durat);
			s_old.animate({'top':'-100%'},durat)
			setTimeout( function() { s_old.css({'display':'none','top':'0'}); }, durat+5 );
			break;
		case 'slideDown':
  			s_new.css('display','block').css('top','-100%').animate({'top':'0%'},durat);
			s_old.animate({'top':'100%'},durat)
			setTimeout( function() { s_old.css({'display':'none','top':'0'}); }, durat+5 );
			break;

		// COVER TRANSITIONS -----------------------------------------------------------------------------
		case 'coverLeft':
			s_old.css('z-index','0' );
  			s_new.css({'z-index':'10', 'display':'block', 'left':'-100%'}).animate({'left':'0%'},durat);
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat );
			break;
		case 'coverRight':
			s_old.css('z-index','0' );
  			s_new.css({'z-index':'10', 'display':'block', 'left':'100%'}).animate({'left':'0%'},durat);
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat );
			break;
		case 'coverUp':
			s_old.css('z-index','0' );
  			s_new.css({'z-index':'10', 'display':'block', 'top':'100%'}).animate({'top':'0%'},durat);
			setTimeout( function() { s_old.css({'display':'none','top':'0'}); }, durat );
			break;
		case 'coverDown':
			s_old.css('z-index','0' );
  			s_new.css({'z-index':'10', 'display':'block', 'top':'-100%'}).animate({'left':'0%'},durat);
			setTimeout( function() { s_old.css({'display':'none','top':'0'}); }, durat );
			break;

		// REVEAL TRANSITIONS -----------------------------------------------------------------------------
		case 'revealLeft':
			s_old.css({'z-index':'10','left':'0%'});
  			s_new.css({'z-index':'00', 'display':'block'}).animate({'left':'-100%'},durat);
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat+5 );
			break;
		case 'revealRight':
			s_old.css({'z-index':'10','left':'0%'});
  			s_new.css({'z-index':'00', 'display':'block'}).animate({'left':'100%'},durat);
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat+5 );
			break;
		case 'revealUp':
			s_old.css({'z-index':'10','top':'0%'});
  			s_new.css({'z-index':'00', 'display':'block'}).animate({'top':'-100%'},durat);
			setTimeout( function() { s_old.css({'display':'none','top':'0'}); }, durat+5 );
			break;
		case 'revealDown':
			s_old.css({'z-index':'10','top':'0%'});
  			s_new.css({'z-index':'00', 'display':'block'}).animate({'top':'-100%'},durat);
			setTimeout( function() { s_old.css({'display':'none','top':'0'}); }, durat+5 );
			break;

		// WIPE TRANSITIONS -----------------------------------------------------------------------------
		case 'wipeHorizontal':
			s_old.css('z-index','0' );
  			s_new.css({'z-index':'10','width':'0%'}).animate({'width':'100%'},durat);
			setTimeout( function() { s_old.css('display','none') } , durat );
			break;
		case 'wipeVertical':
			s_old.css('z-index','0' );
  			s_new.css({'z-index':'10','height':'0%'}).animate({'height':'100%'},durat);
			setTimeout( function() { s_old.css('display','none') } , durat );
			break;

		// ZOOM TRANSITIONS -----------------------------------------------------------------------------
	
	
		// FLIP TRANSITIONS -----------------------------------------------------------------------------
		/*case 'flipHorizontal':
  			$('#stage').css('perspective','800px');
			s_old.css({'transition':'transform 1s','transform-style':'preserve-3d','backface-visibility':'hidden'});
			s_new.css({'transition':'transform 1s','transform-style':'preserve-3d','backface-visibility':'hidden','display':'block','transform':'rotateY( 180deg )'});

			s_old.css({'transform':'rotateY( 180deg )'});
			s_old.css({'transform':'rotateY(   0deg )'});
			break;*/

		// CUBE TRANSITIONS -----------------------------------------------------------------------------
            // use CSS 3D transforms		
			
		case 'magic':
  			s_new.css('display','block');
			s_old.css('display','none' );
			break;
		// MANY MORE TO COME!	
		default:
  			s_new.css('display','block');
			s_old.css('display','none' );
	}

	$('#slidenumber').html(m);
	if( title == '' ) {
		$('#slidetitle' ).html('');
	} else {
		$('#slidetitle' ).html(': ' + title);
	}

	// Halt all slide audio and video
	setTimeout( function() {
		$('audio, video').each( function() {
			this.pause();
			try{ this.currentTime = 0; } catch(e) {}
		});
	}, durat/2 );

	// Run Slide Functions
	updateSlide(m,0,durat);

	// Update Navigation Slider
	$( "#pbar_slider" ).slider("value",m);

	// Fade out Infoboxes
	$('.infobox').fadeOut(500);
	help =0;
	share=0;

	// Navigation Slider Image
	$( "#pbar_img" ).attr('src',prevs+'slide'+m+'.jpg')

	setTimeout( function() {
		// Slide Auto Go Next
		if( s_new.attr('data-autoGo') ){
			autoGo = setTimeout( function() { goNext() }, s_new.attr('data-autoGo') )
		};
		
		// Reset Previous Slide
		try{ eval('xSteps'+n_slide+'("x");'); } catch(e) {};

		// Update Variables
		n_slide = m;
		n_step  = 0;
	}, durat);
}}


// ====================================================================================
// OBJECT TRANSITIONS

(function( $ ){
	$.fn.buildIn = function( transition, timeX, easeX ) {  
		return this.each(function() {

			var $this   = $(this);
			var Wx      = $('#stage').width();
			$this.css({'display':'block','opacity':'1','visibility':'hidden','position':'absolute'});

			var $width  = $this.width();
			var $height = $this.height();
			var $left   = $this.position().left;
			var $top    = $this.position().top;
			var $right  = Wx - $left  - $width;
			var $bottom = Wx - $right - $height;

			var iWidth  = $this.css('width');
			var iHeight = $this.css('height');
			var iLeft   = $this.css('left');
			var iTop    = $this.css('top');
			var iRight  = $this.css('right');
			var iBottom = $this.css('bottom');

			var time    = timeX || 1000;
			var $wrap   = '';

			if( easeX && ( easeX == 'linear' || easeX == 'swing' || /ease/.test(easeX) ) ) {
				var ease = easeX;	
			} else if( easeX ) {
				var ease = 'easeOut'+easeX;
			} else {
				var ease = 'swing';	
			}

			// SUPPORTED EASING VALUES
            // linear		swing		.Bounce
	        // .Quad		.Quint		.Sine		
			// .Cubic		.Expo		.Back
			// .Quart		.Circ		.Elastic
			// (replace . with 'easeIn' or 'easeOut' or 'easeInOut')

			//$this.css({'left':$left,'top':$top,'right':'auto','bottom':'auto'});

			switch( transition )
			{
				case 'appear':
					$this.css('visibility','visible');
  					break;

				case 'fade':
					$this.css({'opacity':0,'visibility':'visible' });
					$this.animate({'opacity':1},time,ease);
  					break;

				// DIRECTIONAL FADE ANIMATIONS -----------------------------------------------------------------------------
				case 'fadeLeft':
					$this.css({'opacity':0,'visibility':'visible','left':($left-$width/3),'right':'auto'});
					$this.animate({'opacity':1,'left':$left},time,ease);
					//	THIS METHOD ANIMATES CSS 'TRANSFORM' RATHER THAN 'LEFT'. THIS MEANS IT DOESN'T INTERFERE
					//	WITH THE SLIDE POSITIONING BUT MAKES THE ANIMATION SIGNIFICANTLY SLOWER
					//	$this.css({'opacity':0,'visibility':'visible','transform':'translateX('+(-$width/3)+'px)','border-spacing':($width/3)});
					//	$this.animate({'border-spacing':0,'opacity':1},{
					//			duration: time,
					//			step: function(now,fx){ $this.css('transform','translateX('+(-now)+'px)'); },
					//			easing: easx
     				//		});
  					break;
				case 'fadeRight':
					$this.css({'opacity':0,'visibility':'visible','left':($left+$width/3),'right':'auto'});
					$this.animate({'opacity':1,'left':$left},time,ease);
  					break;
				case 'fadeUp':
					$this.css({'opacity':0,'visibility':'visible','top':($top+$height/3),'bottom':'auto'});
					$this.animate({'opacity':1,'top':$top},time,ease);
  					break;
				case 'fadeDown':
					$this.css({'opacity':0,'visibility':'visible','top':($top-$height/3),'bottom':'auto'});
					$this.animate({'opacity':1,'top':$top},time,ease);
  					break;

				case 'sfadeRight':
					$this.css({'opacity':0,'visibility':'visible','left':($left+$width/6),'right':'auto'});
					$this.animate({'opacity':1,'left':$left},time,ease);
  					break;
				case 'sfadeDown':
					$this.css({'opacity':0,'visibility':'visible','top':($top-$height/12),'bottom':'auto'});
					$this.animate({'opacity':1,'top':$top},time,ease);
  					break;

				
				// FLY IN ANIMATIONS -----------------------------------------------------------------------------
				case 'flyLeft':
					$this.css({'visibility':'visible','left':-$width,'right':'auto'});
					$this.animate({'left':$left},time,ease);
  					break;
				case 'flyRight':
					$this.css({'visibility':'visible','right':-$width,'left':'auto'});
					$this.animate({'right':$right},time,ease);
  					break;
				case 'flyTop':
					$this.css({'visibility':'visible','top':-$height,'bottom':'auto'});
					$this.animate({'top':$top},time,ease);
  					break;
				case 'flyBottom':
					$this.css({'visibility':'visible','bottom':-$height,'top':'auto'});
					$this.animate({'bottom':$bottom},time,ease);
  					break;
				case 'flyTopLeft':
					$this.css({'visibility':'visible','left':-$width,'right':'auto','top':-$height,'bottom':'auto'});
					$this.animate({'left':$left,'top':$top},time,ease);
  					break;
				case 'flyTopRight':
					$this.css({'visibility':'visible','right':-$width,'left':'auto','top':-$height,'bottom':'auto'});
					$this.animate({'right':$right,'top':$top},time,ease);
  					break;
				case 'flyBottomLeft':
					$this.css({'visibility':'visible','left':-$width,'right':'auto','bottom':-$height,'top':'auto'});
					$this.animate({'left':$left,'bottom':$bottom},time,ease);
  					break;
				case 'flyBottomRight':
					$this.css({'visibility':'visible','right':-$width,'left':'auto','bottom':-$height,'top':'auto'});
					$this.animate({'right':$right,'bottom':$bottom},time,ease);
  					break;

				// CSS TRANSFORM ANIMATIONS -----------------------------------------------------------------------------
				case 'zoomUp':
					$this.css({'opacity':0,'visibility':'visible','transform':'scale(0.5,0.5)','border-spacing':0.5});
					$this.animate({'border-spacing':1,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scale('+now+','+now+')'); },
							easing: ease
     					});
  					break;
				case 'zoomDown':
					$this.css({'opacity':0,'visibility':'visible','transform':'scale(2,2)','border-spacing':2});
					$this.animate({'border-spacing':1,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scale('+now+','+now+')'); },
							easing: ease
     					});
  					break;
				case 'rotate':
					$this.css({'opacity':0,'visibility':'visible','transform':'rotate(180deg)','border-spacing':180});
					$this.animate({'border-spacing':0,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','rotate('+now+'deg)'); },
							easing: ease
     					});
  					break;
				case 'rotateUp':
					$this.css({'opacity':0,'visibility':'visible','transform':'rotate(180deg) scale(0.5,0.5)','border-spacing':1});
					$this.animate({'border-spacing':0,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','rotate('+(180*now)+'deg) scale('+(1-now)+','+(1-now)+')'); },
							easing: ease
     					});
  					break;
				case 'rotateDown':
					$this.css({'opacity':0,'visibility':'visible','transform':'rotate(180deg) scale(0.5,0.5)','border-spacing':1});
					$this.animate({'border-spacing':0,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','rotate('+(180*now)+'deg) scale('+(1+now)+','+(1+now)+')'); },
							easing: ease
     					});
  					break;
				case 'spin':
					$this.css({'opacity':0,'visibility':'visible','transform':'rotate(1080deg)','border-spacing':1080});
					$this.animate({'border-spacing':0,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','rotate('+now+'deg)'); },
							easing: ease
     					});
  					break;
				case 'spinUp':
					$this.css({'opacity':0,'visibility':'visible','transform':'rotate(1080deg) scale(0.5,0.5)','border-spacing':1});
					$this.animate({'border-spacing':0,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','rotate('+(1080*now)+'deg) scale('+(1-now)+','+(1-now)+')'); },
							easing: ease
     					});
  					break;
				case 'spinDown':
					$this.css({'opacity':0,'visibility':'visible','transform':'rotate(1080deg) scale(0.5,0.5)','border-spacing':1});
					$this.animate({'border-spacing':0,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','rotate('+(1080*now)+'deg) scale('+(1+now)+','+(1+now)+')'); },
							easing: ease
     					});
  					break;
				case 'flipHorizontal':  // rezise wrapping div
					$this.css({'opacity':0,'visibility':'visible','transform':'scaleX(-1)','border-spacing':0});
					$this.animate({'border-spacing':2,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scaleX('+(now-1)+')'); },
							easing: ease
     					});
  					break;
				case 'flipVertical':    // rezise wrapping div
					$this.css({'opacity':0,'visibility':'visible','transform':'scaleY(-1)','border-spacing':0});
					$this.animate({'border-spacing':2,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scaleY('+(now-1)+')'); },
							easing: ease
     					});
  					break;
				case 'stretchHorizontal':
					$this.css({'opacity':0,'visibility':'visible','transform':'scaleX(0)','border-spacing':0});
					$this.animate({'border-spacing':1,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scaleX('+now+')'); },
							easing: ease
     					});
  					break;
				case 'stretchVertical':
						$this.css({'opacity':0,'visibility':'visible','transform':'scaleY(0)','border-spacing':0});
					$this.animate({'border-spacing':1,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scaleY('+now+')'); },
							easing: ease
     					});
  					break;
				case 'expandHorizontal':
					$this.css({'opacity':0,'visibility':'visible','transform':'scaleX(2)','border-spacing':2});
					$this.animate({'border-spacing':1,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scaleX('+now+')'); },
							easing: ease
     					});
  					break;
				case 'expandVertical':
						$this.css({'opacity':0,'visibility':'visible','transform':'scaleY(2)','border-spacing':2});
					$this.animate({'border-spacing':1,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scaleY('+now+')'); },
							easing: ease
     					});
  					break;

				// CSS 3D TRANSFORM ANIMATIONS -----------------------------------------------------------------------------
				case 'flip3DHorizontal':
					$this.wrap('<div class="wrapper3D" />')
					     .css({ 'visibility':'visible','left':0,'top':0,'width':$width,'height':$height,'transform':'rotateY(270deg)','border-spacing':270})
						 .parent().css({'left':$left,'top':$top,'right':$right,'bottom':$bottom,'width':0,'height':$height})

					$this.animate({'border-spacing':0},{
							duration: time, easing: ease,
							step: function(now,fx){ $this.css('transform','rotateY('+now+'deg)'); },
							complete: function(){ $this.unwrap().css({ 'left':$left,'top':$top,'right':$right,'bottom':$bottom }); }
     					});
  					break;

				case 'flip3DVertical':
					$this.wrap('<div class="wrapper3D" />')
					     .css({ 'visibility':'visible','left':0,'top':0,'width':$width,'height':$height,'transform':'rotateX(270deg)','border-spacing':270})
						 .parent().css({'left':$left,'top':$top,'right':$right,'bottom':$bottom,'width':0,'height':$height})

					$this.animate({'border-spacing':0},{
							duration: time, easing: ease,
							step: function(now,fx){ $this.css('transform','rotateX('+now+'deg)'); },
							complete: function(){ $this.unwrap().css({ 'left':$left,'top':$top,'right':$right,'bottom':$bottom }); }
     					});
  					break;

				case 'liftFront':
					$this.wrap('<div class="wrapper3D" />')
					     .css({ 'visibility':'visible','left':0,'top':0,'width':$width,'height':$height,'transform':'rotateX(-90deg) translateZ('+$height/2+'px)','border-spacing':90})
						 .parent().css({'left':$left,'top':$top,'right':$right,'bottom':$bottom,'width':0,'height':$height,'-webkit-perspective-origin':'centre bottom'})

					$this.animate({'border-spacing':0},{
							duration: time, easing: ease,
							step: function(now,fx){ $this.css('transform','rotateX(-'+now+'deg) translateZ('+($height*now/180)+'px)'); },
							complete: function(){ $this.unwrap().css({ 'left':$left,'top':$top,'right':$right,'bottom':$bottom }); }
     					});
  					break;

				// case 'liftBack':
				// case 'fallFront':
				// case 'fallBack':
				// case 'placeLeftFront':
				// case 'placeLeftBack':
				// case 'placeRightFront':
				// case 'placeRightBack':

				// case 'cubeLeft':
				// case 'cubeRight':
				// case 'cubeTop':
				// case 'cubeBottom':

				// WEBKIT FILTER ANIMATIONS -----------------------------------------------------------------------------
				case 'blur':
					$this.css({'opacity':0,'visibility':'visible','-webkit-filter':'blur(10px)','border-spacing':10});
					$this.animate({'border-spacing':0,'opacity':1},{
							duration: time,
							step: function(now,fx){ $this.css('-webkit-filter','blur('+now+'px)'); },
							easing: ease
     					});
  					break;

				// WIPE ANIMATIONS -----------------------------------------------------------------------------
				case 'wipeLeft':
					$this.wrap('<div class="wrapper" />')
					     .css({ 'visibility':'visible','left':0,'top':0,'right':0,'bottom':0,'width':$width,'height':$height });
					$this.parent()
					     .css({'left':$left,'top':$top,'right':$right,'bottom':$bottom,'width':0,'height':$height})
					     .animate({'width':$width},time,ease, function() {
						      $this.unwrap().css({ 'left':$left,'top':$top,'right':$right,'bottom':$bottom });
					     });
  					break;
				case 'wipeTop':
					$this.wrap('<div class="wrapper" />')
					     .css({ 'visibility':'visible','left':0,'top':0,'right':0,'bottom':0,'width':$width,'height':$height });
					$this.parent()
					     .css({'left':$left,'top':$top,'right':$right,'bottom':$bottom,'width':$width,'height':0})
					     .animate({'height':$height},time,ease, function() {
						      $this.unwrap().css({ 'left':$left,'top':$top,'right':$right,'bottom':$bottom });
					     });
  					break;
				// case 'wipeRight':
				// case 'wipeBottom':
				// case 'curtainVerticalOpen':
				// case 'curtainVerticalClose':
				// case 'curtainHorizontalOpen':
				// case 'curtainHorizontalClose':
				// Many more wipe transitions (circle, checks, blinds, ...) could be created using CANVAS elements.
				// But this will be quite hard to implement...

				// SPECIAL ANIMATIONS -----------------------------------------------------------------------------
				case 'lenseFlare':
					var $lense = $this.parents('section')
					                  .append('<div class="lense"><div class="lense1"></div><div class="lense2"></div><div class="lense3"></div><div class="lense4"></div><div class="lense5"></div><div class="lense6"></div><div class="lense7"></div><div class="lense8"></div><div class="lense9"></div></div>')
									  .children('.lense')
					                  .css({'top':($top+$height/2),'left':($left-Wx/2),'border-spacing':0,'opacity':0});
					
					$this.buildIn('wipeLeft',time)
					
					$lense.animate({'border-spacing':1,'left':('+='+$width)},{
						duration: time,
						step: function(now,fx){
								$lense.css('opacity',  Math.min(4*now,1,4-4*now)  );
								$lense.children('.lense1').css('transform','translateX(' +(500*(1-2*now))+    'px)');
								$lense.children('.lense2').css('transform','translateX(' +(400*(1-2*now))+    'px)');
								$lense.children('.lense3').css('transform','translateX(' +(300*(1-2*now))+    'px)');
								$lense.children('.lense4').css('transform','translateX(' +(200*(1-2*now))+    'px)');
								$lense.children('.lense5').css('transform','translateX(' +(100*(1-2*now))+    'px)');
								$lense.children('.lense6').css('transform','rotation('   +( 40*(1-2*now))+   'deg)');
								$lense.children('.lense7').css('transform','scale('      +(0.2+3.2*now*(1-now))+')');
								$lense.children('.lense8').css('transform','translateX(-'+(300*(1-2*now))+    'px)');
								$lense.children('.lense9').css('transform','translateX(-'+(400*(1-2*now))+    'px)');
							},
						easing: ease,
						complete: function(){ $lense.remove(); }
     				});

					break;
				// case 'sparcle':         // overlaid gif
				// case 'typewriter':      // advanced JS
				// case 'flash':           // overaid CSS
				//	$this.parents('section').append(
				//		'<div class=flash style="left:'+'; top:'+'; width:'+'; height:'+'; "></div>'
				//	);
				//	break;
				// case 'shimmer':         // overlaid gif

				// PRESETS ANIMATIONS -----------------------------------------------------------------------------
				case 'pop':
					$this.buildIn('zoomUp',time,'Back')
					break;
				case 'drop':
					$this.buildIn('flyTop',time,'Bounce')
					break;
				case 'hanging':
					$this.buildIn('fallBack',time,'Elastic')
					break;
				case 'hit':
					$this.buildIn('fallBack',time,'Bounce')
					break;
						
				// DEFAULT -----------------------------------------------------------------------------
				default:
					$this.css('visibility','visible');
			}

			/*setTimeout( function() {
				$this.css({'left':iLeft,'top':iTop,'right':iRight,'bottom':iBottom,'width':iWidth,'height':iHeight});
			}, time );*/
	
		});
	};
})( jQuery );


(function( $ ){
	$.fn.buildOut = function( transition, timeX, easeX ) {  
		return this.each(function() {

			var $this   = $(this);
			var Wx      = $('#stage').width();

			var $width  = $this.width();
			var $height = $this.height();
			var $left   = $this.position().left;
			var $top    = $this.position().top;
			var $right  = Wx - $left  - $width;
			var $bottom = Wx - $right - $height;

			var time    = timeX || 1000;
			var $wrap   = '';

			if( easeX && ( easeX == 'linear' || easeX == 'swing' || /ease/.test(easeX) ) ) {
				var ease = easeX;	
			} else if( easeX ) {
				var ease = 'easeIn'+easeX;
			} else {
				var ease = 'swing';	
			}

			switch( transition )
			{
				case 'appear': break;

				case 'fade':
					$this.css({'opacity':1 });
					$this.animate({'opacity':0},time,ease);
  					break;

				// DIRECTIONAL FADE ANIMATIONS -----------------------------------------------------------------------------
				case 'fadeLeft':
					$this.css({'opacity':1,'visibility':'visible','left':$left,'right':'auto'});
					$this.animate({'opacity':0,'left':($left-$width/3)},time,ease);
  					break;
				case 'fadeRight':
					$this.css({'opacity':1,'visibility':'visible','left':$left,'right':'auto'});
					$this.animate({'opacity':0,'left':($left+$width/3)},time,ease);
  					break;
				case 'fadeUp':
					$this.css({'opacity':1,'visibility':'visible','top':$top,'bottom':'auto'});
					$this.animate({'opacity':0,'top':($top+$height/3)},time,ease);
  					break;
				case 'fadeDown':
					$this.css({'opacity':1,'visibility':'visible','top':$top,'bottom':'auto'});
					$this.animate({'opacity':0,'top':($top-$height/3)},time,ease);
  					break;
				
				// FLY OUT ANIMATIONS -----------------------------------------------------------------------------
				case 'flyLeft':
					$this.css({'left':$left,'right':'auto'});
					$this.animate({'left':-$width},time,ease);
  					break;
				case 'flyRight':
					$this.css({'right':$right,'left':'auto'});
					$this.animate({'right':-$width},time,ease);
  					break;
				case 'flyTop':
					$this.css({'top':$top,'bottom':'auto'});
					$this.animate({'top':-$height},time,ease);
  					break;
				case 'flyBottom':
					$this.css({'bottom':$bottom,'top':'auto'});
					$this.animate({'bottom':-$height},time,ease);
  					break;
				case 'flyTopLeft':
					$this.css({'left':$left,'right':'auto','top':$top,'bottom':'auto'});
					$this.animate({'left':-$width,'top':-$height},time,ease);
  					break;
				case 'flyTopRight':
					$this.css({'right':$right,'left':'auto','top':$top,'bottom':'auto'});
					$this.animate({'right':-$width,'top':-$height},time,ease);
  					break;
				case 'flyBottomLeft':
					$this.css({'left':$left,'right':'auto','bottom':$bottom,'top':'auto'});
					$this.animate({'left':-$width,'bottom':-$height},time,ease);
  					break;
				case 'flyBottomRight':
					$this.css({'right':$right,'left':'auto','bottom':$bottom,'top':'auto'});
					$this.animate({'right':-$width,'bottom':-$height},time,ease);
  					break;

				// CSS TRANSFORM ANIMATIONS -----------------------------------------------------------------------------
				case 'zoomUp':
					alert('hi');
					$this.css({'opacity':1,'border-spacing':1});
					$this.animate({'border-spacing':2,'opacity':0},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scale('+now+','+now+')'); },
							easing: ease
     					});
  					break;
				case 'zoomDown':
					$this.css({'opacity':1,'border-spacing':1});
					$this.animate({'border-spacing':0.5,'opacity':0},{
							duration: time,
							step: function(now,fx){ $this.css('transform','scale('+now+','+now+')'); },
							easing: ease
     					});
  					break;
				case 'rotate':
					$this.css({'opacity':1,'border-spacing':0});
					$this.animate({'border-spacing':180,'opacity':0},{
							duration: time,
							step: function(now,fx){ $this.css('transform','rotate('+now+'deg)'); },
							easing: ease
     					});
  					break;

				// WEBKIT FILTER ANIMATIONS -----------------------------------------------------------------------------
				case 'blur':
					$this.css({'opacity':1,'visibility':'visible','-webkit-filter':'blur(0px)','border-spacing':0});
					$this.animate({'border-spacing':10,'opacity':0},{
							duration: time,
							step: function(now,fx){ $this.css('-webkit-filter','blur('+now+'px)'); },
							easing: ease
     					});
  					break;

				// WIPE ANIMATIONS -----------------------------------------------------------------------------
				case 'wipeLeft':
					$this.wrap('<div class="wrapper" />')
					     .css({ 'visibility':'visible','left':0,'top':0,'right':0,'bottom':0,'width':$width,'height':$height });
					$this.parent()
					     .css({'left':$left,'top':$top,'right':$right,'bottom':$bottom,'width':$width,'height':$height})
					     .animate({'width':0},time,ease, function() {
						      $this.unwrap().css({ 'left':$left,'top':$top,'right':$right,'bottom':$bottom });
					     });
  					break;
				case 'wipeTop':
					$this.wrap('<div class="wrapper" />')
					     .css({ 'visibility':'visible','left':0,'top':0,'right':0,'bottom':0,'width':$width,'height':$height });
					$this.parent()
					     .css({'left':$left,'top':$top,'right':$right,'bottom':$bottom,'width':$width,'height':$height})
					     .animate({'height':0},time,ease, function() {
						      $this.unwrap().css({ 'left':$left,'top':$top,'right':$right,'bottom':$bottom });
					     });
  					break;

				// SPECIAL ANIMATIONS -----------------------------------------------------------------------------
				case 'lenseFlare':
					var $lense = $this.parents('section')
					                  .append('<div class="lense"><div class="lense1"></div><div class="lense2"></div><div class="lense3"></div><div class="lense4"></div><div class="lense5"></div><div class="lense6"></div><div class="lense7"></div><div class="lense8"></div><div class="lense9"></div></div>')
									  .children('.lense')
					                  .css({'top':($top+$height/2),'left':($left-Wx/2),'border-spacing':0,'opacity':0});
					
					$this.buildIn('wipeRight',time)
					
					$lense.animate({'border-spacing':1,'left':('+='+$width)},{
						duration: time,
						step: function(now,fx){
								$lense.css('opacity',  Math.min(4*now,1,4-4*now)  );
								$lense.children('.lense1').css('transform','translateX(' +(500*(1-2*now))+    'px)');
								$lense.children('.lense2').css('transform','translateX(' +(400*(1-2*now))+    'px)');
								$lense.children('.lense3').css('transform','translateX(' +(300*(1-2*now))+    'px)');
								$lense.children('.lense4').css('transform','translateX(' +(200*(1-2*now))+    'px)');
								$lense.children('.lense5').css('transform','translateX(' +(100*(1-2*now))+    'px)');
								$lense.children('.lense6').css('transform','rotation('   +( 40*(1-2*now))+   'deg)');
								$lense.children('.lense7').css('transform','scale('      +(0.2+3.2*now*(1-now))+')');
								$lense.children('.lense8').css('transform','translateX(-'+(300*(1-2*now))+    'px)');
								$lense.children('.lense9').css('transform','translateX(-'+(400*(1-2*now))+    'px)');
							},
						easing: ease,
						complete: function(){ $lense.remove(); }
     				});

					break;
				// case 'sparcle':         // overlaid gif
				// case 'shimmer':         // overlaid gif

				// PRESETS ANIMATIONS -----------------------------------------------------------------------------
				case 'pop':
					$this.buildOut('zoomUp',time,'Back')
					break;
				case 'drop':
					$this.buildOut('flyTop',time,'Bounce')
					break;
				case 'hanging':
					$this.buildOut('fallBack',time,'Elastic')
					break;
				case 'hit':
					$this.buildOut('fallBack',time,'Bounce')
					break;
			}

			setTimeout( function() {
				$this.css('visibility','hidden');
			}, time );
	
		});
	};
})( jQuery );


// ====================================================================================
// SLIDE STEPS

function updateSlide(sld,stp,delay) {
	if( !delay) { var delay = 0; }

	// Update Slide Notes
	if(pnotes) {
		$('#notes'    ).height( $('#notes').height() );
		$('#notes_box').addClass('off');
		setTimeout ( function() {
			$('#notes_box').html( $('#stage').children('section:eq('+sld+')').children('.pnotes:eq('+stp+')').html() || '' );
			$('#notes_box').removeClass('off');
			$('#notes'    ).height( $('#notes_box').height() + 12 );
			/*setTimeout ( function() { $('#notes').css('height','auto'); }, 205);*/
		}, 305);
	} else {
		$('#notes_box').html( $('#stage').children('section:eq('+sld+')').children('.pnotes:eq('+stp+')').html() || '' );
	}

	// Run Slide Functions and Audio, after certain delay
	setTimeout( function() {	
		try { eval('xSteps'+sld+'('+stp+');'); } catch(e) {};
		
		if(sound) {
			Xaudio = $('#stage').children('section:eq('+sld+')').children('.saudio');
			 if( Xaudio[stp] ) { Xaudio[stp].play(); }
		}
	}, delay)
}

function goNext( ) { if( 1-paused) {

	// Clear Auto Next SLide Timeout
	clearTimeout(autoGo);
	
	// Check whether to move on to next slide
	if(eval( "typeof xSteps" + n_slide + " == 'function' " )) {
		max_stp = eval( "xSteps" + n_slide +"('max')" );
	} else {
		max_stp = 0;
	}

	// Halt all audio
	$('.saudio').each( function() {
		this.pause();
		try{ this.currentTime = 0; } catch(e) {}
	});

	// Load Next Slide
	if( n_step < max_stp ) {
		n_step++;
		updateSlide(n_slide,n_step);
	} else {
		goTo(n_slide+1);
	}
}}

function goBack() {
	// Halt all audio
	$('.saudio').each( function() {
		this.pause();
		try{ this.currentTime = 0; } catch(e) {}
	});

	// Load Appropriate Slide
	/*if( n_step > 0 ) {                                                                                                          // GO TO BEGINNING OF SLIDE
		goTo(n_slide);
	} else {*/
		goTo(n_slide-1);
	/*}*/
}


// ====================================================================================
// FULLSCREEN FUNCTION

function goFullscreen() {
	var slideshow = document.getElementById('body');
	
	if (document.webkitIsFullScreen || document.mozFullScreen || document.fullScreen) {
	
		if(document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen()
		} else if ( document.mozCancelFullScreen ) {
			document.mozCancelFullScreen()
		} else if ( document.exitFullscreen ) {
			document.exitFullscreen()
		};
		$('#t_full').removeClass('on');
			
	} else {
	
		if (slideshow.mozRequestFullScreen) {
			slideshow.mozRequestFullScreen();
		} else if (slideshow.webkitRequestFullScreen) {
			slideshow.webkitRequestFullscreen();
		} else if (slideshow.RequestFullScreen) {
			slideshow.RequestFullscreen();
		} else {
			alert('Fullscreen is not supported by your browser.');	
		};
		$('#t_full').addClass('on');
		
	} 
};


// ====================================================================================
// SLIDE ASPECT RATIO

function aspectRatio() {
	
	var w0 = $('body').width();
	var h0 = $('body').height();
	var r0 = Number( $('#stage').attr('data-ratio') );
	
	if( $('#stage').attr('data-ratio') ) {

		if ( w0*r0 < h0 ) {
			$('#stage').height( w0 * r0             );
			$('#stage').width ( w0                  );
			$('#stage').css   ( 'top', (h0-w0*r0)/2 );
			$('#stage').css   ( 'left', 0           );
		} else {
			$('#stage').height( h0                   );
			$('#stage').width ( h0 / r0              );
			$('#stage').css   ( 'top', 0             );
			$('#stage').css   ( 'left', (w0-h0/r0)/2 );			
		};
	};
}


// ====================================================================================
// SLIDE ASPECT RATIO

function vidPoster(id) {
	var vid = $(id)
	setTimeout( function(){
		if( !(vid[0].currentTime) || !(vid[0].buffered.length) ){
			vid.attr('poster','images/preload.png')
		}
	},2500)
}


// ====================================================================================
// ====================================================================================


$(document).ready(function() {

	// ================================================================================
    // WARNNGS

	if( jQuery.browser.webkit || jQuery.browser.safari || jQuery.browser.chrome ) {
		$('#info_warning').hide();
	} else {
		$('#info_warning .infobox_wrapper').html('<h1>Warning: Unsupported Browser</h1><p>This slideshow is best viewed on webkit browsers like the free '
		   +'<a href="https://www.google.com/chrome/">Google Chrome</a>. Click anywhere to continue in your current browser.</p>');
	}


	// ================================================================================
    // INITIAL SETUP	
	
	if ( window.location.hash ) {
		var hash = window.location.hash.replace('#','');
	} else {
		var hash = '';
	}
	
	if( hash != "" && hash != 0 && hash <= max_sld ) {
		var ini = hash;
	    n_slide = Number(hash);
	} else {
		var ini = 0;
	};
	
	var s_first = $('#stage').children('section:eq('+ini+')');
	$('#slidenumber').html(ini);
	if( s_first.attr('data-title') ) {
		$('#slidetitle' ).html(': ' + s_first.attr('data-title') );
	}

	$('#stage').children('section:eq('+ini+')').addClass('active');
	$('#notes_box').html( $('#stage').children('section:eq('+ini+')').children('.pnotes:eq('+ini+')').html() );
	updateSlide(ini,0,1000);
	
	$('#notes').height( $('#notes_box').height() + 12 );
	$('#pbar').addClass('shadow');
	$('#t_text').addClass('on');
	pnotes = 1;


	for (ix=1; ix<10; ix++) { $( "#helper" ).attr('src','images/lense/l'+ix+'.png') }; // preload lense flare images
	

	// ================================================================================
    // RESIZING OF WINDOW

	aspectRatio();
	$(window).resize( function(){ aspectRatio() });
	
	
	// ================================================================================
    // NAVIGATION SLIDER
	
	$( "#pbar_slider" ).slider({
		value:ini,
		min: 0,
		max: max_sld,
		step: 1,
		animate: true,
   		create: function(event, ui) {
			$('#pbar_slider a').html('<div id="pbar_preview"><img id="pbar_img" width="124" height="70" src=""></div><div id="pbar_arrow"></div>');
			for (ix=max_sld; ix>=0; ix--) { $( "#pbar_img" ).attr('src',prevs+'slide'+ix+'.jpg') }; // preload preview images
			$( "#pbar_img" ).attr('src',prevs+'slide'+ini+'.jpg')
		},
   		start: function(event, ui) {
			$('#pbar_preview, #pbar_arrow').fadeIn(400);
		},
		slide: function( event, ui ) {
			$( "#pbar_img" ).attr('src',prevs+'slide'+ui.value+'.jpg')
		},
   		stop: function(event, ui) {
			$('#pbar_preview, #pbar_arrow').fadeOut(400);
			goTo(ui.value);
		}
	});
	/*$( "#pinp_slider" ).val( "$" + $( "#pbar_slider" ).slider( "value" ) );*/
	
	
	// ================================================================================
    // FADE HEADER AND FOOTER
	
	t = setTimeout( function() { $('header, #pbar').addClass('off'); }, 2500 );

	$('html, body'    ).click( function() { showToolbar() })
	$('header, footer').hover(
		function() { $('header, #pbar').removeClass('off'); clearTimeout(t); },
		function() { t = setTimeout( function() { $('header, #pbar').addClass('off'); }, 2500 ); }
	);


	// ================================================================================
    // TOOL BUTTONS

	$('#t_text').click( function(){
		if( pnotes == 1 ) {
			$('#notes').height(0);
			$('#pbar').removeClass('shadow');
			$('#t_text').removeClass('on');
			pnotes = 0;
		} else {
			$('#notes').height( $('#notes_box').height() + 12 );
			$('#pbar').addClass('shadow');
			$('#t_text').addClass('on');
			pnotes = 1;
		}
	});

	$('#t_start').click( function(){ goTo(0)       });
	$('#t_back' ).click( function(){ goBack()      });
	$('#t_next' ).click( function(){ goNext()      });
	$('#t_end'  ).click( function(){ goTo(max_sld) });

	$('#t_sound').click( function(){
		sound = 1-sound;
		if( sound == 1 ) {
			$('#t_sound').removeClass('off');
			$('#stage').children('section:eq('+n_slide+')').children('.saudio')[n_step].play();
		} else {
			$('#t_sound').addClass('off');	
			$('.saudio').each( function() {
				this.pause();
				try{ this.currentTime = 0; } catch(e) {}
			});		
		}
	});

	$('#t_help').click( function(){ 
		if( help==0 && share==0 ) {
			$('#info_help').fadeIn(500);
			help=1;
		} else if ( share==1 ) {
			$('#info_share').fadeOut(500);
			setTimeout( function() { $('#info_help').fadeIn(500); }, 500 );
			share=0;
			help=1;
		}
	});

	$('#t_share').click( function(){ 
		if( help==0 && share==0 ) {
			$('#info_share').fadeIn(500);
			share=1;
		} else if ( help==1 ) {
			$('#info_help').fadeOut(500);
			setTimeout( function() { $('#info_share').fadeIn(500); }, 500 );
			help=0;
			share=1;
		}
	});

	$('.lbclose, #stage').click( function(){ 
		$('.infobox').fadeOut(500);
		help =0;
		share=0;
	});


	$('video audio').click( function() {
		alert(this.paused);
		var med = this;
		if( med.paused ) {
			med.play();
		} else {
			med.pause();
		}
	});

	// ================================================================================
    // KEYBOARD SHORTCUTS

	$('html').keydown(function(event) {
		if ( event.which == 13 /*ENTER*/ || event.which == 32 /*SPACE*/ || event.which == 39 /*RIGHT ARROW*/ || event.which == 40 /*DOWN ARROW*/ ) {
			event.preventDefault();
			goNext();
		} else if ( event.which == 8 /*BACKSPACE*/ || event.which == 37 /*LEFT ARROW*/ || event.which == 38 /*UP ARROW*/ ) {
			event.preventDefault();
			goBack();
		} else if ( event.which == 9 /*TAB*/ || event.which == 34 /*PAGE DOWN*/ ) {
			event.preventDefault();
			goTo(n_slide+1);
		} else if ( event.which == 33 /*PAGE UP*/ ) {
			event.preventDefault();
			goTo(n_slide-1);
		}
	});

});