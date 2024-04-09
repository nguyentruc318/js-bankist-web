'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const dotContainer = document.querySelector('.dots');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click',openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////
///////////////////////////////
// Page nav
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault();
//     const id =this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function(e){
  console.log(e.target);
  // matching strategy
  if(e.target.classList.contains('nav__link')){
    // console.log("Link");
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});
const h1 =document.querySelector('h1');
// going downwards: child 
h1.querySelectorAll('.highlight');
console.log(h1.children);
console.log(h1.childNodes);
h1.firstElementChild.style.color= 'green';
h1.lastElementChild.style.color='black';
// going upwards :parents 
console.log(h1.parentNode); 
h1.closest('.header').style.background='white';
// going sideways : sibling
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if(el!== h1 ) el.style.tranform = 'scale(0.5)';
});
// TAb component 
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('operations__content');
tabsContainer.addEventListener('click',function(e){
  const clicked= e.target.closest('.operations__tab');
  if(!clicked) return ;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
// activate tab
  clicked.classList.add('operations__tab--active');
// activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});
// menu fade animation
const handleHover = function(e, opacity){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if(el !== link) el.style.opacity =opacity;
    })
    logo.style.opacity =opacity;
  }
}
const nav = document.querySelector('.nav');
nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout',handleHover.bind(1));
// sticky nav
// const section1 = document.querySelector('#section--1');
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function(){
//   if(this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
// sticky navigation : intersection observe API
// const obsCallback = function(entries , observer){
//   entries.forEach( e => console.log(e));
// }
// const obsOptions = {
//   root : null ,
//   threshod:[0,0.2]
// }; 
// const observer= new IntersectionObserver (obsCallback, obsOptions);
// observer.observe(section1);
const stickyNav = function(entries){
  const [entry]= entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
const navheight =nav.getBoundingClientRect().height;
const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(stickyNav, {
  root : null,
  threshold:0,
  rootMargin:`${navheight}px`,
});
headerObserver.observe(header);
// reveal sections 
const allSections = document.querySelectorAll('.section')
const revealSection = function(entries, observer){
  const [entry] =entries ;
  if(!entry.isIntersecting) return ; 

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection,{
  root: null,
  threshold:0.15,
});
allSections.forEach(function(section){
    sectionObserver.observe(section);
    // section.classList.add('section--hidden');
});
// Lazy loading images 
const loadImg = function(entries , observer){
  const [entry ] = entries ;
  if (!entry.isIntersecting) return ; 
  // replace src wiht  data src 
  entry.target.src = entry.target.dataset.src ;
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}
const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(loadImg, {
  root : null ,
  threshold : 0,
} );
imgTargets.forEach(img => imgObserver.observe(img));

// slider
const Slider = function(){
  // const slides = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight =document.querySelector('.slider__btn--right');
  let currentSlide = 0 ; 


  // slider.style.tranform ='scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';
  const slides = document.querySelectorAll('.slide');
  const maxSlide = slides.length;
  const goToSlides = function(slide){
    slides.forEach((s, i) => s.style.transform = `translateX(${100*(i-slide)}%)`);
  }

  const creatDot = function(){
    slides.forEach(function(_,i){
      dotContainer.insertAdjacentHTML('beforeend',`<button class ="dots__dot" data-slide= ${i}></button>`);
    });
  }

  const activateDot = function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  const nextSlide = function(){
    if(currentSlide=== maxSlide- 1){
      currentSlide=0;
    }else{
      currentSlide++;
    }
    goToSlides(currentSlide);
    activateDot(currentSlide);
  }
  const prevSlide = function(){
    if(currentSlide=== 0){
      currentSlide= maxSlide-1;
    }else{
      currentSlide--;
    }
    
    goToSlides(currentSlide);
    activateDot(currentSlide);
  }
  const init = function(){
    goToSlides(0);
    creatDot();
    activateDot(0);
  };
  init();
  // event handler
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click',prevSlide);
  // press button to slide
  document.addEventListener('keydown', function(e){
    if(e.key=='ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });


  dotContainer.addEventListener('click',function(e){
    if(e.target.classList.contains('dots__dot')){
      const {slide} = e.target.dataset;
      goToSlides(slide);
      activateDot(slide);
    }
  })
};
Slider();
////////
///////////////////////////////////////////////////////
// //////////////////////////////////////////////////
// const header =document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);
// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// console.log(document.getElementsByClassName('btn'));
// // creating and insert ;
// // insertAdjacentHTML;
// const message = document.createElement('div');
// message.classList.add('cookie-massage');
// // message.textContent = 'We used cookie for improved functionality and analytics';
// message.innerHTML = 'We used cookie for improved functionality and analytics. <button class ="btn btn--close-cookie">Got it!</button>' ;
// header.prepend(message);
// // header.append(message)
// // header.append(message.clone(true));
// // header.after(message);
// //delete element ;
// document.querySelector('.btn--close-cookie').addEventListener('click',function(){
//     message.remove();
// });
// // Styles 
// message.style.backgroundColor= '#37383d';
// message.style.width ='120%';
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// message.style.height= Number.parseFloat(getComputedStyle(message).height,10) +30 + 'px';
// document.documentElement.style.setProperty('--color-primary','orangered');
// // attribute
// const logo =document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.getAttribute('desinger'));
// logo.alt ='Beautiful logo';
// console.log(logo.getAttribute('src')); 
// const link =document.querySelector('.twitter-link');
// const btnScroll = document.querySelector('.btn--scroll-to');
// 
// btnScroll.addEventListener('click',function(e){
//   // const s1coord= section1.getBoundingClientRect();
//   // console.log(s1coord);
//   // console.log(e.target.getBoundingClientRect());
//   // console.log('Current scroll X/Y', window.pageXOffset)
//   // scrolling 
//   // window.scrollTo({
//   //   left:s1coord.left + window.pa
//   // }); 
//   section1.scrollIntoView({behavior:'smooth'});
// });
// const h1 = document.querySelector('h1');
// const alertH1 = function(e){
//   alert('addEventListener: Great! You are reading the heading :D');
// }
// h1.addEventListener('mouseenter',alertH1);
// // h1.onmouseenter = function(e){
// //   alert('onmouseenter: Great! You are reading the heading :D');
// // }
// setTimeout(()=>h1.removeEventListener('mouseenter',alertH1),3000);
