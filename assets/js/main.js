const nav=document.getElementById('mainNav'),links=[...document.querySelectorAll('.nav-link')],sections=[...document.querySelectorAll('main section[id]')];
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let scrollFrame=0;
function updateScrollUI(){
  scrollFrame=0;
  const top=window.scrollY;
  nav.classList.toggle('scrolled',top>30);
  const available=document.documentElement.scrollHeight-window.innerHeight;
  nav.style.setProperty('--scroll-progress',available>0?`${Math.min(100,Math.max(0,top/available*100))}%`:'0%');
  const current=[...sections].reverse().find(section=>section.getBoundingClientRect().top<=window.innerHeight*.35);
  links.forEach(link=>{const active=!!current&&link.getAttribute('href')==='#'+current.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  const more=document.querySelector('.more-toggle');
  if(more)more.classList.toggle('active',!!current&&!!document.querySelector(`.dropdown-menu a[href="#${current.id}"]`));
  if(!reducedMotion.matches&&window.innerWidth>=992){
    const portrait=document.querySelector('.hero-visual');
    if(portrait)portrait.style.setProperty('--portrait-shift',`${Math.min(top,650)*.055}px`);
  }
}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollUI)},{passive:true});
window.addEventListener('resize',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollUI)},{passive:true});
updateScrollUI();
document.querySelectorAll('#navbarContent a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const m=document.getElementById('navbarContent');if(m.classList.contains('show'))bootstrap.Collapse.getOrCreateInstance(m).hide();const dropdown=a.closest('.dropdown');if(dropdown)bootstrap.Dropdown.getInstance(dropdown.querySelector('.dropdown-toggle'))?.hide()}));
if(!reducedMotion.matches&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  const aura=document.createElement('span');
  aura.className='cursor-aura';
  aura.setAttribute('aria-hidden','true');
  document.body.append(aura);
  let cursorX=-100,cursorY=-100,auraX=-100,auraY=-100;
  window.addEventListener('pointermove',event=>{
    cursorX=event.clientX;cursorY=event.clientY;
    document.body.classList.add('pointer-active');
  },{passive:true});
  document.addEventListener('pointerover',event=>aura.classList.toggle('is-interactive',!!event.target.closest('a,button')));
  (function animateAura(){
    auraX+=(cursorX-auraX)*.19;auraY+=(cursorY-auraY)*.19;
    aura.style.transform=`translate3d(${auraX}px,${auraY}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(animateAura);
  })();
  document.querySelectorAll('.ba-process-step,.project-card,.experience-card,.about-bio,.toolkit-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${event.clientX-r.left}px`);card.style.setProperty('--my',`${event.clientY-r.top}px`);if(card.classList.contains('project-card')){card.style.setProperty('--card-x',`${((event.clientY-r.top)/r.height-.5)*-3}deg`);card.style.setProperty('--card-y',`${((event.clientX-r.left)/r.width-.5)*3}deg`)}});
    card.addEventListener('pointerleave',()=>{card.style.setProperty('--card-x','0deg');card.style.setProperty('--card-y','0deg')});
  });
  const hero=document.querySelector('.ba-hero');
  hero?.addEventListener('pointermove',event=>{const r=hero.getBoundingClientRect();const x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;hero.style.setProperty('--pointer-x',`${x*100}%`);hero.style.setProperty('--pointer-y',`${y*100}%`);hero.style.setProperty('--hero-x',`${(x-.5)*26}px`);hero.style.setProperty('--hero-y',`${(y-.5)*20}px`);hero.style.setProperty('--hero-rotate',`${(x-.5)*3}deg`)});
  hero?.addEventListener('pointerleave',()=>{hero.style.setProperty('--hero-x','0px');hero.style.setProperty('--hero-y','0px');hero.style.setProperty('--hero-rotate','0deg')});
  document.querySelectorAll('.btn-primary-custom,.btn-outline-custom,.btn-nav,.project-visit,.paper-button').forEach(button=>{
    button.classList.add('magnetic');
    button.addEventListener('pointermove',event=>{const r=button.getBoundingClientRect();button.style.setProperty('--magnet-x',`${(event.clientX-r.left-r.width/2)*.15}px`);button.style.setProperty('--magnet-y',`${(event.clientY-r.top-r.height/2)*.2}px`)});
    button.addEventListener('pointerleave',()=>{button.style.setProperty('--magnet-x','0px');button.style.setProperty('--magnet-y','0px')});
  });
}
if('IntersectionObserver' in window&&!reducedMotion.matches){
  document.querySelectorAll('.project-item, .leadership-feature-card, .leadership-achievement').forEach(item=>{
    const siblings=[...item.parentElement.children].filter(child=>child.matches(item.classList.contains('project-item')?'.project-item':item.classList.contains('leadership-feature-card')?'.leadership-feature-card':'.leadership-achievement'));
    item.style.setProperty('--reveal-delay',`${Math.min(siblings.indexOf(item)%3,2)*95}ms`);
  });
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{rootMargin:'0px 0px -7% 0px',threshold:0});
  document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
}
const buttons=document.querySelectorAll('.filter-btn'),projects=document.querySelectorAll('.project-item');buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;projects.forEach(p=>p.classList.toggle('hidden',f!=='all'&&!p.dataset.category.split(' ').includes(f)))}));
const skillTabs=[...document.querySelectorAll('.skill-tab')],skillPanels=[...document.querySelectorAll('.skill-panel')],skillCount=document.getElementById('skillCount');skillTabs.forEach(tab=>tab.addEventListener('click',()=>{skillTabs.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false')});skillPanels.forEach(x=>{x.classList.remove('active');x.hidden=true});tab.classList.add('active');tab.setAttribute('aria-selected','true');const panel=document.querySelector('[data-skill-panel="'+tab.dataset.skill+'"]');panel.hidden=false;panel.classList.add('active');if(skillCount)skillCount.textContent=panel.children.length}));
document.querySelectorAll('.project-gallery').forEach(gallery=>{const current=gallery.querySelector('.project-gallery-current'),caption=gallery.querySelector('.project-gallery-caption'),dialog=gallery.querySelector('.project-gallery-dialog');gallery.querySelectorAll('.project-gallery-thumbs button').forEach(button=>button.addEventListener('click',()=>{current.src=button.dataset.image;current.alt=button.dataset.alt;if(caption)caption.textContent=button.dataset.caption;if(dialog){dialog.querySelector('img').src=button.dataset.image;dialog.querySelector('img').alt=button.dataset.alt;dialog.querySelector('p').textContent=button.dataset.caption}gallery.querySelectorAll('.project-gallery-thumbs button').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active))})}));gallery.querySelector('.project-gallery-enlarge')?.addEventListener('click',()=>dialog?.showModal());dialog?.querySelector('.project-gallery-close')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()})});

