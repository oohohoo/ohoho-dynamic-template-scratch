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
    logoTransformOnScroll();
      heroPanelAnimation();
			startStopVideo();
			headerHide();
      akapowPinned();
      colorChanger();
		},
		products: function () {
      productsSwiper();
     // heroPanelAnimation();
		
		},
		howwework: function () {
      heroPanelAnimation();
			logoTransformOnScroll();
			headerHide();
			akapowPinned();
			logoMarquee();
			startStopVideo();
		},
		pageproductsingle: function () {
      heroPanelAnimation();
			headerHide();
			logoTransformOnScroll();
			productsTabs();
			swiperSolo();
      sketchFab();
		},
		contact: function () {
      scrollToSlide();
      colorChanger();
      contactMobilePin();
			//huwebflowInteractions();
     // contactScroll();
     
			//  openMobileMenu();
		},
		faq: function () {
			headerHide();
			logoTransformOnScroll();
			// openMobileMenu();
		},
    success: function () {
      success();
    
    /*   console.log("Success loaded"); */
		},
	};

	// LOAD THIS SCRIPTS ON EVERY PAGE
	initScroll();
 fullscreenMenu();
  buttonHoverFromDirection();
	scrollToTop();
	yearUpdate();
	fadeInOnEnter();
	cubertoCursor();
  disableScroll(); 
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
   // initLoader();
    //logoAnimacija();
    //fullscreenMenu();
    //homeProductHover();
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
				homeProductHover();
			},
		},
		{
			namespace: "products",
			beforeEnter(data) {
       // heroPanelAnimation();
			//	productsSwiper();
			},
		},
		{
			namespace: "productsingle",
			beforeEnter(data) {
				productsTabs();
				fullscreen3D();
				productsoloAccordion();
        
			},
      afterLeave(data) {
				           
			},
		},
		{
			namespace: "howwework",
			beforeEnter(data) {
				akapowPinned();
				logoMarquee();
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
				productsoloAccordion();
			},
		},
    {
			namespace: "success",
			beforeEnter(data) {
				success();
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
				await pageFadeIn(current);
				console.log("LEAVE");
			},
			enter({ next }) {
				// animate loading screen away
				pageFadeOut(next);
				console.log("NEXT");
			},

			afterEnter({ next }) {},

			beforeEnter({ next }) {

			},
		},
	],
/*
  name: 'home-about',
      from: { namespace:'products' },
      to: { namespace:'productsingle' },
      leave: function(data) {
       
      // do something 
      pageFadeIn(current);
      console.log("FADE IN");
    },
      enter: function(data) {
        
      // do something 
      pageFadeOut(next);
      console.log("FADE OUT");

      },
    },
    { 


  
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
FULLSCREEN MENU
================================================================================
*/
function fullscreenMenu() {
  // OPEN MENU FROM CLICK
const openmenu = document.getElementById('openmenu');
const closemenu = document.getElementById('closemenux');

new SplitText(".doublesplit", { type: "lines", linesClass: "lineChild" });
new SplitText(".doublesplit", { type: "lines", linesClass: "lineParent" });

// OPEN CLOSE FUNCTION
openmenu.addEventListener("click", () => {
		show();


    locoScroll.stop();

});

closemenu.addEventListener("click", () => {
		hide();
 
    locoScroll.start();

});


// VANJSKI GHOST 
gsap.set(".xnav", {scaleY: 0})
// MENU LINKS 
gsap.set(".lineChild", {yPercent:100})
gsap.set(closemenu, {autoAlpha:0})


// --- SHOW
function show() {
	let tl = gsap.timeline();

  gsap.set(".close-wrap, .hamby", {pointerEvents: "none"});
// VANJSKI GHOST 
tl.to(".xnav", {scaleY: 1, transformOrigin: "bottom center", ease: "hop", duration:0.6}, 0) 

// UNUTARNJI  
    .fromTo(".nav--trans", {scaleY: 0, transformOrigin: "bottom center"},
		{duration: 0.1, scaleY: 1},"<0.01")

    .to(".navdark", {autoAlpha:0}, "<")
      
// IMAGE CLIP
   .fromTo(".clip", {
    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    duration: 2,
  },
  {         
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",  
    ease: "hop", transformOrigin: "bottom center",
    },"<0.2")
   
    //.from(".nav-image", {autoAlpha:1, scale:0.7, transformOrigin: "center center"}, "<0.1")
    
    
// MENU LINKS 
    .to(".lineChild", {autoAlpha:1, duration:0.3, yPercent:0, stagger:0.025}, "<0.1")
// LOGO RESET
   /*  .to(".header-red-flag",  {width:'3rem', height:'3rem', top: '0.5rem', duration: 0.5, ease: "expo.inOut", }, 0) 
    .to("#di", {morphSVG: {shape: "#sq"}, duration: 0.5, ease: "expo.inOut"}, 0)
    .to(".header_znak", { scale: 0.7, duration: 0.5, transformOrigin: 'center center', yPercent: -60, ease:'expo.inOut'}, 0) */

// MENU OPENCLOSE
		.to(openmenu, {autoAlpha:0}, "<")
		.to(closemenu, {autoAlpha:1}, "<1")
   
	
    
   .set(".close-wrap, .hamby", {pointerEvents: "all"}, "<")

}
// --- HIDE
function hide() {
	let tl = gsap.timeline();
  gsap.set(".close-wrap, .hamby", {pointerEvents: "none"});


  // MENU LINKS 
  tl.to(".lineChild", {autoAlpha:1, duration:0.3, yPercent:100, stagger:0.015}, 0)
  //.to(".nav-super", {autoAlpha:0,  stagger:0.01}, "<")
  .fromTo(".clip", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",  
    duration: 2.5,
  },
  {
    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
           
    ease: "hop", transformOrigin: "bottom center"
  }, "<")

  //.to(".close-wrap", {autoAlpha:0})
  /* .to(".fs-nav-item", {autoAlpha:0, duration:0.5,stagger:0.05,  ease: "quart.inOut"}, "<0.1") */
  
 

  // .to(".fs-menu--column", {autoAlpha:0, duration:0.1}, "-=0.1")
   // UNUTARNJI  
   .to(".nav--trans", { duration: 0.1, transformOrigin: "bottom center", scaleY: 0,  }, "-=0.1")
	 // VANJSKI GHOST 	
   .to(".xnav", { duration:0.6, ease: "hop", transformOrigin: "bottom center", scaleY: 0}, "-=0.3") 
   .to(".navdark", {autoAlpha:1}, "<")

   // MENU OPENCLOSE
		.to(openmenu, {autoAlpha:1}, "<")
		.to(closemenu, {autoAlpha:0}, "<")
    .set(" .close-wrap, .hamby", { pointerEvents: "all"});

}


