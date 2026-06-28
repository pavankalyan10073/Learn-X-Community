document.addEventListener('DOMContentLoaded', function() {
// LOADER
var ldr=document.getElementById('ldr');
window.addEventListener('load',()=>{
  setTimeout(()=>{if(ldr)ldr.classList.add('hidden')},700)
});

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
nb.addEventListener('click',()=>{
  nl.classList.toggle('open');
  nb.textContent=nl.classList.contains('open')?'✕':'☰';
});
nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nl.classList.remove('open');
  nb.textContent='☰';
}));

// REVEAL
const ro=new IntersectionObserver((e)=>e.forEach(x=>{
  if(x.isIntersecting){
    x.target.classList.add('vis');
    ro.unobserve(x.target);
  }
}),{threshold:.05,rootMargin:'0px 0px -10px 0px'});
document.querySelectorAll('.rv').forEach(r=>ro.observe(r));

// COUNTERS
const co=new IntersectionObserver((e)=>e.forEach(x=>{
  if(x.isIntersecting){
    const el=x.target,t=+el.getAttribute('data-count'),d=1600,s=performance.now();
    function tick(n){
      const p=Math.min((n-s)/d,1),e=1-Math.pow(1-p,3);
      el.textContent=Math.round(e*t)+(t>100?'+':'');
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    co.unobserve(el);
  }
}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(c=>co.observe(c));

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

// FORM
var jf=document.getElementById('jf');
if(jf){
  jf.addEventListener('submit',function(e){
    e.preventDefault();
    this.innerHTML='<div style="text-align:center;padding:40px 20px"><div style="font-size:3rem;margin-bottom:12px">🎉</div><h3 style="font-family:Space Grotesk,sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:6px">Welcome to Learn X!</h3><p style="color:var(--t2)">We\'ll reach out soon. Time to learn, build & grow! 🚀</p></div>';
    setTimeout(()=>location.reload(),4000);
  });
}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t)window.scrollTo({top:t.offsetTop-70,behavior:'smooth'});
  });
});

// POPUP FORM
const fctaJoinBtn=document.getElementById('fctaJoin');
if(fctaJoinBtn){
  fctaJoinBtn.addEventListener('click',()=>{
    const popupOverlay=document.getElementById('popupOverlay');
    const popupForm=document.getElementById('popupForm');
    const popupSuccess=document.getElementById('popupSuccess');
    if(popupOverlay){
      popupOverlay.classList.add('open');
      popupForm.style.display='block';
      popupSuccess.style.display='none';
      document.body.style.overflow='hidden';
    }
  });
}
const popupCloseBtn=document.getElementById('popupClose');
if(popupCloseBtn){
  popupCloseBtn.addEventListener('click',()=>{
    const popupOverlay=document.getElementById('popupOverlay');
    if(popupOverlay){
      popupOverlay.classList.remove('open');
      document.body.style.overflow='';
    }
  });
}
const popupOverlay=document.getElementById('popupOverlay');
if(popupOverlay){
  popupOverlay.addEventListener('click',e=>{
    if(e.target===popupOverlay){
      popupOverlay.classList.remove('open');
      document.body.style.overflow='';
    }
  });
}

// STARTUP POPUP FORM
const fctaStartupBtn=document.getElementById('fctaStartup');
if(fctaStartupBtn){
  fctaStartupBtn.addEventListener('click',()=>{
    const startupOverlay=document.getElementById('startupOverlay');
    const startupForm=document.getElementById('startupForm');
    const startupSuccess=document.getElementById('startupSuccess');
    if(startupOverlay){
      startupOverlay.classList.add('open');
      startupForm.style.display='block';
      startupSuccess.style.display='none';
      document.body.style.overflow='hidden';
    }
  });
}
const startupCloseBtn=document.getElementById('startupClose');
if(startupCloseBtn){
  startupCloseBtn.addEventListener('click',()=>{
    const startupOverlay=document.getElementById('startupOverlay');
    if(startupOverlay){
      startupOverlay.classList.remove('open');
      document.body.style.overflow='';
    }
  });
}
const startupOverlay=document.getElementById('startupOverlay');
if(startupOverlay){
  startupOverlay.addEventListener('click',e=>{
    if(e.target===startupOverlay){
      startupOverlay.classList.remove('open');
      document.body.style.overflow='';
    }
  });
}

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
  startupFrm.addEventListener('submit',function(e){
    e.preventDefault();
    const phone=startupPhoneInput.value.replace(/\D/g,'');
    const email=startupEmailInput.value;
    const phoneValid=phone.length>=10;
    const emailValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const ideaValid=document.getElementById('startupIdea').value.trim().length>0;
    startupPhoneInput.classList.toggle('invalid',!phoneValid);
    startupPhoneInput.nextElementSibling.style.display=!phoneValid?'block':'none';
    startupEmailInput.classList.toggle('invalid',!emailValid);
    startupEmailInput.nextElementSibling.style.display=!emailValid?'block':'none';
    document.getElementById('startupIdea').classList.toggle('invalid',!ideaValid);
    if(phoneValid&&emailValid&&ideaValid){
      const startupForm=document.getElementById('startupForm');
      const startupSuccess=document.getElementById('startupSuccess');
      startupForm.style.display='none';
      startupSuccess.style.display='block';
    }
  });
}

// VALIDATION
const popupFormEl=document.getElementById('popupForm');
if(popupFormEl){
  const phoneInput=document.getElementById('phone');
  const emailInput=document.getElementById('email');
  if(phoneInput){
    phoneInput.addEventListener('input',()=>{
      const v=phoneInput.value.replace(/\D/g,'').slice(0,10);
      phoneInput.value=v;
      const isValid=v.length===10;
      phoneInput.classList.toggle('invalid',v.length>0&&v.length<10);
      phoneInput.nextElementSibling.style.display=(v.length>0&&v.length<10)?'block':'none';
    });
  }
  if(emailInput){
    emailInput.addEventListener('input',()=>{
      const v=emailInput.value;
      const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      emailInput.classList.toggle('invalid',v.length>0&&!valid);
      emailInput.nextElementSibling.style.display=(v.length>0&&!valid)?'block':'none';
    });
  }
  popupFormEl.addEventListener('submit',function(e){
    e.preventDefault();
    const phone=phoneInput.value.replace(/\D/g,'');
    const email=emailInput.value;
    const phoneValid=phone.length>=10;
    const emailValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    phoneInput.classList.toggle('invalid',!phoneValid);
    phoneInput.nextElementSibling.style.display=!phoneValid?'block':'none';
    emailInput.classList.toggle('invalid',!emailValid);
    emailInput.nextElementSibling.style.display=!emailValid?'block':'none';
    if(phoneValid&&emailValid){
      const popupForm=document.getElementById('popupForm');
      const popupSuccess=document.getElementById('popupSuccess');
      popupForm.style.display='none';
      popupSuccess.style.display='block';
    }
  });
}

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

});