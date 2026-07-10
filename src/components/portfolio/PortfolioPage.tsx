"use client";

import Script from "next/script";
import { useEffect } from "react";

export function PortfolioPage() {
  useEffect(() => {
    document.documentElement.classList.add("portfolio-root");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/style.css";
    link.id = "portfolio-styles";
    if (!document.getElementById("portfolio-styles")) {
      document.head.appendChild(link);
    }
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500;700&display=swap";
    fontLink.id = "portfolio-fonts";
    if (!document.getElementById("portfolio-fonts")) {
      document.head.appendChild(fontLink);
    }
    return () => {
      document.documentElement.classList.remove("portfolio-root");
    };
  }, []);

  return (
    <>
      <div className="portfolio-site">
        <div className="noise" aria-hidden="true" />
        <div className="cursor-glow" id="cursorGlow" aria-hidden="true" />
        <div className="float-orbs" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
        </div>

        <div className="preloader" id="preloader">
          <div className="preloader-inner">
            <div className="preloader-bar"><span /></div>
            <p className="preloader-text">Loading portfolio<span className="dots" /></p>
            <p className="preloader-sub">Building something worth showing.</p>
          </div>
        </div>

        <div className="scroll-progress" aria-hidden="true">
          <div className="scroll-progress-fill" id="scrollProgress" />
        </div>

        <header className="nav" id="nav">
          <nav className="nav-inner">
            <a href="#hero" className="logo" aria-label="Kartavya Pathak home">
              <span className="logo-mark">KP</span>
              <span className="logo-text">kartavyapathak<span className="logo-dot">.com</span></span>
            </a>
            <button className="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
              <span /><span /><span />
            </button>
            <ul className="nav-links" id="navLinks">
              <li><a href="#skills">Stack</a></li>
              <li><a href="/tools">Tools</a></li>
              <li><a href="#certifications">Certs</a></li>
              <li><a href="#contact" className="nav-cta">Contact</a></li>
            </ul>
          </nav>
        </header>

        <main dangerouslySetInnerHTML={{ __html: PORTFOLIO_MAIN }} />

        <div className="chatbot" id="chatbot" dangerouslySetInnerHTML={{ __html: PORTFOLIO_CHATBOT }} />
      </div>

      <Script src="/js/config.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
      <Script src="/js/monkeytype.js" strategy="afterInteractive" />
      <Script src="/js/chatbot.js" strategy="afterInteractive" />
    </>
  );
}

const PORTFOLIO_MAIN = `<!-- content loaded from legacy template -->`;
