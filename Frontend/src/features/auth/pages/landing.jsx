import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { gsap } from "gsap";
import "./landing.scss";


export default function Landing() {
  const canvasRef = useRef(null);

  useEffect(() => {
    /* ── Three.js Setup ── */
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    /* Particle Sphere */
    const geo = new THREE.BufferGeometry();
    const count = 2500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + (Math.random() - 0.5) * 0.4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      colors[i * 3] = 0.48 + t * 0.1;
      colors[i * 3 + 1] = 0.23 + t * 0.2;
      colors[i * 3 + 2] = 0.93 - t * 0.1;
      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) } },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        uniform vec2 uMouse;
        void main(){
          vColor = color;
          vec3 pos = position;
          float wave = sin(pos.x*1.5+uTime*.8)*cos(pos.y*1.5+uTime*.6)*.12;
          pos += normalize(pos) * wave;
          float mouseDist = length(uMouse - pos.xy);
          pos.z += sin(uTime*.5 + mouseDist) * .08;
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (280. / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main(){
          vec2 uv = gl_PointCoord - .5;
          float d = length(uv);
          if(d > .5) discard;
          float alpha = (1. - d*2.) * .85;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    /* Metallic Strands */
    const strandGeo = new THREE.BufferGeometry();
    const strandCount = 80;
    const strandPos = new Float32Array(strandCount * 6);
    for (let i = 0; i < strandCount; i++) {
      const a = (i / strandCount) * Math.PI * 2;
      const r1 = 1.8 + Math.random() * 0.4;
      const r2 = 2.2 + Math.random() * 0.4;
      strandPos[i * 6] = Math.cos(a) * r1; strandPos[i * 6 + 1] = Math.sin(a) * r1; strandPos[i * 6 + 2] = (Math.random() - 0.5) * 0.5;
      strandPos[i * 6 + 3] = Math.cos(a + 0.3) * r2; strandPos[i * 6 + 4] = Math.sin(a + 0.3) * r2; strandPos[i * 6 + 5] = (Math.random() - 0.5) * 0.5;
    }
    strandGeo.setAttribute("position", new THREE.BufferAttribute(strandPos, 3));
    const strands = new THREE.LineSegments(strandGeo, new THREE.LineBasicMaterial({ color: 0x06B6D4, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending }));
    scene.add(strands);

    /* Rings */
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.008, 16, 120), new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.4 }));
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.006, 16, 120), new THREE.MeshBasicMaterial({ color: 0x06B6D4, transparent: true, opacity: 0.3 }));
    ring2.rotation.x = -Math.PI / 6;
    ring2.rotation.y = Math.PI / 3;
    scene.add(ring2);

    /* Ambient Particles */
    const ambGeo = new THREE.BufferGeometry();
    const ambCount = 300;
    const ambPos = new Float32Array(ambCount * 3);
    const ambColors = new Float32Array(ambCount * 3);
    for (let i = 0; i < ambCount; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 12;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const t = Math.random();
      ambColors[i * 3] = t > 0.5 ? 0.48 : 0.024;
      ambColors[i * 3 + 1] = t > 0.5 ? 0.23 : 0.71;
      ambColors[i * 3 + 2] = t > 0.5 ? 0.93 : 0.83;
    }
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    ambGeo.setAttribute("color", new THREE.BufferAttribute(ambColors, 3));
    scene.add(new THREE.Points(ambGeo, new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })));

    /* Mouse tracking */
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const handleMouse = (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = -(e.clientY / window.innerHeight) * 2 + 1;
      const dot = document.getElementById("cursorDot");
      const ring = document.getElementById("cursorRing");
      if (dot) { dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; }
      if (ring) { ring.style.left = e.clientX + "px"; ring.style.top = e.clientY + "px"; }
    };
    document.addEventListener("mousemove", handleMouse);

    /* Resize */
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    /* Animation loop */
    let t = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;
      tmx += (mx - tmx) * 0.05;
      tmy += (my - tmy) * 0.05;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.set(tmx * 3, tmy * 2);
      particles.rotation.y = t * 0.08 + tmx * 0.15;
      particles.rotation.x = t * 0.04 + tmy * 0.1;
      strands.rotation.y = -t * 0.06 + tmx * 0.1;
      strands.rotation.x = t * 0.03;
      ring.rotation.z = t * 0.12;
      ring2.rotation.z = -t * 0.09;
      ring2.rotation.y = t * 0.07;
      camera.position.x = tmx * 0.3;
      camera.position.y = tmy * 0.2;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    /* GSAP hero entrance */
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to("#heroEyebrow", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
      .to("#heroTitle", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=.4")
      .to("#heroSub", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=.5")
      .to("#heroBtns", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=.4")
      .to("#heroChips", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=.2")
      .to("#scrollInd", { opacity: 1, duration: 0.6 }, "-=.2");

    /* Scroll reveal */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    /* Nav scroll */
    const handleScroll = () => {
      const nav = document.getElementById("mainNav");
      if (nav) {
        if (window.scrollY > 60) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);

    /* Cursor hover */
    const addHover = () => {
      document.querySelectorAll("a,button,.feat-card,.chip").forEach((el) => {
        el.addEventListener("mouseenter", () => document.getElementById("cursorRing")?.classList.add("hover"));
        el.addEventListener("mouseleave", () => document.getElementById("cursorRing")?.classList.remove("hover"));
      });
    };
    addHover();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      renderer.dispose();
      geo.dispose(); mat.dispose();
      strandGeo.dispose(); ambGeo.dispose();
    };
  }, []);

  return (
    <div className="landing">
      <div className="cursor-dot" id="cursorDot" />
      <div className="cursor-ring" id="cursorRing" />
      <canvas ref={canvasRef} id="hero-canvas" />
      <div className="noise" />

      {/* Navbar */}
      <nav className="ld-nav" id="mainNav">
        {/* <Link to="/" className="ld-nav__brand">
          <div className="ld-nav__logo">M</div>
          Mockly
        </Link> */}
        {/* <Link to="/" className="ld-nav__brand">
  <img
    src="/mockly_logo.png"
    alt="Mockly"
    className="ld-nav__logo"
  />
</Link> */}
<Link to="/" className="ld-nav__brand">
  <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
    <rect x="0" y="0" width="72" height="60" rx="14" fill="#185FA5"/>
    <polygon points="14,60 6,80 30,60" fill="#185FA5"/>
    <rect x="10" y="14" width="12" height="4" rx="2" fill="#E6F1FB"/>
    <rect x="10" y="24" width="22" height="4" rx="2" fill="#E6F1FB"/>
    <rect x="10" y="34" width="16" height="4" rx="2" fill="#E6F1FB"/>
    <rect x="10" y="44" width="28" height="4" rx="2" fill="#E6F1FB"/>
    <circle cx="62" cy="10" r="5" fill="#378ADD"/>
    <circle cx="62" cy="10" r="2.5" fill="#E6F1FB"/>
  </svg>
  <span style={{ fontSize: "22px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.5px" }}>
    mock<span style={{ color: "#378ADD" }}>ly</span>
  </span>
</Link>
        <div className="ld-nav__links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="ld-nav__actions">
          <Link to="/login" className="ld-btn-ghost">Login</Link>
          <Link to="/register" className="ld-btn-grad">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="ld-hero">
        <div className="ld-hero__eyebrow" id="heroEyebrow">
          <span className="ld-hero__eyebrow-dot" />
          AI Interview Intelligence
        </div>
        <h1 className="ld-hero__title" id="heroTitle">
          Practice Smarter.<br />
          <span className="ld-hero__title-grad">Interview Better.</span>
        </h1>
        <p className="ld-hero__sub" id="heroSub">
          Mockly uses AI to generate personalized interview questions, evaluate your answers,
          and build your confidence before the real thing.
        </p>
        <div className="ld-hero__btns" id="heroBtns">
          <Link to="/register" className="ld-btn-main">⚡ Start Mock Interview</Link>
          <a href="#how" className="ld-btn-outline">How it works →</a>
        </div>
        <div className="ld-hero__chips" id="heroChips">
          {["React.js", "System Design", "Behavioral", "DSA", "Node.js", "Leadership"].map((c, i) => (
            <span key={i} className="ld-chip">{c}</span>
          ))}
        </div>
        <div className="ld-scroll-ind" id="scrollInd">
          <span>Scroll</span>
          <div className="ld-scroll-line" />
        </div>
      </section>

      {/* Features */}
      <section className="ld-section reveal" id="features">
        <div className="ld-section__head">
          <div className="ld-tag">Features</div>
          <h2 className="ld-section__title">Everything you need<br />to prepare</h2>
          <p className="ld-section__sub">Every tool in Mockly is designed to make your sessions more effective.</p>
        </div>
        <div className="ld-features-grid">
          {[
            { icon: "📄", title: "Resume-Based Questions", desc: "Upload your resume and get interview questions generated specifically around your experience, skills, and target role." },
            { icon: "🎯", title: "AI Mock Interviews", desc: "Engage in realistic, adaptive interview sessions powered by AI. Practice at your own pace, as many times as you need." },
            { icon: "📊", title: "Instant Feedback", desc: "Receive detailed analysis of your answers including clarity, structure, relevance, and areas to improve — right after each session." },
          ].map((f, i) => (
            <div key={i} className="ld-feat-card">
              <div className="ld-feat-card__inner">
                <div className="ld-feat-icon">{f.icon}</div>
                <div className="ld-feat-title">{f.title}</div>
                <p className="ld-feat-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="ld-section reveal" id="how">
        <div className="ld-section__head" style={{ textAlign: "center" }}>
          <div className="ld-tag">Process</div>
          <h2 className="ld-section__title">Three steps to<br />interview-ready</h2>
        </div>
        <div className="ld-steps">
          {[
            { n: "01", icon: "📎", title: "Upload Resume", desc: "Mockly parses your resume to tailor your entire interview experience." },
            { n: "02", icon: "🎤", title: "Take Mock Interview", desc: "Answer AI-generated technical and behavioral questions tailored to your role." },
            { n: "03", icon: "🏆", title: "Get Your Score", desc: "Receive match score, skill gaps, and a personalized 7-day preparation plan." },
          ].map((s, i) => (
            <div key={i} className="ld-step">
              <div className="ld-step__num">{s.n}</div>
              <div className="ld-step__icon">{s.icon}</div>
              <div className="ld-step__title">{s.title}</div>
              <p className="ld-step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ld-cta reveal" id="contact">
        <div className="ld-cta__bg" />
        <div className="ld-cta__inner">
          <div className="ld-tag">Get Started</div>
          <h2 className="ld-cta__title">Ready to Ace Your<br />Next Interview?</h2>
          <p className="ld-cta__sub">Start practicing with Mockly and build confidence before your next opportunity.</p>
          <div className="ld-cta__btns">
            <Link to="/register" className="ld-btn-main">Get Started Free</Link>
            <Link to="/login" className="ld-btn-outline">Login</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ld-footer">
        <div className="ld-footer__brand">
          <div className="ld-footer__logo">M</div>
          Mockly
        </div>
        <div className="ld-footer__links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="ld-footer__copy">© 2025 Mockly. All rights reserved.</p>
      </footer>
    </div>
  );
}
