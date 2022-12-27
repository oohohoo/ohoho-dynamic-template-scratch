// v.2022 

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
//gsap.registerPlugin(Observer);

CustomEase.create("hop", "0.5, 0, .0, 1");
//CustomEase.create("hop", ".075, .82, .165, 1");



let locoScroll;
var swiper;  

/*TURN OFF GSAP MESSAGES*/
gsap.config({ nullTargetWarn: false });

/*
================================================================================
PRELOADER
================================================================================
*/

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

const loader = select('.loader');
const loaderInner = select('.inner-loader');
const progressBar = select('.progress');
const loaderMask = select('.loader__mask');

/*
================================================================================
IMAGES LOADED 
================================================================================
*/

function init() {
  // show loader on page load
  gsap.set(loader, {autoAlpha: 1});
  // scale loader down
  gsap.set(loaderInner, {scaleY: 0.015, transformOrigin: 'bottom'});
  // make a tween that scales the loader
  const progressTween = gsap.to(progressBar, {paused: true, scaleX: 0, ease: 'none', transformOrigin: 'right'});
  // setup variables
  let loadedImageCount = 0,
    imageCount;
  const container = select('#main');
  // setup Images loaded
  const imgLoad = imagesLoaded(container);
  imageCount = imgLoad.images.length;
  // set the initial progress to 0
  updateProgress(0);
  // triggered after each item is loaded
  imgLoad.on('progress', function () {
    // increase the number of loaded images
    loadedImageCount++;
    // update progress
    updateProgress(loadedImageCount);
  });

  // update the progress of our progressBar tween
  function updateProgress(value) {
    // console.log(value/imageCount)
    // tween progress bar tween to the right value
    gsap.to(progressTween, {
      progress: value / imageCount,
      duration: 0.3,
      ease: 'power1.out'
    })
  }

  // do whatever you want when all images are loaded
  imgLoad.on('done', function (instance) {
    // we will simply init our loader animation onComplete
    gsap.set(progressBar, {
      autoAlpha: 0,
      onComplete: initPageTransitions
    });
  });

}

init();

/*
================================================================================
MAIN JS + LOCOMOTIVE SCROLL + SCROLL TRIGGER PROXY
================================================================================
*/
function initScroll(container) {

  if (document.querySelector('.smooth-scroll')) {
		locoScroll = new LocomotiveScroll({
			el: document.querySelector(".smooth-scroll"),
			smooth: true,
			getDirection: true,
			scrollFromAnywhere: true,
			//touchMultiplier: 3.0,
			useKeyboard: true,
			inertia: 0.6,
    //  reloadOnContextChange: true,
			smartphone: {
				//breakpoint: 0,
				smooth: false,
			//	getDirection: true,
			},
			tablet: {
				//  breakpoint: 0,
			//	touchMultiplier: 2,
				smooth: false,
			//	getDirection: true,
			},
		});

		// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
		locoScroll.on("scroll", ScrollTrigger.update);

		// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
		ScrollTrigger.scrollerProxy(".smooth-scroll", {
			scrollTop(value) {
				return arguments.length
					? locoScroll.scrollTo(value, 0, 0)
					: locoScroll.scroll.instance.scroll.y;
			}, // we don't have to define a scrollLeft because we're only scrolling vertically.
			getBoundingClientRect() {
				return {
					top: 0,
					left: 0,
					width: window.innerWidth,
					height: window.innerHeight,
				};
			},

			// LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters,
			// we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
			// UKLJUČITI SAMO NA MOBILNOJ VERZIJI
			pinType: document.querySelector(".smooth-scroll").style.transform
				? "transform"
				: "fixed",
		});

/*
================================================================================
ON WINDOW RESIZE
================================================================================
*/
		
window.addEventListener('resize', function(){
  setTimeout(()=>{
    if (document.querySelector('.smooth-scroll')) {
  locoScroll.update();
    };
  ScrollTrigger.refresh();
},200) 

/*
================================================================================
RELOAD SITE WHEN RESIZE AND CHANGE FROM DESKTOP TO MOBILE AND VICE VERSA
================================================================================
*/

const desktop = window.matchMedia('screen and (min-width: 991px)');
const mobile = window.matchMedia('screen and (max-width: 991px)');

desktop.addListener(function(e) {
   if (e.matches) {
      location.reload();
   }
});

mobile.addListener(function(e) {
   if (e.matches) {
      location.reload();
   }
});



 /* console.log("RESIZE & REFRESHHHH LOCO & SCROLL+CROLL ON OFF / CONTACT"); */
});



/* window.addEventListener('DOMContentLoaded', (event) => {
  locoScroll.start();
});
 */



/*
================================================================================
LOCOMOTIVE SCROLL REFRESH AFTER ALL / ne briši
================================================================================
*/
		//if($('.smooth-scroll').length >0 ){
		// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
		//ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
		// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
		ScrollTrigger.refresh();
		/* console.log("SCROLL REFRESH 2"); */

		/*   document.addEventListener('load', function(){
    locoScroll.update();
}); */
		//}
		/*
================================================================================
LOCOMOTIVE SCROLL UPDATED AFTER IMAGESLOADED
================================================================================
*/

		imagesLoaded("#main", { background: true }, function () {
			locoScroll.update();
		/* 	console.log("LOCO SCROLL UPDATE AFTER IMAGES LOADED ALL IMAGES"); */
		});
	}

}

