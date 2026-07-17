(function(){
// LOADER (hide ASAP for snappy perceived load)
var ldr=document.getElementById('ldr');
function hideLoader(){ if(ldr) ldr.classList.add('hidden'); }
if(document.readyState==='complete'){ setTimeout(hideLoader,150); }
else { window.addEventListener('load',()=>setTimeout(hideLoader,150)); }
setTimeout(hideLoader,1200); // safety: never trap the user

// NAV
const nav=document.getElementById('nav'),prog=document.getElementById('prog');
let s=0;
window.addEventListener('scroll',()=>{
  s=window.scrollY;
  nav.classList.toggle('scrolled',s>50);
  prog.style.width=(s/(document.documentElement.scrollHeight-window.innerHeight)*100)+'%';
});

// MOBILE MENU
const nb=document.getElementById('nb'),nl=document.getElementById('nl');
const ICON_MENU='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
const ICON_CLOSE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
nb.addEventListener('click',()=>{
  const open=nl.classList.toggle('open');
  nb.innerHTML=open?ICON_CLOSE:ICON_MENU;
});
nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nl.classList.remove('open');
  nb.innerHTML=ICON_MENU;
}));

// REVEAL + COUNTERS are handled in animations.js for richer motion

// TABS - ROADMAP
function initRoadmap(){
  document.querySelectorAll('.rp').forEach((p, index) => {
    if (index === 0) {
      p.style.display = 'block';
      p.classList.add('active');
    } else {
      p.style.display = 'none';
      p.classList.remove('active');
    }
  });

  document.querySelectorAll('.rt button').forEach((btn, index) => {
    if (index === 0) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.rt button').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.rp').forEach(p=>{
        p.classList.remove('active');
        p.style.display = 'none';
      });
      btn.classList.add('active');
      var activePanel = document.getElementById(btn.dataset.tab);
      activePanel.classList.add('active');
      activePanel.style.display = 'block';
    });
  });
}

// Initialize roadmap when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRoadmap);
} else {
  initRoadmap();
}

// Also re-initialize after a short delay to ensure CSS is applied
setTimeout(initRoadmap, 100);

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t)window.scrollTo({top:t.offsetTop-70,behavior:'smooth'});
  });
});

// FAQ TOGGLE
document.querySelectorAll('.faq-question').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.closest('.faq-item');
    const wasActive=item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('active'));
    if(!wasActive){
      item.classList.add('active');
    }
  });
});

// CHAT BUTTON
document.getElementById('chatBtn')?.addEventListener('click',()=>{
  alert('Chat support coming soon! For now, please email us at support@learnx.community');
});

// PHONE VALIDATION FOR POPUPS
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
  });
});

// Wait for lazily-loaded Firebase auth/db (max ~6s), then resolve
function readyAuth(timeout){
  return new Promise(function(resolve){
    var waited=0;
    (function check(){
      if(window.DB&&window.AUTH) return resolve(true);
      if(waited>= (timeout||6000)) return resolve(false);
      waited+=120;
      setTimeout(check,120);
    })();
  });
}

