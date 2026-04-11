// Nav scroll state
const nav = document.getElementById('nav');
if(nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), {passive:true});

// Nav drawer
let navOpen = false;
function toggleNav(){ navOpen=!navOpen; document.getElementById('nav-drawer').classList.toggle('open',navOpen); }
function closeNav(){ navOpen=false; document.getElementById('nav-drawer').classList.remove('open'); }

// Reveal on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
}, {threshold:0.08, rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Menu tab switcher (used on /menu and homepage if present)
function switchMenu(id, btn){
  document.querySelectorAll('.menu-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById('mp-'+id);
  if(panel) panel.classList.add('active');
}

// Time + hours logic
const now = new Date();
const day = now.getDay();
const hoursById = {1:'h-weekday',2:'h-weekday',3:'h-weekday',4:'h-weekday',5:'h-fri',6:'h-sat',0:'h-sun'};
const todayHoursEl = document.getElementById(hoursById[day]);
if(todayHoursEl) todayHoursEl.classList.add('today-row');
const todayHoursText = {1:'6:00 PM – 2:00 AM',2:'6:00 PM – 2:00 AM',3:'6:00 PM – 2:00 AM',4:'6:00 PM – 2:00 AM',5:'5:00 PM – 4:00 AM',6:'5:00 PM – 4:00 AM',0:'5:00 PM – 2:00 AM'};
const tonightEl = document.getElementById('hero-tonight-time');
if(tonightEl) tonightEl.textContent = todayHoursText[day];

// Open Now live check — schedule in decimal hours (local time). Close may extend past midnight.
const schedule = {1:[18,26],2:[18,26],3:[18,26],4:[18,26],5:[17,28],6:[17,28],0:[17,26]};
const yesterday = (day + 6) % 7;
const hour = now.getHours() + now.getMinutes()/60;
const [todayOpen, todayClose] = schedule[day];
const [, yesterdayClose] = schedule[yesterday];
const openNow = (hour >= todayOpen && hour < Math.min(todayClose, 24)) || (todayClose > 24 && hour < todayClose - 24 && day !== (yesterday+1)%7) || (yesterdayClose > 24 && hour < yesterdayClose - 24);
const badge = document.getElementById('open-now-badge');
const badgeText = document.getElementById('open-now-text');
if(badge && badgeText){
  if(openNow){
    badgeText.textContent = 'Open Now';
    badge.style.color = '#5bbf84';
  } else {
    badgeText.textContent = 'Closed';
    badge.style.color = 'rgba(255,255,255,0.55)';
    const dot = badge.querySelector('.open-dot');
    if(dot) dot.style.background = 'rgba(255,255,255,0.4)';
  }
}

// Today's special highlight
document.querySelectorAll('.special-card[data-day]').forEach(c => {
  if(parseInt(c.dataset.day)===day) c.classList.add('today-special');
});

// Package selector (scrolls to booking form on homepage, or redirects to homepage from sub-pages)
function selectPackage(pkgName, e){
  if(e&&e.preventDefault) e.preventDefault();
  const booking = document.getElementById('booking');
  if(!booking){ window.location.href = 'index.html#booking?pkg=' + encodeURIComponent(pkgName); return; }
  booking.scrollIntoView({behavior:'smooth'});
  setTimeout(()=>{
    const sel = document.getElementById('f-package');
    if(sel){ sel.value = pkgName; sel.classList.add('highlighted'); setTimeout(()=>sel.classList.remove('highlighted'), 2500); }
    const banner = document.getElementById('form-pkg-banner');
    const txt = document.getElementById('form-pkg-text');
    if(txt) txt.textContent = pkgName + ' selected';
    if(banner) banner.classList.add('visible');
  }, 700);
}

// Booking form submit (stub — replace with real backend)
function submitForm(){
  const v = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  if(!v('f-name')||!v('f-phone')||!v('f-email')||!v('f-date')||!v('f-guests')){
    alert('Please fill in: Name, Phone, Email, Date, and Guest Count.'); return;
  }
  const btn = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');
  if(btn) btn.style.display = 'none';
  if(success) success.classList.add('visible');
}

function toggleNotes(){
  const wrap = document.getElementById('form-notes-wrap');
  const toggle = document.getElementById('form-notes-toggle');
  if(wrap) wrap.classList.add('open');
  if(toggle) toggle.classList.add('open');
  setTimeout(()=>{ const n = document.getElementById('f-notes'); if(n) n.focus(); }, 50);
}

// Dynamic footer year
const yearEl = document.getElementById('footer-year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Sticky CTA scroll progress
const ctaProgress = document.getElementById('sticky-cta-progress');
if(ctaProgress){
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    ctaProgress.style.width = Math.min(100, Math.max(0, scrolled * 100)) + '%';
  };
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();
}

// Smooth-scroll same-page anchors (browser handles cross-page links)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if(href === '#' || !href) return;
    const t = document.querySelector(href);
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
  });
});