/*
================================================================================
PRELOADER --> vodi na --> INIT CONTENT
================================================================================
*/
function initLoader() {

  const tlLoaderIn = gsap.timeline({
    id: 'tlLoaderIn',
    defaults: {duration: 0.6, ease: "power1"},
    onComplete: () => initContent()
  });

  const lines = selectAll('.loader__title--mask');
  const loaderContent = select('.loader__content');
const loader = select('.loader');
const loaderInner = select('.inner-loader');
/* const progress = select('.progress'); */


  tlLoaderIn

    .set(loaderContent, {autoAlpha: 1})
   /*  .set(".h-red-flag", {yPercent: -100}) */
    .set(".logo-top, .logo-bottom, .loader-text", {yPercent: 100})
   
    
    //.set(".main", {y: 150})

     .to(loaderInner, {scaleY:1, duration: 1, ease: 'hop', transformOrigin: 'bottom'}, 0) 
     .to(".logo-top", {yPercent:0}, 0.4)
     .to(".logo-bottom", {yPercent:0}, 0.4)
     .to(".loader-text", {yPercent:0}, 0.4)
     .addLabel('revealImage')

    /*  .to(".h-red-flag", {yPercent:0, duration: 0.5, rotate:360}, "revealImage+=0.5") */



  // LOADER OUT
  const tlLoaderOut = gsap.timeline({
    id: 'tlLoaderOut',
    defaults: {duration: 1.2, ease: 'hop'}, delay: 0});

  tlLoaderOut
  
  .to(loaderInner, {scaleY:0, duration: 1.25, transformOrigin: 'top'})

    .to([loader, loaderContent], {yPercent: -100}, 0)
   .to(".hamby", {autoAlpha:1, stagger: 0.12, ease: "expo.inOut"}, "<")
    //.to(".h-red-flag", { yPercent:-100, duration: 1, ease:'expo.inOut'}, "<0.25")

    
   // .to('.main', {y: 0}, 0);

  const tlLoader = gsap.timeline();
  tlLoader
    .add(tlLoaderIn)
    .add(tlLoaderOut);
}





/*
================================================================================
INIT CONTENT --> vodi na --> INIT SCROLL
================================================================================
*/
function initContent() {
	select("body").classList.remove("is-loading");

	// your custom script
	var myscripts = {
		init: function () {
			if ($("body").hasClass("page-home")) {
				this.home();
			} else if ($("body").hasClass("page-products")) {
				this.products();
			} else if ($("body").hasClass("page-howwework")) {
				this.howwework();
			} else if ($("body").hasClass("page-product-single")) {
				this.pageproductsingle();
			} else if ($("body").hasClass("page-contact")) {
				this.contact();
			} else if ($("body").hasClass("page-faq")) {
				this.faq();
      } else if ($("body").hasClass("success")) {
				this.success();
			}
		},
		home: function () {
    //loadfunction();
		},
		products: function () {
      //loadfunction();

		
		},
		howwework: function () {
     // loadfunction();
		},
		pageproductsingle: function () {
     // loadfunction();
		},
		contact: function () {
     // loadfunction();
		},
		faq: function () {
     // loadfunction();
		},
    success: function () {
     // success();
    
    /*   console.log("Success loaded"); */
		},
	};

	// LOAD THIS SCRIPTS ON EVERY PAGE
	initScroll();
 //fullscreenMenu();

   //vhFix(); 

	myscripts.init();

	setTimeout(() => {
		ScrollTrigger.refresh(true);
	}, 1000);
/* 	console.log("SCROLL TRIGGER REFRESHED AFTER 1 SECOND"); */
}