// ATTACH FORM HANDLERS (does NOT wait on Firebase; lazy-loads auth on submit)
function initForms(){

  // JOIN FORM (join community) - saves to joinCommunity DB
  var jf=document.getElementById('jf');
  if(jf){
    jf.addEventListener('submit',async function(e){
      e.preventDefault();
      const data={
        fullName: this.querySelector('input[placeholder="Full Name *"]')?.value||'',
        email: this.querySelector('input[placeholder="Email *"]')?.value||'',
        college: this.querySelector('input[placeholder="College"]')?.value||'',
        branch: this.querySelector('input[placeholder="Branch"]')?.value||'',
        year: this.querySelector('input[placeholder="Year of Study"]')?.value||'',
        linkedin: this.querySelector('input[placeholder="LinkedIn Profile"]')?.value||'',
        github: this.querySelector('input[placeholder="GitHub Profile"]')?.value||'',
        goal: this.querySelector('textarea[placeholder="What\'s your career goal?"]')?.value||'',
        whyJoin: this.querySelector('textarea[placeholder="Why do you want to join?"]')?.value||'',
      };
      try {
        const ok = await readyAuth();
        if(ok && window.DB){ await window.DB.saveJoinCommunity(data); }
        else { /* degrade gracefully - no backend connection */ }
        this.innerHTML='<div style="text-align:center;padding:40px 20px"><div style="font-size:3rem;margin-bottom:12px">🎉</div><h3 style="font-family:Space Grotesk,sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:6px">Welcome to Learn X!</h3><p style="color:var(--t2)">We\'ll reach out soon. Time to learn, build & grow! 🚀</p></div>';
      } catch (err) {
        this.innerHTML='<div style="text-align:center;padding:40px 20px"><div style="font-size:3rem;margin-bottom:12px">⚠️</div><h3 style="font-family:Space Grotesk,sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:6px">Submission Failed</h3><p style="color:var(--t2)">Please try again or use the Join Free button.</p></div>';
      }
    });
  }

  // POPUP GENERIC SETUP
  function setupPopup(overlayId, closeBtnId, formId, successId, dbSaveFnName) {
    const overlay = document.getElementById(overlayId);
    const closeBtn = document.getElementById(closeBtnId);
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);

    if(overlay){
      overlay.addEventListener('click',e=>{
        if(e.target===overlay){
          overlay.classList.remove('open');
          document.body.style.overflow='';
        }
      });
    }
    if(closeBtn){
      closeBtn.addEventListener('click',()=>{
        if(overlay){
          overlay.classList.remove('open');
          document.body.style.overflow='';
        }
      });
    }
    if(form){
      form.addEventListener('submit',async function(e){
        e.preventDefault();
        const inputs = form.querySelectorAll('input, textarea');
        let valid = true;
        const data = {};
        inputs.forEach(input => {
          const name = input.id || input.placeholder;
          data[name] = input.value.trim();
          if(input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('invalid');
            valid = false;
          } else {
            input.classList.remove('invalid');
          }
        });
        if(!valid) return;

        try {
          await readyAuth();
          const saveFn = window.DB && window.DB[dbSaveFnName];
          if(typeof saveFn === 'function'){
            await saveFn(data);
          }
          form.style.display='none';
          if(success) success.style.display='block';
          setTimeout(() => {
            if(overlay){
              overlay.classList.remove('open');
              document.body.style.overflow='';
            }
            form.style.display='block';
            if(success) success.style.display='none';
            form.reset();
          }, 3000);
        } catch (err) {
          form.style.display='none';
          if(success) success.style.display='block';
        }
      });
    }
  }

  // STARTUP POPUP
  const fctaStartupBtn=document.getElementById('fctaStartup');
  if(fctaStartupBtn){
    fctaStartupBtn.addEventListener('click',()=>{
      const startupOverlay=document.getElementById('startupOverlay');
      const startupForm=document.getElementById('startupFrm');
      const startupSuccess=document.getElementById('startupSuccess');
      if(startupOverlay){
        startupOverlay.classList.add('open');
        if(startupForm) startupForm.style.display='block';
        if(startupSuccess) startupSuccess.style.display='none';
        document.body.style.overflow='hidden';
      }
    });
  }
  setupPopup('startupOverlay', 'startupClose', 'startupFrm', 'startupSuccess', 'saveStartupForm');

  // STARTUP VALIDATION
  const startupFrm=document.getElementById('startupFrm');
  if(startupFrm){
    const startupPhoneInput=document.getElementById('startupPhone');
    const startupEmailInput=document.getElementById('startupEmail');
    if(startupPhoneInput){
      startupPhoneInput.addEventListener('input',()=>{
        const v=startupPhoneInput.value.replace(/\D/g,'').slice(0,10);
        startupPhoneInput.value=v;
        startupPhoneInput.classList.toggle('invalid',v.length>0&&v.length<10);
        startupPhoneInput.nextElementSibling.style.display=(v.length>0&&v.length<10)?'block':'none';
      });
    }
    if(startupEmailInput){
      startupEmailInput.addEventListener('input',()=>{
        const v=startupEmailInput.value;
        const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        startupEmailInput.classList.toggle('invalid',v.length>0&&!valid);
        startupEmailInput.nextElementSibling.style.display=(v.length>0&&!valid)?'block':'none';
      });
    }
  }

  // JOIN COMMUNITY POPUP
  const fctaJoinBtn=document.getElementById('fctaJoin');
  if(fctaJoinBtn){
    fctaJoinBtn.addEventListener('click',()=>{
      const overlay=document.getElementById('joinCommunityOverlay');
      const form=document.getElementById('joinCommunityFrm');
      const success=document.getElementById('joinCommunitySuccess');
      if(overlay){
        overlay.classList.add('open');
        if(form) form.style.display='block';
        if(success) success.style.display='none';
        document.body.style.overflow='hidden';
      }
    });
  }
  setupPopup('joinCommunityOverlay', 'joinCommunityClose', 'joinCommunityFrm', 'joinCommunitySuccess', 'saveJoinCommunity');
}

// Show logged-in user in the nav (name + logout) when a session exists
function syncNavUser(){
  var cta=document.getElementById('navCta');
  var userBox=document.getElementById('navUser');
  var av=document.getElementById('navAv');
  var uname=document.getElementById('navUname');
  var logout=document.getElementById('navLogout');
  if(!cta||!userBox) return;
  if(!(window.AUTH&&window.AUTH.onAuthChange)){
    // auth.js (module) may not be ready yet — retry shortly
    return setTimeout(syncNavUser, 150);
  }
  function paint(user){
    if(user){
      var name=(user.user_metadata&&user.user_metadata.full_name)||(user.email?user.email.split('@')[0]:'User');
      uname.textContent=name;
      av.textContent=(name[0]||'U').toUpperCase();
      cta.hidden=true; cta.style.display='none';
      userBox.hidden=false; userBox.style.display='flex';
    } else {
      cta.hidden=false; cta.style.display='';
      userBox.hidden=true; userBox.style.display='none';
    }
  }
  window.AUTH.onAuthChange(paint);
  window.AUTH.currentUser().then(paint).catch(function(){ paint(null); });
  if(logout) logout.addEventListener('click',function(){
    if(window.AUTH) window.AUTH.logout().then(function(){ window.location.reload(); }).catch(function(){ window.location.reload(); });
  });
}

initForms();
syncNavUser();

})();