/*
================================================================================
SUBMENU HOVER
================================================================================
*/
// SUBMENU - CHANGE COLOR HOVER / LOOP / ista skripta ko ova poviše ali bez komentara
$(".fade-hover, .hover-opacity, .kupole-info").each(function(i, el) {
  var tl = gsap.timeline({paused: true});
  var t = tl
         .to($(el).find('a'), {opacity:0.6,  duration: 0.15});
el.animation = t;
$(el).on("mouseenter",function(){
    this.animation.play();
  }).on("mouseleave",function(){
    this.animation.reverse();
  });
});


/*
================================================================================
MENU ICON HOVER
================================================================================
*/

/* OPENMENU HOVER ICON*/
openmenu.addEventListener('mouseover', ()=> {  
  let menuhovertimeline = gsap.timeline({defaults:{autoAlpha:1}})
  //animation.paused( true ); 
  menuhovertimeline
  .to(".half", {width: "100%", duration: 0.2, transformOrigin: "center center"})
  //  .to(".mline3", {width: "100%"}, "<-0.05")
  })
  // MENU ICON MOUSEOUT 
  openmenu.addEventListener('mouseout', ()=> {  
  let menuhovertimeline2 = gsap.timeline({defaults:{autoAlpha:1}})
  //animation.paused( true ); 
  menuhovertimeline2
  .to(".half", {width: "50%", duration: 0.2, transformOrigin: "center center"})
  //  .to(".mline3", {width: "55%"}, "<-0.05")
  })

/* CLOSEMENU HOVER ICON */
  closemenu.addEventListener('mouseover', ()=> {  
    let menuhovertimeline3 = gsap.timeline({defaults:{autoAlpha:1}})
    //animation.paused( true ); 
    menuhovertimeline3
    .to(".closex", {scale:0.8, duration: 0.2, transformOrigin:"50% 50%"})
    //  .to(".mline3", {width: "100%"}, "<-0.05")
    })
    // MENU ICON MOUSEOUT 
    closemenu.addEventListener('mouseout', ()=> {  
    let menuhovertimeline4 = gsap.timeline({defaults:{autoAlpha:1}})
    //animation.paused( true ); 
    menuhovertimeline4
    .to(".closex", {scale:1, duration: 0.2, transformOrigin:"50% 50%"})
    //  .to(".mline3", {width: "55%"}, "<-0.05")
    })
}

/*
================================================================================
FULLSCREEN 3D
================================================================================
*/
function fullscreen3D() {
 
  // OPEN MENU FROM CLICK
/* const openmenu = document.getElementById('open3d');
const closemenu = document.getElementById('close3d'); */


//const menuhover = document.getElementById('menuhover');


/* NO SCROLL WHEN FS NAV OPEN */

window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
});



/* const { gsap } = window; */

//const threedback = document.getElementById('threedback');