/*
================================================================================
BARBA PAGE TRANSITION IN
================================================================================
*/




function pageTransitionIn({
  container
}) {
  /* console.log('pageTransitionIn'); */
  // timeline to stretch the loader over the whole screen
  const tl = gsap.timeline({defaults: {duration: 0.85, ease: 'hop'} });
  tl
    .set(loaderInner, {autoAlpha: 0})
    .fromTo(loader, {yPercent: 100}, {yPercent: 0})
    .fromTo(loaderMask, {yPercent: 80}, {yPercent: 0}, 0)
   // .to(container, {y: 150}, 0);

  return tl;
}

/*
================================================================================
BARBA PAGE TRANSITION OUT
================================================================================
*/
function pageTransitionOut({
  container
}) {
/*   console.log('pageTransitionOut'); */
  // timeline to move loader away down
  const tl = gsap.timeline({defaults: {duration: 0.85,ease: 'hop'},
  // OVDJE SE INICIRA PONOVO SAV JS CONTENT / AKO ZATREBA
    onComplete: () => initContent()
  });
  tl
    .to(loader, {yPercent: -100})
    .to(loaderMask, {yPercent: -80}, 0)
   // .from(container, {y: -150}, 0);
  return tl;
}


/*
================================================================================
BARBA PAGE TRANSITION IN 2
================================================================================
*/

function pageFadeIn({
  container
}) {
  // timeline to stretch the loader over the whole screen
  const tl = gsap.timeline({defaults: {duration: 0.85, ease: 'hop'}});
  tl
    .to(container, {autoAlpha:0}, 0);
  return tl;
}

/*
================================================================================
BARBA PAGE TRANSITION OUT 2
================================================================================
*/
function pageFadeOut({
  container
}) {
  // timeline to move loader away down
  const tl = gsap.timeline({defaults: {duration: 0.85, ease: 'hop'},
    // OVDJE SE INICIRA PONOVO SAV JS CONTENT / AKO ZATREBA
    onComplete: () => initContent()
  });
  tl
    .from(container, {autoAlpha:0}, 0);
  return tl;
}


