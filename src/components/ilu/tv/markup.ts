/* Static markup for the TV display shell. The engine (engine.ts) fills and animates it. */
/* eslint-disable max-len */
export const TV_SHELL_HTML = String.raw`
<div id="viewport">
  <div id="stage">
    <header id="topbar">
      <div class="logo" aria-label="ILU Foundation"><b>ILU</b><span>Foundation</span></div>
      <div class="tb-title"><small>Palada Challenge 2026</small><span id="screenName">Live Delivery Progress</span></div>
      <div style="flex:1"></div>
      <div class="live" id="liveBadge"><i></i><span id="liveText">LIVE</span></div>
      <div class="mini">
        <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,253,247,.1)" stroke-width="7"/><circle id="miniRing" class="tr" cx="28" cy="28" r="24" fill="none" stroke="#34d399" stroke-width="7" stroke-linecap="round" stroke-dasharray="0 150.8" transform="rotate(-90 28 28)"/></svg>
        <div><b><span data-num="pct" data-dec="1">0</span>%</b><small>Delivered</small></div>
      </div>
      <div class="clock"><div class="t"><span id="clockT">--:--:--</span><small id="clockA">AM</small></div><div class="d" id="clockD"></div></div>
    </header>
    <div id="content"><div id="wipe"></div></div>
    <footer id="ticker">
      <div id="tprog"><div></div></div>
      <div class="tlabel"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fffdf7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>LIVE UPDATES</div>
      <div class="ttrack"><div id="marquee"></div></div>
      <div class="tdots" id="tdots"></div>
    </footer>
    <div id="toast" aria-live="polite">
      <span class="tic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#062b1e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>
      <div style="min-width:0"><small>JUST DELIVERED</small><b class="ellip" id="toastName"></b><em id="toastMeta"></em></div>
      <span class="q" id="toastQty"></span>
    </div>
    <div id="offline" hidden>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffcf5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 4.2-2.7M10.7 5.1A15 15 0 0 1 22 8.8M5 12.9a10 10 0 0 1 5.2-2.8M17.8 12.6a10 10 0 0 0-2-1.3M12 20h.01"/></svg>
      <span id="offlineText">Offline · showing last data, reconnecting…</span>
    </div>
    <div id="milestone" aria-live="polite"></div>
    <div id="rsAd" aria-label="Advertisement: Raihsoft Technologies" aria-hidden="true">
      <div class="rs-blob b1"></div><div class="rs-blob b2"></div><div class="rs-grid"></div>
      <svg class="rs-wave" viewBox="0 0 1920 150" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="rsWaveG" x1="0" x2="1"><stop offset="0" stop-color="#5ee0e6" stop-opacity=".5"/><stop offset="1" stop-color="#1f6fd1" stop-opacity=".7"/></linearGradient></defs><path d="M0 90 C 400 20 900 140 1920 40 V150 H0Z" fill="url(#rsWaveG)"/></svg>
      <img class="rs-mark" src="/ilu/tv/raihsoft-logo.png" alt="Raihsoft">
      <div class="rs-hud"><span class="rs-pill">Advertisement</span><span class="rs-pill">Live stats in <b id="rsCount">0s</b></span></div>
      <div id="rsSweep"></div>

      <!-- 1 · logo reveal -->
      <section class="rs-scene rs-col rs-center" style="gap:44px">
        <div class="rs-tile a-spin">
          <span class="rs-halo"></span><span class="rs-halo" style="animation-delay:1.2s"></span>
          <svg width="230" height="230" viewBox="0 0 230 230" aria-hidden="true"><defs><linearGradient id="rsTile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ee0e6"/><stop offset="1" stop-color="#0a4fb3"/></linearGradient></defs><rect width="230" height="230" rx="52" fill="url(#rsTile)"/><path d="M64 30h50v44h40v44h-40v52q0 10 10 10h30v40h-44q-46 0-46-46v-56h-22v-44h22z" fill="#000e52" stroke="#fff" stroke-width="3"/><circle cx="186" cy="192" r="22" fill="#000e52" stroke="#fff" stroke-width="3"/></svg>
        </div>
        <img class="a-wipe" style="--d:6;width:820px;height:auto;max-width:none" src="/ilu/tv/raihsoft-logo.png" alt="Raihsoft">
        <span class="rs-tag a-up" style="--d:11">Engineering Digital Success for Modern Businesses</span>
      </section>

      <!-- 2 · kinetic headline -->
      <section class="rs-scene">
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:30px">
          <span class="rs-eyebrow a-left">Software engineering · Kerala, India</span>
          <h1 class="rs-h1"><span class="rs-mask"><span style="--d:1">We Build</span></span><span class="rs-mask"><span class="rs-grad" style="--d:2">Enterprise-Grade</span></span><span class="rs-mask"><span style="--d:3">Digital Solutions</span></span></h1>
          <span class="a-line" style="--d:5;display:block;width:340px;height:6px;border-radius:6px;background:linear-gradient(90deg,#5ee0e6,#1f6fd1)"></span>
          <p class="rs-sub a-up" style="--d:6">From strategic vision to flawless execution, we architect resilient technology that powers business growth.</p>
        </div>
        <div class="rs-code">
          <div class="rs-card rs-win a-right" style="--d:3">
            <div class="rs-win-bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span>raihsoft.config.js</span></div>
            <div class="rs-lines">
<div class="a-type" style="--d:7"><span class="k">const</span> raihsoft = {</div><div class="a-type" style="--d:9">  builds: [<span class="s">'ERP'</span>, <span class="s">'Web'</span>, <span class="s">'Mobile'</span>, <span class="s">'Cloud'</span>],</div><div class="a-type" style="--d:11">  delivers: <span class="s">'secure, scalable systems'</span>,</div><div class="a-type" style="--d:13">  experience: <span class="s">'15+ years'</span>,</div><div class="a-type" style="--d:15">  focus: <span class="s">'your business growth'</span></div><div class="a-type" style="--d:17">};</div><div class="a-type" style="--d:19"><span class="f">deploy</span>(raihsoft); <span class="c">// ✓ live in production</span></div>
            </div>
          </div>
          <div class="rs-chip a-pop" style="--d:12;left:-50px;top:-36px"><span>&lt;/&gt;</span></div>
          <div class="rs-chip a-pop" style="--d:14;right:-30px;top:60px"><span style="animation-delay:.6s">AWS</span></div>
          <div class="rs-chip a-pop" style="--d:16;right:40px;bottom:-34px"><span style="animation-delay:1.1s">AI · ML</span></div>
          <div class="rs-chip a-pop" style="--d:18;left:-40px;bottom:40px"><span style="animation-delay:1.6s">API</span></div>
        </div>
      </section>

      <!-- 3 · you're watching our work -->
      <section class="rs-scene">
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:30px">
          <span class="rs-eyebrow a-left">You're watching our work</span>
          <h2 class="rs-h2" style="font-size:76px"><span class="rs-mask"><span style="--d:1">This live display is</span></span><span class="rs-mask"><span class="rs-grad" style="--d:2">built by Raihsoft.</span></span></h2>
          <ul class="rs-checks">
            <li class="a-up" style="--d:5"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3"/></svg>Online Palada orders &amp; order tracking for ILU</li>
            <li class="a-up" style="--d:7"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3"/></svg>This real-time TV dashboard</li>
            <li class="a-up" style="--d:9"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3"/></svg>RaihSuite ERP running everything behind it</li>
          </ul>
          <p class="rs-sub a-up" style="--d:11;font-size:26px">Your organisation can have the same.</p>
        </div>
        <div class="rs-stage a-tilt" style="--d:3">
          <span class="rs-badge a-pop" style="--d:12">Powered by RaihSuite ERP</span>
          <div class="rs-tv">
            <div class="tv-top"><span class="lg">ILU</span><span style="font-size:13px;font-weight:700;color:#faa70c;letter-spacing:2px">PALADA CHALLENGE</span><span class="lv"><i></i>LIVE</span></div>
            <div class="tv-body">
              <div class="tv-main">
                <div class="tv-ring"><svg width="190" height="190" viewBox="0 0 190 190" aria-hidden="true"><defs><linearGradient id="rsTvG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ea183c"/><stop offset="1" stop-color="#faa70c"/></linearGradient></defs><circle cx="95" cy="95" r="76" fill="none" stroke="rgba(255,253,247,.08)" stroke-width="18"/><circle id="rsTvRing" cx="95" cy="95" r="76" fill="none" stroke="url(#rsTvG)" stroke-width="18" stroke-linecap="round" stroke-dasharray="0 477.5" transform="rotate(-90 95 95)" style="transition:stroke-dasharray 2s cubic-bezier(.2,.8,.2,1)"/></svg><b id="rsTvPct">0%</b></div>
                <div class="tv-stats"><i></i><i></i><i></i></div>
              </div>
              <div class="tv-ads"><i style="background:linear-gradient(150deg,#ea183c,#7a0a1f)"></i><i style="background:linear-gradient(150deg,#5ee0e6,#1f6fd1)"></i></div>
            </div>
            <div class="tv-tick"><i></i><span></span></div>
          </div>
          <div class="rs-standv"></div>
          <div class="rs-phone a-right" style="--d:8"><div class="hd">ILU</div><div class="in"></div><div class="in"></div><div class="in"></div><div class="in"></div><div class="bt"></div></div>
        </div>
      </section>

      <!-- 4 · services -->
      <section class="rs-scene rs-col">
        <div class="rs-center" style="display:flex;flex-direction:column;gap:18px">
          <span class="rs-eyebrow a-up">Our services</span>
          <h2 class="rs-h2"><span class="rs-mask"><span style="--d:1">Tailored solutions for your <span class="rs-grad">digital transformation</span></span></span></h2>
        </div>
        <div class="rs-svcs">
          <div class="rs-card rs-svc a-tilt" style="--d:4"><span class="rs-ic"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg></span><h3>Custom Enterprise Software</h3><ul><li>Multi-tenant, cloud-ready apps</li><li>API &amp; integration microservices</li><li>Legacy system modernisation</li></ul></div>
          <div class="rs-card rs-svc a-tilt" style="--d:6"><span class="rs-ic"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg></span><h3>Cloud Architecture &amp; DevOps</h3><ul><li>AWS &amp; hybrid cloud migrations</li><li>Serverless &amp; microservices</li><li>CI/CD, Docker &amp; Kubernetes</li></ul></div>
          <div class="rs-card rs-svc a-tilt" style="--d:8"><span class="rs-ic"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18M7 14l4-4 4 4 5-5"/></svg></span><h3>Data Analytics &amp; AI Engineering</h3><ul><li>Real-time business intelligence</li><li>Predictive analytics &amp; ML</li><li>Intelligent process automation</li></ul></div>
          <div class="rs-card rs-svc a-tilt" style="--d:10"><span class="rs-ic"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18M9 21V9"/></svg></span><h3>UI/UX Engineering &amp; Design Systems</h3><ul><li>User research &amp; journey mapping</li><li>Wireframes, prototypes &amp; testing</li><li>Scalable design systems</li></ul></div>
          <div class="rs-card rs-svc a-tilt" style="--d:12"><span class="rs-ic"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z"/></svg></span><h3>IT &amp; Software Architecture Consulting</h3><ul><li>Technology stack audits</li><li>Technical debt assessment</li><li>Enterprise solution architecture</li></ul></div>
        </div>
      </section>

      <!-- 5 · works -->
      <section class="rs-scene rs-col" style="gap:40px">
        <div class="rs-center" style="display:flex;flex-direction:column;gap:18px">
          <span class="rs-eyebrow a-up">Our latest works</span>
          <h2 class="rs-h2"><span class="rs-mask"><span style="--d:1">Products we've <span class="rs-grad">engineered</span></span></span></h2>
        </div>
        <div class="rs-works">
          <div class="rs-card rs-work a-up" style="--d:3">
            <div class="rs-dev"><div class="rs-fl"><div class="lap">
              <div class="lap-scr"><div class="erp-top"></div><div class="erp-body"><div class="erp-side"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="erp-main"><div class="erp-kpis"><b></b><b></b><b></b></div><div class="erp-bars"><i style="--i:0;height:40%"></i><i style="--i:1;height:65%"></i><i style="--i:2;height:50%"></i><i style="--i:3;height:85%"></i><i style="--i:4;height:60%"></i><i style="--i:5;height:95%"></i><i style="--i:6;height:75%"></i></div><div class="erp-rows"><i></i><i></i><i></i></div></div></div></div>
              <div class="lap-base"></div>
              <div class="mini-ph"><i></i><b></b><b></b><b></b><b></b></div>
            </div></div></div>
            <h3>RaihSuite ERP</h3>
            <p>All-in-one ERP for Finance, HR, CRM, Inventory and Operations, with website integration, real-time leads and a white-labelled customer portal.</p>
            <div class="rs-tags"><span>ERP</span><span>CRM</span><span>Customer portal</span></div>
          </div>
          <div class="rs-card rs-work a-up" style="--d:5">
            <div class="rs-dev"><div class="rs-fl" style="animation-delay:-1.6s"><div class="mon">
              <div class="mon-scr"><div class="tz-head"></div><div class="tz-cards"><b style="--i:0"></b><b style="--i:1"></b><b style="--i:2"></b></div><div class="tz-btn"></div></div>
              <div class="mon-neck"></div><div class="mon-foot"></div>
            </div></div></div>
            <h3>Tarmeez</h3>
            <p>Institutional-grade platform for Shariah-compliant Sukuk investing and financing in Saudi Arabia, with regulatory compliance and secure transactions.</p>
            <div class="rs-tags"><span>FinTech</span><span>Saudi Arabia</span><span>Compliance</span></div>
          </div>
          <div class="rs-card rs-work a-up" style="--d:7">
            <div class="rs-dev"><div class="rs-fl" style="animation-delay:-3.2s"><div class="ez">
              <div class="ez-phone"><div class="ez-grid"><b style="--i:0;background:linear-gradient(135deg,#ff7a45,#ff3d6e)"></b><b style="--i:1;background:linear-gradient(135deg,#22c3a6,#0e9f86)"></b><b style="--i:2;background:linear-gradient(135deg,#4f8cff,#2a5bd7)"></b><b style="--i:3;background:linear-gradient(135deg,#ffb020,#ff8a00)"></b><b style="--i:4;background:linear-gradient(135deg,#8b5cf6,#6d28d9)"></b><b style="--i:5;background:linear-gradient(135deg,#06b6d4,#0284c7)"></b></div></div>
              <div class="ez-pos"><div class="ez-paper"><i></i><i style="width:70%"></i><i></i><i style="width:50%"></i><i></i><i style="width:80%"></i></div><div class="ez-posbody"><div class="ez-screen"></div><div class="ez-keys"><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b></div></div></div>
            </div></div></div>
            <h3>Ezhal</h3>
            <p>Digital recharge coupon distribution and POS for Saudi Arabia, with automated printing and real-time inventory sync.</p>
            <div class="rs-tags"><span>POS</span><span>Retail</span><span>Saudi Arabia</span></div>
          </div>
        </div>
      </section>

      <!-- 6 · why raihsoft -->
      <section class="rs-scene rs-col">
        <div style="display:flex;flex-direction:column;gap:18px">
          <span class="rs-eyebrow a-left">Why choose us</span>
          <h2 class="rs-h2"><span class="rs-mask"><span style="--d:1">Redefining software <span class="rs-grad">excellence</span></span></span></h2>
        </div>
        <div class="rs-why">
          <div class="rs-counters">
            <div class="rs-card rs-counter a-pop" style="--d:3"><span class="big rs-grad"><span data-count="15">0</span>+</span><p>Years of industry-leading engineering experience</p></div>
            <div class="rs-card rs-counter a-pop" style="--d:5"><span class="big rs-grad"><span data-count="100">0</span>%</span><p>Client-centric delivery &amp; strategic alignment</p></div>
          </div>
          <div class="rs-feats">
            <div class="rs-card rs-feat a-right" style="--d:6"><span class="rs-ic"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/></svg></span><div><h4>Cutting-edge architecture</h4><p>Modern, flexible stacks designed with the future in mind.</p></div></div>
            <div class="rs-card rs-feat a-right" style="--d:8"><span class="rs-ic"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"/></svg></span><div><h4>Rigorous enterprise security</h4><p>Authentication, encryption and compliance built into the core.</p></div></div>
            <div class="rs-card rs-feat a-right" style="--d:10"><span class="rs-ic"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5ee0e6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg></span><div><h4>Experienced technical leadership</h4><p>Senior architects who understand business logic as deeply as code.</p></div></div>
          </div>
        </div>
      </section>

      <!-- 7 · call to action -->
      <section class="rs-scene">
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:30px">
          <img class="a-wipe" src="/ilu/tv/raihsoft-logo.png" alt="Raihsoft" style="width:380px;height:auto;max-width:none">
          <h1 class="rs-h1" style="font-size:100px"><span class="rs-mask"><span style="--d:2">Ready to build</span></span><span class="rs-mask"><span class="rs-grad" style="--d:3">what's next?</span></span></h1>
          <p class="rs-sub a-up" style="--d:5">ERP, websites, mobile apps, cloud and AI, engineered for your business.</p>
          <div class="rs-contacts">
            <div class="rs-card rs-contact a-up" style="--d:6"><span class="ci"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000e52" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg></span><div><small>Call / WhatsApp</small><b>+91 98479 91099</b></div></div>
            <div class="rs-card rs-contact a-up" style="--d:7"><span class="ci"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000e52" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6"/></svg></span><div><small>Email</small><b>contact@raihsoft.com</b></div></div>
            <div class="rs-card rs-contact a-up" style="--d:8"><span class="ci"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000e52" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span><div><small>Website</small><b>www.raihsoft.com</b></div></div>
            <div class="rs-card rs-contact a-up" style="--d:9"><span class="ci"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000e52" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg></span><div><small>Visit us</small><b>Karaya, Pandikkad, Malappuram</b></div></div>
          </div>
        </div>
        <div class="rs-qr a-pop" style="--d:6">
          <div class="rs-qrcard"><div id="rsQR"></div></div>
          <span style="font-size:26px;font-weight:700;color:#e6eef8">Scan to visit <span class="rs-grad">raihsoft.com</span></span>
        </div>
      </section>
      <div class="rs-segs" id="rsSegs"></div>
    </div>

  </div>
</div>

<div id="controls" role="toolbar" aria-label="Display controls">
  <button id="bPrev" aria-label="Previous screen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>Prev</button>
  <button id="bPause" aria-pressed="false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg><span>Pause</span></button>
  <button id="bNext" aria-label="Next screen">Next<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>
  <span class="sep"></span>
  <button id="bDeliver" data-demo-only>+ Simulate delivery</button>
  <button id="bMilestone" data-demo-only>Show milestone</button>
  <button id="bAd" aria-pressed="false">Raihsoft ad</button>
  <button id="bOffline" aria-pressed="false" data-demo-only>Offline demo</button>
  <span class="sep"></span>
  <button id="bFull"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>Fullscreen</button>
</div>
`;
