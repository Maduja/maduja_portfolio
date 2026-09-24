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
  if(!reducedMotion.matches&&window.innerWidth>=992){
    const portrait=document.querySelector('.hero-visual');
    if(portrait)portrait.style.setProperty('--portrait-shift',`${Math.min(top,650)*.055}px`);
  }
}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollUI)},{passive:true});
window.addEventListener('resize',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollUI)},{passive:true});
updateScrollUI();
links.forEach(a=>a.addEventListener('click',()=>{const m=document.getElementById('navbarContent');if(m.classList.contains('show'))bootstrap.Collapse.getOrCreateInstance(m).hide()}));
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