/*
================================================================================
BARBA GLOBAL HOOKS + PREFETCH + INIT + VIEWS + TRANSITIONS
================================================================================
*/
function initPageTransitions() {
   // do something before the transition starts
   barba.hooks.once(() => {
  });

  // do something before the transition starts
  barba.hooks.before(() => {
    select('html').classList.add('is-transitioning');
  });

   // do something before the transition starts
   barba.hooks.beforeEnter(() => {
    gsap.set(".header-new", { autoAlpha: 1}, 0); 
  });

  // do something after the transition finishes
  barba.hooks.after(() => {
    select('html').classList.remove('is-transitioning');
  });

barba.hooks.afterLeave((data) => {

/* UGAŠENO JER GLITCHA */
// Set <body> classes for "next" page
  var nextHtml = data.next.html;
  var response = nextHtml.replace(/(<\/?)body( .+?)?>/gi, '$1notbody$2>', nextHtml)
  var bodyClasses = $(response).filter('notbody').attr('class')
  $("body").attr("class", bodyClasses);
  


});

 // scroll to the top of the pagePß

  barba.hooks.enter(() => {
        window.scrollTo(0, 0);
   
  });
   //kill locomotive
  barba.hooks.beforeLeave(() => {
    setTimeout(() => {
 		if ($(".smooth-scroll").length > 0) {
			locoScroll.destroy();
			//  console.log("LOCO DESTROY"); 
		}
    
		// kill scrolltrigger
     
		if (ScrollTrigger.getAll().length > 0) {
			ScrollTrigger.getAll().forEach((trigger) => {
				trigger.kill();
				 console.log("SCROLLTRIGGER DESTROY"); 
			});
		}
 

		// kill SWIPER
   
		if (document.querySelector(".swiper-container")) {
			const swiper = new Swiper(".swiper-container", {});
			swiper.destroy();
			console.log("SWIPER KILLED WITH DELAAAAAAAY!");
		}
  }, 400);
		// kill webflow
		/* Webflow.destroy();
console.log("WEBFLOW DESTROY"); */
	});
  //init scrolltrigger
   barba.hooks.afterEnter(() => {
    
/* AUTOPLAY VIDEOS*/
    var vids = document.querySelectorAll("video"); vids.forEach(vid => { var playPromise = vid.play(); if (playPromise !== undefined) { playPromise.then(_ => {}).catch(error => {}); }; });
   // console.log("možda ode učitat locoscroll");
// SAKRIJ MENI PRIJE ULASKA
   gsap.set(".xnav", {scaleY: 0})
  /*  console.log("--------MENU X SCALE"); */



   });


/*
================================================================================
BARBA PREFETCH
================================================================================
*/

barba.use(barbaPrefetch);

/*


================================================================================
BARBA INIT 
================================================================================
*/

barba.init({
	timeout: 5000,
	debug: true,
	prefetch: true,

	/*
================================================================================
BARBA VIEWS
================================================================================
*/
	views: [
		{
			namespace: "home",
			beforeEnter(data) {
				//homeProductHover();
			},
		},
		{
			namespace: "products",
			beforeEnter(data) {

			},
		},
		{
			namespace: "productsingle",
			beforeEnter(data) {
			//	productsTabs();
			//	fullscreen3D();
			//	productsoloAccordion();
        
			},
      afterLeave(data) {
				           
			},
		},
		{
			namespace: "howwework",
			beforeEnter(data) {
			//	akapowPinned();
			//	logoMarquee();
			},
		},
		{
			namespace: "contact",
			beforeEnter(data) {
			//	webflowInteractions();
			},
			afterEnter() {

			},
		},
		{
			namespace: "faq",
			beforeEnter(data) {
			//	productsoloAccordion();
			},
		},
    {
			namespace: "success",
			beforeEnter(data) {
			//	success();
			},
    },
	],
	/*
================================================================================
BARBA TRANSITIONS
================================================================================
*/

	transitions: [
		{
			// ROUTE AKO IDE NA ABOUT IDE DRUGA ANIMACIJA

			once({ next }) {
				// do something once on the initial page load
				initLoader();
			},

			async leave({ current }) {
				// animate loading screen in
				await pageTransitionIn(current);
				console.log("LEAVE");
			},

      leave: function(data) {
        // hide navbar on page transition
        data.current.container.querySelector('.navbar').style.visibility = 'hidden';
      },
      after: function(data) {
        // show navbar after page transition
        data.next.container.querySelector('.navbar').style.visibility = 'visible';


      },

			enter({ next }) {
				// animate loading screen away
				pageTransitionOut(next);
				console.log("NEXT");
			},

			afterEnter({ next }) {},

			beforeEnter({ next }) {

			},
		},
	],


  
	/*
 ================================================================================
 PREVENT / CLICKS DURRING TRANSITION AND CURRENT LINK + SCROLL TO TOP
 ================================================================================
 */
	prevent: ({ event, href }) => {
		if (event.type === "click") {
			// prevent the user to reload the page if the location is the same
			if (href === window.location.href) {
				event.preventDefault();
				event.stopPropagation();
				// automatically scroll to the top of the page on same location
				//   locoScroll.scrollTo('#top')
				return true;
			}
			if (barba.transitions.isRunning) {
				event.preventDefault();
				event.stopPropagation();

				return true;
			}
		}
	},
});

/*
================================================================================
INIT LOADER
================================================================================
*/

function init() {
  initLoader();
}

}