const presentationDialog = document.querySelector('.presentation-dialog');
const presentationMainPhoto = document.querySelector('.presentation-main-photo img');
document.querySelectorAll('.presentation-photo-strip button').forEach(button => button.addEventListener('click', () => {
  presentationMainPhoto.src = button.dataset.photo;
  presentationMainPhoto.alt = button.dataset.alt;
  document.querySelector('.presentation-main-photo').style.setProperty('--presentation-image', `url("${button.dataset.photo}")`);
  document.querySelectorAll('.presentation-photo-strip button').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
}));
document.querySelector('.presentation-main-photo')?.addEventListener('click', () => {
  if (!presentationDialog) return;
  const photo = presentationDialog.querySelector('img');
  photo.src = presentationMainPhoto.src;
  photo.alt = presentationMainPhoto.alt;
  presentationDialog.showModal();
});
presentationDialog?.querySelector('.presentation-dialog-close')?.addEventListener('click', () => presentationDialog.close());
presentationDialog?.addEventListener('click', event => {
  if (event.target === presentationDialog) presentationDialog.close();
});

document.getElementById('paperButton')?.addEventListener('click', () => {
  document.getElementById('paperNotice').hidden = false;
});
const certificateDialog = document.querySelector('.certificate-dialog');
document.querySelector('.education-certificate')?.addEventListener('click', () => certificateDialog?.showModal());
certificateDialog?.querySelector('.certificate-close')?.addEventListener('click', () => certificateDialog.close());
certificateDialog?.addEventListener('click', event => {
  if (event.target === certificateDialog) certificateDialog.close();
});

const presentationVideo = document.querySelector('.presentation-card-video video');
const soundButton = document.querySelector('.presentation-sound');
if (presentationVideo) {
  const updateSoundButton = () => {
    if (!soundButton) return;
    soundButton.hidden = !presentationVideo.muted;
  };
  const playPresentation = async () => {
    if (document.hidden) return;
    try {
      presentationVideo.muted = false;
      await presentationVideo.play();
    } catch {
      presentationVideo.muted = true;
      try { await presentationVideo.play(); } catch { /* Playback may require a gesture. */ }
    }
    updateSoundButton();
  };
  soundButton?.addEventListener('click', () => {
    presentationVideo.muted = false;
    presentationVideo.play().catch(() => {});
    updateSoundButton();
  });
  presentationVideo.addEventListener('volumechange', updateSoundButton);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && document.visibilityState === 'visible') {
        if (presentationVideo.paused) playPresentation();
      } else presentationVideo.pause();
    }, { threshold: 0.45 }).observe(presentationVideo);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) presentationVideo.pause();
    });
  }
}