const threedback = document.querySelector(".fsthreed");
const openbutt = document.querySelector(".opentd");
openbutt.addEventListener("click", () => {
	//	openbutt.classList.add("active");
    locoScroll.stop();

    /* MOBILE*/
    const showDialog = () => {
      document.getElementById('dialog').classList.add('show')
      const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
      const body = document.body;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}`;
    };



		show();
    

});

const closeclose = document.getElementById('closeclose');
closeclose.addEventListener("click", () => {
//	openbutt.classList.remove("active");
  locoScroll.start();


  const closeDialog = () => {
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    document.getElementById('dialog').classList.remove('show');
  }


		hide();

  //  api.stop();

});


// VANJSKI GHOST 
gsap.set(threedback, {scaleY: 0,  zIndex:0})
// MENU LINKS 
//gsap.set(".lineChild", {yPercent:100})
gsap.set(closeclose, {autoAlpha:0})
gsap.set(".iframe-wrapper", {display:"none"})


/*  gsap.set(".fs-menu--column", {yPercent:-100})  */
 //gsap.set(".fs-menu-header", {yPercent:-110})

 //gsap.set(".close, .fs-nav-item, .sublink-wrapper, .fadein", {autoAlpha:0})

 //gsap.set(".line-wrapper", {yPercent:100})


// --- SHOW
function show() {
	let tl = gsap.timeline();

 // gsap.set([openbutt, closeclose], {pointerEvents: "none"}, 0);
gsap.set(".iframe-wrapper", {display:"block"})

  tl.to(threedback, {scaleY: 1,  zIndex:4, transformOrigin: "bottom center", ease: "hop", duration:0.6}, 0) 
  // UNUTARNJI  
      .fromTo(".threed--trans", {scaleY: 0, transformOrigin: "bottom center"},
          {duration: 0.1, scaleY: 1},"<0.01")
  
    //  .to(".navdark", {autoAlpha:0}, "<")

          
  // IMAGE CLIP
     .fromTo(".clip", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      duration: 2,
    },
    {         
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",  
      ease: "hop", transformOrigin: "bottom center",
      },"-=0.3")
     

/* 	tl.fromTo(".nav-wrapper2", {height: "0%", transformOrigin: "top center"}, {duration: 0.1, height: "100%"})
    .to(".fs-menu--column", {yPercent:0, duration:0.8, ease: "power2.inOut"}, "<")
    .to(".fs-menu-header", {yPercent:0, duration:0.8, ease: "power2.out"}, "<0.2") */
   
   // .to(".fs-nav-item", {autoAlpha:1, duration:0.5,stagger:0.1,  ease: "power2.inOut"}, "<0.1")
   // .to(".fadein", {autoAlpha:1, duration:0.6, ease: "power2.inOut"}, "<0.1")


	//.to(openbutt, {autoAlpha:0}, "<")
	.to(closeclose, {autoAlpha:1}, "<")
    
		//.to(".line-wrapper", {yPercent:30, stagger:0.1, duration:0.4, ease: "power1.inOut"}, "<0.1")
	//	.from(".nav-wrap", {yPercent:100, stagger:0.05, opacity:0, duration:0.4, ease: "power1.inOut"}, "<0.1")
		//.from(".wg-element-wrapper", {opacity:0, duration:0.3}, "<0.1")
    
    .set([openbutt, closeclose], {pointerEvents: "all"}, "<")
    //.set(".iframe-wrapper", {display:"none"}, "<")
    
}
// --- HIDE
function hide() {
	let tl = gsap.timeline();

// gsap.set([openbutt, closeclose], {pointerEvents: "none"});
//gsap.set(".iframe-wrapper", {display:"block"}, 0)

  tl.fromTo(".clip", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",  
    duration: 2.5,
  },
  {
    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
           
    ease: "hop", transformOrigin: "bottom center"
  }, "<")

.to(".threed--trans", { duration: 0.1, transformOrigin: "bottom center", scaleY: 0}, "-=0.1")
  // VANJSKI GHOST 	
.to(threedback, {  zIndex:4, duration:0.5, ease: "hop", transformOrigin: "bottom center", scaleY: 0}, "<") 
.to(threedback, { zIndex:0}) 



//.to(".navdark", {autoAlpha:1}, "<")

.to(openbutt, {autoAlpha:1}, "<")
		.to(closeclose, {autoAlpha:0}, 0)
    .set([openbutt, closeclose], { pointerEvents: "all"});
    
		/* tl.fromTo(".fs-menu--column", {yPercent:0}, {yPercent:-100, duration:0.6, stagger:0.05, ease: "power2.inOut"})
		.to(".nav-wrapper2", { duration: 0.1, transformOrigin: "top center", height: "0%"})
		
     */
	
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
HOME - LOGO TRANSFORM ON SCROLL
================================================================================
*/
function logoTransformOnScroll() {

  const first = "M0.768555 -0.237793H98.7686V134.762H49.7686H0.768555V-0.237793Z";
  const second = "M0.0498047 -0.237793H98.0498V134.762L49.0498 109.907L0.0498047 134.762V-0.237793Z";
  var start = document.getElementById("start");
var switchlogobig = document.querySelector(".hamby");
var switchlogosmall = document.querySelector(".close-wrap");

  
  
var mq = window.matchMedia( "(max-width: 479px)" );
if (mq.matches) {
// MOBILE
  var show =1;
  var doSwitch = function(shape, show){
    var TL1 = gsap.timeline({ defaults: {duration: 0.5, overwrite: 'auto', force3D:false, ease: "hop"} })
    .to('#switch', {autoAlpha: show},0 )
    .to('#start', {morphSVG:shape},0 )
    .to(".header_znak", { scale: 0.7, yPercent: -34, transformOrigin: 'center center'}, 0) 
  .to(".h-red-flag",  {width:'3rem', height:'3rem', top: '0.6rem'}, 0) 
  .to(".text-block",  {yPercent:30, autoAlpha:0}, 0) 
  
    
    return TL1;
  
  }
  var doSwitchOut = function(shape, show){
    var TL2 = gsap.timeline({ defaults: {duration: 0.5, overwrite: 'auto', force3D:false, ease: "hop"} })
    .to('#switch', {autoAlpha: show},0 )
    .to('#start', {morphSVG:shape},0)
     .to(".header_znak", { scale: 1, yPercent: 0, transformOrigin: 'center center'}, 0) 
   .to(".h-red-flag",  {width:'5.8rem', height:'8rem', top: '0rem'}, 0) 
   .to(".text-block",  {yPercent:0, autoAlpha:1}, 0)
  
    return TL2;
  
  }
  
  const ST = ScrollTrigger.create ({
    //animation: TL1,
    scroller: ".smooth-scroll",
    trigger: "#logotrig",
    start: "top top",
    end: "+=10000000",
    // toggleActions: "play none none reverse"
    onEnter: () => doSwitch(first, 1),
    onLeaveBack: () => doSwitchOut(start, 0),
  });
  // switch on every click ======
  var timesClicked = 2;

  switchlogobig.onclick = function() {
    if (timesClicked%2==0) {
      doSwitch(second, 1); 
     /*  console.log("Clicked OPEN"); */
    } else {
     doSwitchOut(second, 1);
    /*  console.log("Played OPEN ELSE"); */
    }
    timesClicked++;
  };  

 switchlogosmall.onclick = function() {
    if (timesClicked%2==0) {
      doSwitch(second, 1);
    /*   console.log("Clicked CLOSED"); */
    } else {
      doSwitchOut(second, 1);
     /*  console.log("Played CLOSED ELSE"); */
    }
    timesClicked++;
  };  
 
}
else {
// DESKTOP

var show =1;
var doSwitch = function(shape, show){
  var TL1 = gsap.timeline({ defaults: {duration: 0.5, overwrite: 'auto', force3D:false, ease: "expo.inOut"} })
  .to('#switch', {autoAlpha: show},0 )
  .to('#start', {morphSVG:shape},0 )
  .to(".header_znak", { scale: 0.7, yPercent: -36, transformOrigin: 'center center'}, 0) 
.to(".h-red-flag",  {width:'3rem', height:'3rem', top: '0.5rem'}, 0) 
.to(".text-block",  {yPercent:30, autoAlpha:0}, 0) 

  
  return TL1;

}
var doSwitchOut = function(shape, show){
  var TL2 = gsap.timeline({ defaults: {duration: 0.5, overwrite: 'auto', force3D:false, ease: "expo.inOut"} })
  .to('#switch', {autoAlpha: show},0 )
  .to('#start', {morphSVG:shape},0)
   .to(".header_znak", { scale: 1, yPercent: 0, transformOrigin: 'center center'}, 0) 
 .to(".h-red-flag",  {width:'6rem', height:'9rem', top: '0rem'}, 0) 
 .to(".text-block",  {yPercent:0, autoAlpha:1}, 0)

  return TL2;

}

const ST = ScrollTrigger.create ({
  //animation: TL1,
  scroller: ".smooth-scroll",
  trigger: "#logotrig",
  start: "top top",
  end: "+=10000000",
  // toggleActions: "play none none reverse"
  onEnter: () => doSwitch(first, 1),
  onLeaveBack: () => doSwitchOut(start, 0),
});
// switch on every click ======
var timesClicked = 2;

switchlogobig.onclick = function() {
  if (timesClicked%2==0) {
    doSwitch(second, 1); 
  /*   console.log("Clicked OPEN"); */
  } else {
   doSwitchOut(second, 1);
   /* console.log("Played OPEN ELSE"); */
  }
  timesClicked++;
};  

switchlogosmall.onclick = function() {
  if (timesClicked%2==0) {
    doSwitch(second, 1);
/*     console.log("Clicked CLOSED");
 */  } else {
    doSwitchOut(second, 1);
/*     console.log("Played CLOSED ELSE");
 */  }
  timesClicked++;
};  



}   






 
/*   gsap.timeline({
    scrollTrigger: {
      scroller: ".smooth-scroll",
        trigger: "#start",
        start: "top top", // when the top of the trigger hits the top of the viewport
        end: "+=10000000", // end after scrolling 500px beyond the start
        toggleActions: 'play reverse play reverse',
        invalidateOnRefresh: true,
        markers:true,
       

    }
  })
  .to(".header-red-flag",  {width:'3rem', height:'3rem', top: '0.5rem', duration: 0.5, ease: "hop", }, 0) 
  .to("#di", {morphSVG: {shape: "#sq"}, duration: 0.5, ease: "hop"}, 0)
  .to(".header_znak", { scale: 0.7, duration: 0.5,  smoothOrigin: true, transformOrigin: 'center center', yPercent: -60, ease:'hop'}, 0)
 */

}



/*
================================================================================
ALL - POPUP - WIZDOME
================================================================================
*/
function popupWizdome() {
/* SHOW ONCE PER COOKIE*/
var is_modal_show = sessionStorage.getItem('alreadyShow');
  if(is_modal_show != 'alredy shown'){
    setTimeout(showModal,2000);
      function showModal(){
        let tl = gsap.timeline();
          tl.to(".popup", { autoAlpha: 1, ease:'none'}, 0)
            .to(".barba-container", 0.2, {opacity: 0.2}, 0);

/*   console.log("MODAL TIMEOUT"); */
 sessionStorage.setItem('alreadyShow','alredy shown');
}
}

$(".popup-close, .popup").click(function() {
 /*  gsap.to(".actual-message", 0.2, {
    marginTop: "10%",
    autoAlpha: 0,
    ease: "ease-in"
  }); */

  gsap.to(".popup", 0.2, { 
    autoAlpha: 0
  });
  gsap.to(".barba-container", 0.2, { 
    opacity: 1
  });
}); 

}
/*
================================================================================
HOME - PRODUCT HOVER 
================================================================================
*/
function homeProductHover() {
	/*   gsap.set(".rg__long", {autoAlpha:0, yPercent:-10}); */

	gsap.utils.toArray(".product-hover").forEach((container) => {
		let imagezoom = container.querySelector(".full-image"),
		//	linkhover = container.querySelector(".linkhover"),
      imageokvir = container.querySelector(".product-image_height"),
     
			// wrap = container.querySelector(".rg__wrap"),
			// name = container.querySelector(".product-title"),
			//short = container.querySelector(".rg__short"),
			// long = container.querySelector(".rg__long"),
			// full-image

			tl = gsap.timeline({
				defaults: { ease: "power1", duration: 0.2 },
				paused: true,
			});

		tl.to(imagezoom, { scale: 1.1 }, 0)
   // .to(linkhover, { opacity: 0.4 }, 0)
    .to(imageokvir, { scale: 0.95 }, 0)
		//.to(wrap, { backgroundColor:"rgba(40, 40, 42, 0.14)" }, 0)
		//.to(name, { yPercent:-10, autoAlpha:0 }, 0)
		// .to(short, { yPercent:-8, autoAlpha:0 }, 0)
		// .to(long, {autoAlpha:1, yPercent:10}, 0)
		// .to(white, {yPercent:-45}, 0);

		container.addEventListener("mouseenter", () => tl.play());
		container.addEventListener("mouseleave", () => tl.reverse());
	});
	console.log("HOME - PRODUCT HOVER ");
}



/*
================================================================================
HOW WE WORK AKAPOWL PINNED
================================================================================
*/
function akapowPinned() {

  var mq = window.matchMedia( "(min-width: 480px)" );
  if (mq.matches) { 
  

  gsap.set(".pinned-image", { zIndex: (i, target, targets) => targets.length - i });

  var images = gsap.utils.toArray('.pinned-image:not(.three, .howfour)');
  
  images.forEach((image, i) => {
     
     var nextImage = image.nextElementSibling;
    
     var imageTimeline = gsap.timeline({
       
       scrollTrigger: {
         
         trigger: ".showcase",
         scroller: ".smooth-scroll",
         
         start: () => "top -" + (window.innerHeight * i),       
         end: () => "+=" + window.innerHeight,
       
         
         scrub: true,
         invalidateOnRefresh: true, 
         
       }
       
     })
 
     imageTimeline
      .fromTo(image, { height: () => { return "100%" }  }, { height: () => { return "0%" }, ease: "none" }, 0)
     ;
 
  });
  
  ScrollTrigger.create({
        trigger: ".showcase",
        scroller: ".smooth-scroll",
        start: () => "top top",
        end: () => "+=" + ((images.length) * window.innerHeight),
        pin: '.image-wrap', 
        anticipatePin: 1,
        invalidateOnRefresh: true,
    
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

 

 /*  const box = document.querySelector('body');

  if (!box.classList.contains('page-product-single')) {
    console.log('Element does NOT have class');
  } else {
    console.log('Element has class');
  } */



/* 
 
 if (document.querySelector('div:not(.page-product-single)')) {
  const closenav = document.getElementById('open3d');
  // OPEN CLOSE FUNCTION
  closenav.addEventListener("click", () => {
    showAnim.timeScale(3).reverse();
  });

} 
 */

}

/*
================================================================================
PRODUCT TABS
================================================================================
*/
function productsTabs() {

  let targets = document.querySelectorAll(".tab-item");
  let articles = document.querySelectorAll(".article");
  let activeTab = 0;
  let old = 0;
  let heights = [];
  let dur = 0.25;
  let animation;
  
  for (let i = 0; i < targets.length; i++) {
    targets[i].index = i;
    heights.push(articles[i].offsetHeight); // get height of each article
    gsap.set(articles[i], {top: 0, y:0, opacity:0}); // push all articles up out of view
    targets[i].addEventListener("click", doCoolStuff);
  }
  // set initial article and position bubble slider on first tab 
  gsap.set(articles[0], {y:0, opacity:1, zIndex:2});
  gsap.set(".slider-tab", {x:targets[0].offsetLeft[0], width:targets[0].offsetWidth});
  gsap.set(targets[0], {color:"#0f3936"});
  gsap.set(".article-block", {height:heights[0]});
  
  function doCoolStuff() {
    // check if clicked target is new and if the timeline is currently active
    if(this.index != activeTab) {
      //if there's an animation in-progress, jump to the end immediately so there aren't weird overlaps. 
      if (animation && animation.isActive()) {
        animation.progress(1);
      }
      animation = gsap.timeline({defaults:{duration:0.25}});
      old = activeTab;
      activeTab = this.index;
      // animate bubble slider to clicked target
      animation.to(".slider-tab", {x:targets[activeTab].offsetLeft, width:targets[activeTab].offsetWidth});
      // change text color on old and new tab targets
      // u ovu boju se pretvori prethodno posjećeni
      animation.to(targets[old], {color:"#778E8D", ease:"none"}, 0);
      animation.to(targets[activeTab], {color:"#0f3936", opacity:1, ease:"none"}, 0);
      // slide current article down out of view and then set it to starting position at top
      animation.to(articles[old], {y:0, zIndex:1, opacity:0, ease:"hop" }, 0);
      animation.set(articles[old], {y:0[old]});
      // resize article block to accommodate new content
      animation.to(".article-block", {height:heights[activeTab]});
      // slide in new article
      animation.to(articles[activeTab], {duration: 0.25, zIndex:2, opacity:1, y:0, ease: "hop"}, "-=0.25");
    }
  }
    
  window.addEventListener('resize', function(){
    gsap.to(".slider-tab", {x:targets[activeTab].offsetLeft, width:targets[activeTab].offsetWidth});
   /* console.log("SLIDE TABS ON PLACE TRAVEL"); */
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
SCROLL TO SLIDE - CONTACT
================================================================================
*/

function scrollToSlide() {
  $( "#toslide2" ).on( "click", function() {
    locoScroll.scrollTo( '#slide2', {
      'offset': 0,
      'duration': 1500,
      'easing': [0.5, 0, .0, 1],
      'disableLerp': true
    });
  });

  $( "#toslide3" ).on( "click", function() {
    locoScroll.scrollTo( '#slide3', {
      'offset': 0,
      'duration': 1500,
      'easing': [0.5, 0, .0, 1],
      'disableLerp': true
    });
  });
  }

  

/*
================================================================================
LOGO MARQUEE
================================================================================
*/

function logoMarquee() {

  //Change width and time on your desire

initMarquee(257, 99)

function initMarquee(boxWidth, time) {
    const boxElement = $('.logo-box');
    const boxLength = boxElement.length;
    const wrapperWidth = boxWidth * boxLength;
    const windowWidth = $(window).width();

    boxElement.parent().css('left', '-' + boxWidth + 'px');
    boxElement.css('width', boxWidth + 'px');

    gsap.set(".logo-box", {
        x: (i) => i * boxWidth
    });

    gsap.to(".logo-box", {
        duration: time,
        ease: "none",
        x: "-=" + wrapperWidth,
        modifiers: {
            x: gsap.utils.unitize(
                function (x) {
                    return parseFloat(x + windowWidth + boxWidth) % wrapperWidth
                }
            )
        },
        repeat: -1
    });
  }
}
 
/*
================================================================================
WEBFLOW INTERACTIONS REINIT
================================================================================
*/

/* function webflowInteractions() {
  Webflow.ready();
  Webflow.require('ix2').init();
  console.log("WEBFLOW RELOADED");
} */

/*
================================================================================
AUTO YEAR UPDATE
================================================================================
*/
function yearUpdate() {
  const year = new Date().getFullYear();
  $('.year').text(year);
}

/*
================================================================================
SWIPER PROJECT SOLO
================================================================================
*/

function swiperSolo() {
	var swiper = new Swiper(".swiper-container", {
		loopedSlides: 6,
		loop: true,
		spaceBetween: 35,
		//slidesPerView: 1.2,
		//	freeMode: true,
		grabCursor: true,
		//	mousewheel: false,

		/*  autoplay: {
     delay: 3000,
 disableOnInteraction: false,
   }, */
		 resistanceRatio: 4,
		/*longSwipes: true,
		longSwipesRatio: 0.5, */
		//  touchRatio:5,
		//loopFillGroupWithBlank: false,
		// paginationClickable: true,
		// mousewheelControl: true,
		//	parallax: true,
		preloadImages: true,
		//updateOnImagesReady: true,
		// centeredSlides: true,
		// slidesOffsetBefore: 100,
		speed: 1000,
		breakpoints: {
			400: {
				spaceBetween: 20,
				//  loopedSlides: 3,
				slidesPerView: 1.1,
			},

			/* 	
			1e3: {
				loopedSlides: 3,
				spaceBetween: 24,
				slidesPerView: 1.1,
			},*/

			700: {
				spaceBetween: 34,
				//  loopedSlides: 3,
				slidesPerView: 1.2,
			},
			1024: {
				spaceBetween: 40,
				//  loopedSlides: 3,
				slidesPerView: 1.2,
			},
			1200: {
				spaceBetween: 35,
				slidesPerView: 2.2,
			},
		},
	});
  console.log("SWIPER SOLO UČITAN BYE");

  /* var stop_swiper = function() {
    swiper.destroy();
  };
   */

}


/*
================================================================================
START/STOP VIDEO INOUT OF VIEWPORT
================================================================================
*/

function startStopVideo() {


const videos = gsap.utils.toArray('video')

videos.forEach(function(video, i) {
    
  ScrollTrigger.create({
    trigger: video,
    scroller: ".smooth-scroll",
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => video.play(),
    onEnterBack: () => video.play(),
    onLeave: () => video.pause(),
    onLeaveBack: () => video.pause(),
  });
  
})
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
  
/*   console.log("CUBERTO CURSOR INIT"); */



/* const el = document.querySelector('.buttonx');

el.addEventListener('mouseenter', () => {
   //  cursor.removeText(); 
    cursor.removeState('-inverse');
    console.log("inverse removedremoved");
  });

el.addEventListener('mouseleave', () => {
   /*  cursor.removeText();
    cursor.hide(); 
});
 */

/*   const buttonkillcursor = document.querySelector('.glass-button');
  
  buttonkillcursor.addEventListener('mouseenter', () => {
   // cursor.removeText();
      
  });
  
  buttonkillcursor.addEventListener('mouseleave', () => {
    cursor.setText('Hello!');
  });
   */
  /* function destroyCursor() {
  cursor.destroy();
  console.log("Cursor destroyed EEEEEEEEEEEE");
  } */
  
  /*
  xhide.addEventListener('mouseenter', () => {
     // cursor.hide();
      // cursor.addState('-inverse'); // you can pass multiple states separated by whitespace
  });
  
  xhide.addEventListener('mouseleave', () => {
    //  cursor.show();
      // cursor.removeState('-inverse');
  });
  
  
  // FIXED MAGNETIC ELEMENT
  const box = document.querySelector('.menuu');
  const el = document.querySelector('.myfixedelement');
  
  box.addEventListener('mouseenter', () => {
      cursor.setStick(el);
  });
  
  box.addEventListener('mouseleave', () => {
      cursor.removeStick();
  });
  */
  }, 1000);

  

}
else {
 /*  console.log("CUB MOUSE IS OFF"); */
}    




}




/*
================================================================================
HERO PANEL ANIMATIONS
================================================================================
*/
function heroPanelAnimation() {

//gsap.set(".home-hero-video", {opacity:1, scale:1.2})

gsap.set(".scrolldown", {yPercent:-100})

if (document.querySelector('.smooth-scroll')) {
 locoScroll.stop(); 

/* console.log("LOCO STOPPED"); */


  const runOnComplete = () => {
    locoScroll.start(); 
   /*  console.log("LOCO STARTEDDDD"); */
  }



var tlin = gsap.timeline({});




mySplitText = new SplitText(".head-split", {
 type: "words, lines, chars", linesClass: "clip-text", lineThreshold: 0.5,
});


tlin.fromTo(mySplitText.words, { transformOrigin: "bottom left", yPercent: 100, rotateZ: 20}, {
 
  yPercent: 0,
  duration: 1,
  rotateZ: 0,
//  autoAlpha:1, *
  ease:"hop",
  onComplete: runOnComplete,
  stagger: {
    each: 0.03,
    from: "left"
  }
}, 0)

.to(".gsap-fade", {opacity:0.57}, 1.2)
.to(".scrolldown", {yPercent:0, autoAlpha:1}, 0.7)


// PIN HERO **********************




var tlout = gsap.timeline({
	scrollTrigger: {
		scroller: ".smooth-scroll",
		trigger: ".home-hero_component",
		start: "top top",
		end: "bottom top",
		scrub: true,
		pin: ".pinn",
		pinSpacing: false,
		anticipatePin: 1,
		invalidateOnRefresh: true,
		immediateRender: false,
		toggleActions: "restart none none none",
		// toggleActions: "restart reverse play reverse"
	},
});

tlout.to(".home-hero_video-wrap", { yPercent:-30, duration: 0.6 }, 0)
.to(".home-hero_head-wrap", { yPercent:30, duration: 0.6}, 0) 



/* PINANJE OSTALIH*/
/* var tlfull = gsap.timeline({
  scrollTrigger: {
    scroller: ".smooth-scroll",
    trigger: ".section-pin",
    start: "top top",
    end: "bottom top", 
   
  scrub: true,
    pin: ".section-pin",
    pinSpacing: false,
    anticipatePin: 1,
    toggleActions: "restart none none none"
  // toggleActions: "restart reverse play reverse"
  }
}); */
//tlfull.to(".home-full-image-wrap", { autoAlpha:0, duration: 0.6 }, 0) 


/* BACKUP
var tlout = gsap.timeline({
  scrollTrigger: {
    scroller: ".smooth-scroll",
    trigger: ".home-hero_component",
    start: "top top",
    end: "bottom top", 
   
  scrub: true,
    pin: ".section-home-hero",
    pinSpacing: false,
  //  toggleActions: "restart none none none"
    toggleActions: "restart reverse play reverse"
  }
});

tlout.to(".home-hero_video-wrap", { yPercent:-30,  duration: 0.6 }, 0) 
.to(".home-hero_head-wrap", { yPercent:30,   duration: 0.6 }, 0) 
 */











/* // PIN 2
var tldue = gsap.timeline({
  scrollTrigger: {
    scroller: ".smooth-scroll",
    trigger: ".home-fs-video-component",
    start: "top top",
    end: "bottom top", 
   
  scrub: true,
    pin: ".section-home-herodue",
    pinSpacing: false,
  //  toggleActions: "restart none none none"
    toggleActions: "restart reverse play reverse"
  }
});

tldue.to(".home-hero_video-wrap-due", { yPercent:-20,  duration: 0.8 }, 0) 
.to(".home-hero_head-wrap", { yPercent:30,   duration: 0.6 }, 0) 
 */


/* .fromTo(mySplitText.words, { transformOrigin: "bottom left", yPercent: 0, rotateZ: 0}, {
 
  yPercent: 100,
  duration: 1.25,
  rotateZ: 20,
  //ease: "hop",
  stagger: {
    each: 0.025,
    from: "left"
  }
}, 0) */

}

}
/*
================================================================================
PROJECT OBSERVER
================================================================================
*/

function productsSwiper() {


  const slider = document.getElementById("js-cta-slider");
  const sliderCounter = document.getElementById("js-cta-slider-counter");
  const sliderNext = document.getElementById("js-cta-slider-next");
  const sliderPrevious = document.getElementById("js-cta-slider-previous");
  
  const interleaveOffset = 0.75;
  
    
  
  // svaka fotka ima: data-swiper-parallax-y: "35%"
  
  var swiper = new Swiper(slider, {
    autoplay: false,
    parallax: true,
    loop: true,
    effect: "slide",
    direction: "vertical", // put horizontal
    speed: 1000,
    //grabCursor: true,
    watchSlidesProgress: true, // turn off for horizontal
    //mousewheelControl: true,
    mousewheelControl: 1,
    preventClicks: true,
    resistance: false,
    mousewheel: true,
    pagination: {
      el: sliderCounter,
      type: "custom",
      renderCustom: function(swiper, current, total) {
        let i = current ? current : 0;
        return `${("0" + i).slice(-2)} / ${("0" + total).slice(-2)}`;
      }
    },
    navigation: {
      nextEl: sliderNext,
      prevEl: sliderPrevious
    },
  });
  console.log("SWIPER PRODUCTS UČITAN BYE");

}

/*
================================================================================
SUCCESS
================================================================================
*/
function success() {

  gsap.set(".buttonx", {autoAlpha:0})
  
  var tl = gsap.timeline({})
 
  tl.to(".buttonx", {
    autoAlpha: 1,
    duration: 0.6,
  }, 2.5)
  
  
  //.to(".home-hero-video, .cta__slider", {scale:1}, 0.2)
  //.fromTo(".red-flag", { }, {yPercent:0, rotate:300, duration: 0.8}, 0.4)
  
  
  
  }


/*
================================================================================
DISABLE SCROLL
================================================================================
*/
function disableScroll() {

  var Webflow = Webflow || [];
Webflow.push(function () {
    var $body = $(document.body);
    var scrollPosition = 0;

    $('[scroll="disable"]').on('click', function () {
        var oldWidth = $body.innerWidth();
        scrollPosition = window.pageYOffset;
        $body.css('overflow', 'hidden');
        $body.css('position', 'fixed');
        $body.css('top', `-${scrollPosition}px`);
        $body.width(oldWidth);
    });
    $('[scroll="enable"]').on('click', function () {
        if ($body.css('overflow') != 'hidden') { scrollPosition = window.pageYOffset; }
        $body.css('overflow', '');
        $body.css('position', '');
        $body.css('top', '');
        $body.width('');
        $(window).scrollTop(scrollPosition);
    });
    $('[scroll="both"]').on('click', function () {
        if ($body.css('overflow') !== 'hidden') {
            var oldWidth = $body.innerWidth();
            scrollPosition = window.pageYOffset;
            $body.css('overflow', 'hidden');
            $body.css('position', 'fixed');
            $body.css('top', `-${scrollPosition}px`);
            $body.width(oldWidth);
        } else {
            $body.css('overflow', '');
            $body.css('position', '');
            $body.css('top', '');
            $body.width('');
            $(window).scrollTop(scrollPosition);
        }
    });
});

}


/*
================================================================================
100vh fix mobile menu
================================================================================
*/

function vhFix() {

const documentHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--doc-height', '${window.innerHeight}px')
 /*  console.log("VH DOC HEIGHT"); */
 }
 window.addEventListener('resize', documentHeight)
 documentHeight()
 
	
/*  let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}); 
 */
}


/*
================================================================================
100vh fix mobile menu
================================================================================
*/

function contactScroll() {
	var mq = window.matchMedia("(max-height: 740px)");
	if (mq.matches) {
		locoScroll.start();
		console.log("LOCO START");
	} else {
		locoScroll.stop();
		console.log("LOCO STOPe");
	}
}

/*
================================================================================
100vh fix mobile menu
================================================================================
*/

function buttonHoverFromDirection() {

$(function() {  
  $('.butonio, .butonio-i, .butonio-r')
    .on('mouseenter', function(e) {
			var parentOffset = $(this).offset(),
      		relX = e.pageX - parentOffset.left,
      		relY = e.pageY - parentOffset.top;
			$(this).find('span').css({top:relY, left:relX})
    })
    .on('mouseout', function(e) {
			var parentOffset = $(this).offset(),
      		relX = e.pageX - parentOffset.left,
      		relY = e.pageY - parentOffset.top;
    	$(this).find('span').css({top:relY, left:relX})
    });
  /* $('[href=#]').click(function(){return false}); */
});



}


/*
================================================================================
100vh fix mobile menu
================================================================================
*/

function colorChanger() {

  /* COLOR CHANGER */

  const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
  scrollColorElems.forEach((colorSection, i) => {
    const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
    const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;

    ScrollTrigger.create({
      trigger: colorSection,
      scroller: ".smooth-scroll",
      start: "top 50%",
      onEnter: () =>
      gsap.to(".color-change", {
        backgroundColor: colorSection.dataset.bgcolor,
        color: colorSection.dataset.textcolor,
        overwrite: "auto" }),

      onLeaveBack: () =>
      gsap.to(".color-change", {
        backgroundColor: prevBg,
        color: prevText,
        overwrite: "auto" }) });


  });


}

/*
================================================================================
100vh fix mobile menu
================================================================================
*/

function contactMobilePin() {

var tlfull = gsap.timeline({
  scrollTrigger: {
  //  scroller: ".smooth-scroll",
    trigger: ".image-sticky",
    start: "top top",
    end: "+=10000000", 
    pin: ".image-sticky",
    pinSpacing: false,
    anticipatePin: 1,
   // toggleActions: "restart none none none"
  // toggleActions: "restart reverse play reverse"
  }
}); 
//tlfull.to(".home-full-image-wrap", { autoAlpha:0, duration: 0.6 }, 0) 

}


/*
================================================================================
SKETCHFAB VIEWER
================================================================================
*/

function sketchFab() {

 
  var iframe = document.getElementById( 'api-frame' );
  var uid = '93231ec13b01473ca0077c9d724e8cf5';

  // By default, the latest version of the viewer API will be used.
  var client = new Sketchfab( iframe );

  // Alternatively, you can request a specific version.
  // var client = new Sketchfab( '1.12.1', iframe );

  client.init( uid, {
      success: function onSuccess( api ){
       //   api.start();
          api.addEventListener( 'viewerready', function() {

            document.getElementById('closeclose').addEventListener('click', function () {
              setTimeout(() => {
              api.stop();
           /*    console.log("SKETCHFAB STOPPED A"); */
            }, 1000);
            });

              // API is ready to use
              // Insert your code here
            /*   console.log( 'Viewer is ready' ); */

          } );
      },
      error: function onError() {
       /*    console.log( 'Viewer error' ); */
      }
  } );



/* 
// Sketchfab Viewer API: Start/Stop the viewer
var version = '1.12.1';
var uid = 'dd958716be0b4786b8700125eec618e5';
var iframe = document.getElementById('api-frame');
var client = new window.Sketchfab(version, iframe);

var error = function error() {
  console.error('Sketchfab API error');
};

var success = function success(api) {
  api.addEventListener('viewerstart', function () {
    console.log('viewerstart');
  });
  api.addEventListener('viewerstop', function () {
    console.log('viewerstop');
  });
  api.start(function () {
    document.getElementById('start').addEventListener('click', function () {
      api.start();
    });
    document.getElementById('stop').addEventListener('click', function () {
      api.stop();
    });
    api.addEventListener('viewerready', function () {
      console.log('viewerReady');
    });
  });
};

client.init(uid, {
  success: success,
  error: error,
  autostart: 1,
  preload: 1
}); //////////////////////////////////
// GUI Code
//////////////////////////////////

function initGui() {
  var controls = document.getElementById('controls');
  var buttonsText = '';
  buttonsText += '<button id="start">Start</button>';
  buttonsText += '<button id="stop">Stop</button>';
  controls.innerHTML = buttonsText;
}

initGui(); //////////////////////////////////
// GUI Code end
////////////////////////////////// */

}