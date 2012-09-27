// ====================================================================================
//  MATHIGON SLIDESHOWS SCRIPT
//
//  (c) Mathigon / Philipp Legner
//  info@mathigon.org
//  Not to be copied or edited without permission
// ====================================================================================


// ====================================================================================
// VARIABLES SETUP

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
var Xaudio
var t = setTimeout( function(){}, 0)


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
				touchCancel(event);
			}	
		} else {
			touchCancel(event);
		}
	}

	function touchCancel(event) {
		// reset the variables back to default values
		showToolbar();
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
		// REPLACE WITH YOUR ROUTINES
	} else if ( swipeDirection == 'down' ) {
		// REPLACE WITH YOUR ROUTINES
	}
}


// ====================================================================================
// SLIDE TRANSITIONS

function goTo(m) { if (m != n_slide &&  m >= 0 && m <= max_sld) {

	s_old = $('#stage').children('section:eq('+n_slide+')');
	s_new = $('#stage').children('section:eq('+m+')');

	/* FIX OLD SLIDE TO ORIGINAL POSITION */

    transit = s_old.attr('data-transition') || '';
    durat   = Number(s_old.attr('data-duration'  ) || 0);
    title   = s_old.attr('data-title') || '';

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
		case 'via':
  			$('#stage').css('background-color',(s_old.attr('data-viacolor') || '#000'));
			s_old.fadeOut( durat/2 );
			setTimeout( function() { s_new.fadeIn( durat/2 ) }, durat/2 );
			break;
		case 'slideleft':
  			s_new.css('display','block').css('left','100%').animate({'left':'0%'},durat);
			s_old.animate({'left':'-100%'},durat)
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat+5 );
			break;
		case 'slideright': // + top,bottom
  			s_new.css('display','block').css('left','-100%').animate({'left':'0%'},durat);
			s_old.animate({'left':'100%'},durat)
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat+5 );
			break;
		case 'coverleft': // + right, top, bottom
			s_old.css('z-index','0' );
  			s_new.css({'z-index':'10', 'display':'block', 'left':'100%'}).animate({'left':'0%'},durat);
			setTimeout( function() { s_old.css({'display':'none','left':'0'}); }, durat );
			break;
		case 'revealleft': //+ left, right, top, bottom
  			s_new.css('display','block');
			s_old.css('display','none' );
			break;
		case 'wipehorizontal': //+ vertical
  			s_new.show( 'blind', {}, durat, function() { s_old.css('display','none' ); } )
			break;
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

	setTimeout( function() {
		updateSlide(m,0);
	}, durat);

	pbar.setStep( m+1 );

	$('.infobox').fadeOut(500);
	help =0;
	share=0;

	n_slide = m;
	n_step  = 0;
}}


// ====================================================================================
// OBJECT TRANSITIONS

//THIS NEEDS MUCH MORE WORK!


// ====================================================================================
// SLIDE STEPS

function updateSlide(sld,stp) {                                                                                // INITIATE IMMEDIATELY, NOT USING setTimeout ABOVE
	
	                                                                                                                       // RUN NORMAL FUNCTION!!
	
	if(sound) {
		Xaudio = $('#stage').children('section:eq('+sld+')').children('.saudio');
		 if( Xaudio[stp] ) { Xaudio[stp].play(); }
	}

	if(pnotes) {
		$('#notes'    ).height( $('#notes').height() );
		$('#notes_box').addClass('off');
		setTimeout ( function() {
			$('#notes_box').html( $('#stage').children('section:eq('+sld+')').children('.pnotes:eq('+stp+')').html() || '' );
			$('#notes_box').removeClass('off');
			$('#notes'    ).height( $('#notes_box').height() + 12 );
			/*setTimeout ( function() { $('#notes').css('height','auto'); }, 205);*/
		}, 205);
	} else {
		$('#notes_box').html( $('#stage').children('section:eq('+sld+')').children('.pnotes:eq('+stp+')').html() || '' );
	}
}

function goNext() {
	
	// Check whether to move on to next slide
	if(eval( "typeof xSteps" + n_slide + " == 'function' " )) {
		max_stp = eval( "xSteps" + n_slide +"('max')" );
	} else {
		max_stp = 0;
	}

	// Halt all audio
	$('.saudio').each( function() {
		this.pause();
		/*this.currentTime = 0;*/                                                                                                 // AUDIO TIMING
	});

	// Load Next Slide
	if( n_step < max_stp ) {
		n_step++;
		updateSlide(n_slide,n_step);
	} else {
		goTo(n_slide+1);
	}
}

function goBack() {
	// Halt all audio
	$('.saudio').each( function() {
		this.pause();
		/*this.currentTime = 0;*/                                                                                                 // AUDIO TIMING
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
	
	var s_first = $('#stage').children('section:eq(0)');
	if( s_first.attr('data-title') ) {
		$('#slidetitle' ).html(': ' + s_first.attr('data-title') );
	}

	$('#stage').children('section:eq(0)').addClass('active');
	$('#notes_box').html( $('#stage').children('section:eq(0)').children('.pnotes:eq(0)').html() );
	updateSlide(0,0);
	

	// ================================================================================
    // RESIZING OF WINDOW

	aspectRatio();
	$(window).resize( function(){ aspectRatio() });
	
	
	// ================================================================================
    // DRAGDEALER
	
	pbar = new Dragdealer('pbar_slider', {
		/* slide: **, */
		/* loose: **, */
		/* slide: **, */                                                                                                      // DRAGDEALER OPTIONS
		/* snap: true, */
		steps: max_sld,
		speed: 50,
		callback: function(x,y) {
			goTo( max_sld*x );
		},
		animationCallback: function(x,y) {
			/* ON DRAG */                                                                                                      //DRAGDEALER ONDRAG
		}
	});
	
	
	// ================================================================================
    // FADE HEADER AND FOOTER
	
	t = setTimeout( function() { $('header, #pbar').addClass('off'); }, 3000 );

	$('html, body'    ).click( function() { showToolbar() })
	$('header, footer').hover( function() { showToolbar() });


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

	$('#t_start').click( function(){ goTo(1)       });
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
				/*this.currentTime = 0;*/                                                                                                 // AUDIO TIMING
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