/*
================================================================================
ACCORDION
================================================================================
*/
function productsoloAccordion() {
	class Accordion {
		constructor(accordion) {
			this.button = accordion.querySelector(".accordion__button");
			this.content = accordion.querySelector(".accordion__content");
			this.icon = accordion.querySelector(".accordion__icon");
			this.line = this.icon.querySelector(".line--scale");
			this.setInitialState();
			this.animation();
			this.eventListener();
		}

		setInitialState() {
			gsap.set(this.content, { height: "auto" });
		}

		animation() {
			this.animation = gsap
				.timeline({
					onReverseComplete: function () {
						locoScroll.update();
					},
				})
				.to(this.icon, { rotate: "90deg", ease: "power3.inOut" })
				.to(this.line, { scaleY: 0, ease: "power3.inOut" }, 0)
				.from(
					this.content,
					{
						height: 0,
						duration: 0.5,
						ease: "power3.inOut",
						onComplete: function () {
							locoScroll.update();
						},
					},
					0
				)
				.reverse();
		}
		eventListener() {
			this.button.addEventListener("click", () => {
				this.animation.reversed
					? this.animation.reversed(!this.animation.reversed())
					: this.animation.reverse();
			});
		}
	}

	const accordions = [...document.querySelectorAll(".accordion")];

	accordions.forEach((accordion) => new Accordion(accordion));
}


/*
================================================================================
FADE IN ON ENTER
================================================================================
*/
function fadeInOnEnter() {
  var mq = window.matchMedia( "(min-width: 991px)" );
  if (mq.matches) { 

	gsap.set(".batch", {
		y: 60,
	});
	ScrollTrigger.batch(".card", {
		scroller: ".smooth-scroll",
		start: "top bottom-=100px",
		onEnter: (batch) => {
			batch.forEach((card, index) =>
				gsap.to(card.children, { y: 0, autoAlpha: 1, duration: 0.75, ease: 'power1', stagger: 0.04 })
			);
		},
		once: true,
	});

 }
else {

}    

}





/*
================================================================================
HEADER HIDE
================================================================================
*/
function headerHide() {
  const showAnim = gsap.from('.header', { 
    yPercent: -100,
    paused: true,
    duration: 0.3,
    ease: "hop"
  }).progress(1);
  
  ScrollTrigger.create({
    trigger: ".navchange",
    scroller: ".smooth-scroll",
    start: "top top",
    end: "+=10000000",
    toggleClass: { targets: ".header, .hamby-line, .w--current", className: "navcolor" },
    onUpdate: (self) => {
      self.direction === -1 ? showAnim.play() : showAnim.reverse()
    }
  });

}

/*
================================================================================
LOCOMOTIVE 4 SCROLL TO TOP
================================================================================
*/

function scrollToTop() {
$( "#tostart" ).on( "click", function() {
  locoScroll.scrollTo( '#startop', {
    'offset': 0,
    'duration': 1500,
    'easing': [0.5, 0, .0, 1],
    'disableLerp': true
  });
});
}


/*
================================================================================
CUBERTO CURSOR
================================================================================
*/
function cubertoCursor() {


var mq = window.matchMedia( "(min-width: 1025px)" );
if (mq.matches) {


setTimeout(() => {

  const xhide = document.querySelector('.my-image');
  const cursor = new MouseFollower({
         el: null,
        container: '.barba-container',
        className: 'mf-cursor',
        innerClassName: 'mf-cursor-inner',
        textClassName: 'mf-cursor-text',
         mediaClassName: 'mf-cursor-media',
        mediaBoxClassName: 'mf-cursor-media-box',
        iconSvgClassName: 'mf-svgsprite',
        iconSvgNamePrefix: '-',
        iconSvgSrc: '',
      dataAttr: 'cursor',
      hiddenState: '-hidden',
      textState: '-text',
      iconState: '-icon',
      activeState: '-active',
      mediaState: '-media',
      stateDetection: {
          '-pointer': 'a,button',
          '-hidden': 'my-image'
      },
      visible: true,
      visibleOnState: false,
      speed: 0.55,
      ease: 'expo.out',
      overwrite: true,
      skewing: 2,
      skewingText: 2,
      skewingIcon: 2,
      skewingMedia: 2,
      skewingDelta: 0.001,
      skewingDeltaMax: 0.15,
      stickDelta: 0.15,
      //showTimeout: 20,
      hideOnLeave: true,
      hideTimeout: 300,
      hideMediaTimeout: 300
     
  });
  
  }, 1000);
 

}
else {
 /*  console.log("CUB MOUSE IS OFF"); */
}    

}
