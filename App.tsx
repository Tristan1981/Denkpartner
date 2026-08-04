import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Linkedin, Instagram } from 'lucide-react';
import { Section } from './components/Section';
import { Button } from './components/Button';
import { IntakeForm } from './components/IntakeForm';
import { Logo } from './components/Logo';
import { AdminDashboard } from './components/AdminDashboard';
import initialContent from './content.json';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Secret Admin Access States
  const [footerClicks, setFooterClicks] = useState(0);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [view, setView] = useState<'website' | 'admin'>('website');

  // Auto-detect environment
  const isDevEnv = window.location.hostname.includes('run.app') || window.location.hostname.includes('localhost');
  const DEV_API_URL = process.env.APP_URL || 'https://ais-dev-v3bby5qldesuqpjlxsgkk3-25370465270.europe-west2.run.app';

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cmsStatus, setCmsStatus] = useState<'local' | 'remote' | 'fallback' | 'loading'>('loading');

  useEffect(() => {
    const fetchContent = async () => {
      const cacheBuster = `?t=${Date.now()}`;
      
      // 1. Try local API (works here in the dev environment)
      try {
        const response = await fetch(`/api/content${cacheBuster}`);
        if (response.ok) {
          const data = await response.json();
          console.log('CMS: Loaded content from local API');
          setContent(data);
          setCmsStatus('local');
          setLoading(false);
          return;
        }
      } catch (e) { /* ignore */ }

      // 2. Try remote Dev API (works on GitHub Pages to pull live data from here)
      try {
        console.log(`CMS: Attempting to fetch from ${DEV_API_URL}`);
        const response = await fetch(`${DEV_API_URL}/api/content${cacheBuster}`, {
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('CMS: Loaded content from remote Dev API');
          setContent(data);
          setCmsStatus('remote');
          setLoading(false);
          return;
        } else {
          console.warn('CMS: Remote Dev API returned error', response.status);
        }
      } catch (e) { 
        console.error('CMS: Failed to fetch from remote Dev API', e);
      }
      
      // 3. Fallback to bundled JSON
      console.log('CMS: Falling back to bundled content.json');
      setContent(initialContent);
      setCmsStatus('fallback');
      setLoading(false);
    };
    fetchContent();
  }, []);

  // Handle secret footer click
  const handleFooterClick = () => {
    if (!isDevEnv) return; // Disable admin access on GitHub Pages
    
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);
    if (newCount >= 15) {
      setShowAdminLink(true);
    }
  };

  // CMS Save Handler
  const handleSaveContent = async (newData: any) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        throw new Error('Failed to save content');
      }
      setContent(newData);
    } catch (error) {
      console.error('Failed to save content:', error);
      throw error; // Re-throw so AdminDashboard can handle it
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (content && content.theme) {
      const root = document.documentElement;
      root.style.setProperty('--font-sans-dynamic', `"${content.theme.fontSans}"`);
      root.style.setProperty('--font-serif-dynamic', `"${content.theme.fontSerif}"`);
      root.style.setProperty('--base-font-size', `${content.theme.baseFontSize}px`);
      
      // Load fonts if they are from Google Fonts
      const fontsToLoad = [content.theme.fontSans, content.theme.fontSerif];
      fontsToLoad.forEach(font => {
        if (font && !document.getElementById(`font-${font}`)) {
          const link = document.createElement('link');
          link.id = `font-${font}`;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
          document.head.appendChild(link);
        }
      });
    }
  }, [content]);

  // If loading or no content, show loading screen
  if (loading || !content) {
    return <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">Laden (v2)...</div>;
  }

  // If Admin View is active, render Dashboard instead of Website
  if (view === 'admin') {
    return (
      <AdminDashboard 
        initialContent={content}
        onSave={handleSaveContent}
        onExit={() => setView('website')}
      />
    );
  }

  return (
    <div className="bg-brand-black text-brand-white font-sans selection:bg-brand-white selection:text-brand-black">
      
      {/* NAVIGATION */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen ? 'bg-brand-black border-b border-brand-border py-4' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="z-50 relative group">
            {/* Logo adapts: Invert (White) when at top (dark bg), Normal (Black) when scrolled (white bg) */}
            <div className={`transition-all duration-500 transform ${scrolled ? 'scale-90 md:scale-100' : 'scale-125 md:scale-150'} ${!scrolled && !mobileMenuOpen ? 'brightness-0 invert' : ''}`}>
              <Logo scrolled={scrolled} />
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8">
            {content.navigation.map((link: any) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-xs uppercase tracking-[0.15em] font-semibold relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:transition-all after:duration-300 hover:after:w-full transition-colors ${
                  scrolled ? 'text-brand-grey hover:text-brand-white after:bg-brand-white' : 'text-white/80 hover:text-white after:bg-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`lg:hidden z-50 focus:outline-none transition-colors ${scrolled || mobileMenuOpen ? 'text-brand-white' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-brand-black z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-500 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {content.navigation.map((link: any) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-2xl uppercase tracking-widest font-serif text-brand-white hover:text-brand-grey transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO SECTION - FULLSCREEN BACKGROUND IMAGE */}
      <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 z-0 overflow-hidden bg-brand-black">
          <img
            src="https://i.imgur.com/mUrRzIp.jpg"
            alt="Portret van Tristan Wiering"
            className="w-full h-full object-cover object-[center_25%]"
          />
          {/* Subtiele egale overlay (30%) - Iets donkerder voor betere leesbaarheid */}
          <div className="absolute inset-0 bg-black/30" />
          {/* Lichte linkse fade voor leesbaarheid tekst (25%) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />
        </div>

        {/* Content Container (Left Aligned, White Text) */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full pt-32 md:pt-20 pb-16">
          <div className="md:w-2/3 lg:w-1/2 flex flex-col gap-8 animate-fade-in-up">
            
            <div className="flex flex-col gap-8">
              {/* Main Headline */}
              <h1 className="order-1 md:order-2 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight md:leading-[1.1] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {content.hero.title.split(' ').map((word: string, i: number) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    <span className={i > 0 ? "text-white" : ""}>{word}</span>
                  </React.Fragment>
                ))}
              </h1>

              {/* Roles Line */}
              <div className="order-2 md:order-1 flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-2 md:gap-4 text-[10px] sm:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase text-white font-bold mb-2 md:mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                {content.hero.roles.map((role: string, i: number) => (
                  <React.Fragment key={i}>
                    <span className="shrink-0">{role}</span>
                    {i < content.hero.roles.length - 1 && <span className="w-1 h-1 bg-white rounded-full shrink-0"></span>}
                  </React.Fragment>
                ))}
              </div>

              <div className="order-3 space-y-6 md:space-y-8">
                {/* Motto */}
                <p className="text-lg sm:text-xl md:text-2xl text-white font-serif italic border-l-2 border-white pl-5 sm:pl-6 py-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  "Rust, Ruimte, Richting"
                </p>

                {/* Subtext */}
                <h2 className="text-base sm:text-lg md:text-xl text-white/95 max-w-lg leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  {content.hero.subtitle}
                </h2>

                <p className="text-xs sm:text-sm md:text-base text-white/90 italic max-w-lg drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  {content.hero.intro}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4">
                  <Button
                    onClick={(e) => scrollToSection(e as any, '#contact')}
                    className="!text-white hover:!border-white/80 hover:!text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
                  >
                    Plan een kennismaking
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={(e) => scrollToSection(e as any, '#jij')}
                    className="!text-white hover:!border-white/80 hover:!text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
                  >
                    Lees meer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC SECTIONS */}
      {content.sections?.filter((s: any) => s.visible !== false).map((section: any) => {
        switch (section.id) {
          case 'jij':
            return (
              <React.Fragment key="jij">
                <Section id="jij" className="pt-10 pb-8">
                  <div className="grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                      <h2 className="text-6xl md:text-8xl font-bold text-brand-border sticky top-20 select-none">{content.jij.title}</h2>
                    </div>
                    <div className="md:col-span-8 space-y-6 text-lg md:text-xl text-brand-grey leading-relaxed">
                      <p className="font-semibold text-brand-white whitespace-pre-line">{content.jij.intro}</p>
                      <p className="whitespace-pre-line">{content.jij.p1}</p>
                      <p className="whitespace-pre-line">{content.jij.p2}</p>
                      <p className="whitespace-pre-line">{content.jij.p3}</p>
                      <p className="whitespace-pre-line">{content.jij.p4}</p>
                      <div className="bg-brand-black p-8 border-l-2 border-brand-white my-8">
                        <p className="text-xl text-brand-white italic">
                          "{content.jij.quote}"
                        </p>
                      </div>
                      <p className="font-bold text-brand-white text-xl">{content.jij.helderheid}</p>
                      <p>{content.jij.meelopen}</p>
                    </div>
                  </div>
                </Section>
                <div className="w-full h-px bg-brand-border my-6"></div>
              </React.Fragment>
            );
          case 'wij':
            return (
              <React.Fragment key="wij">
                <Section id="wij">
                  <div className="grid md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-7 order-2 md:order-1 space-y-6 text-lg md:text-xl text-brand-grey leading-relaxed">
                      <h3 className="text-3xl font-serif text-brand-white mb-6">{content.wij.subtitle}</h3>
                      <p className="whitespace-pre-line">{content.wij.p1}</p>
                      <p className="whitespace-pre-line">{content.wij.p2}</p>
                      <p className="whitespace-pre-line">{content.wij.p3}</p>
                      <p className="whitespace-pre-line">{content.wij.p4}</p>
                      <p className="font-semibold text-brand-white whitespace-pre-line">{content.wij.footer}</p>
                    </div>
                    <div className="md:col-span-5 order-1 md:order-2 text-right">
                      <h2 className="text-6xl md:text-8xl font-bold text-brand-border select-none">{content.wij.title}</h2>
                    </div>
                  </div>
                </Section>
                <div className="w-full h-px bg-brand-border my-6"></div>
              </React.Fragment>
            );
          case 'ik':
            return (
              <React.Fragment key="ik">
                <Section id="ik">
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div>
                      <h2 className="text-6xl md:text-8xl font-bold mb-6 text-brand-border">{content.ik.title}</h2>
                    </div>
                    
                    <div className="text-lg md:text-xl leading-relaxed text-brand-grey space-y-6">
                      <p className="whitespace-pre-line">{content.ik.intro}</p>
                      
                      <div className="grid md:grid-cols-3 gap-6 py-6">
                        <div className="p-6 border-l border-brand-border hover:border-brand-black transition-colors duration-300">
                          <h3 className="text-brand-white font-bold text-3xl mb-2">{content.ik.rust_title}</h3>
                          <p className="text-brand-grey text-lg md:text-xl leading-relaxed">{content.ik.rust}</p>
                        </div>
                        <div className="p-6 border-l border-brand-border hover:border-brand-black transition-colors duration-300">
                          <h3 className="text-brand-white font-bold text-3xl mb-2">{content.ik.ruimte_title}</h3>
                          <p className="text-brand-grey text-lg md:text-xl leading-relaxed">{content.ik.ruimte}</p>
                        </div>
                        <div className="p-6 border-l border-brand-border hover:border-brand-black transition-colors duration-300">
                          <h3 className="text-brand-white font-bold text-3xl mb-2">{content.ik.richting_title}</h3>
                          <p className="text-brand-grey text-lg md:text-xl leading-relaxed">{content.ik.richting}</p>
                        </div>
                      </div>

                      <p className="whitespace-pre-line">{content.ik.p1}</p>
                      <p className="whitespace-pre-line">{content.ik.p2}</p>
                      <p className="text-2xl font-serif text-brand-white italic pt-8 whitespace-pre-line">
                        "{content.ik.quote}"
                      </p>
                    </div>
                  </div>
                </Section>
                <div className="w-full h-px bg-brand-border my-6"></div>
              </React.Fragment>
            );
          case 'resultaten':
            return (
              <React.Fragment key="resultaten">
                <Section id="resultaten">
                  <div className="grid md:grid-cols-2 gap-16">
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-brand-white opacity-100"></div>
                      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-brand-white opacity-100"></div>
                      <div className="p-12 h-full flex items-center justify-center">
                        <h2 className="text-4xl md:text-5xl font-serif text-brand-white text-center leading-normal">
                          {content.resultaten.title.split(' ').map((word: string, i: number) => (
                            <React.Fragment key={i}>
                              {word === 'samenwerking' ? <><br/><span className="text-brand-grey">{word}</span><br/></> : word + ' '}
                            </React.Fragment>
                          ))}
                        </h2>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <ul className="list-none m-0 p-0 text-lg md:text-xl text-brand-grey">
                        {content.resultaten.items.map((item: string, idx: number) => (
                          <li key={idx} className="relative pl-[1.6rem] mb-[1.1rem] leading-[1.65] before:absolute before:content-[''] before:left-0 before:top-[0.55rem] before:w-[6px] before:h-[6px] before:bg-brand-white before:rounded-full">
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-8 mt-8 border-t border-brand-border">
                        <p className="text-xl text-brand-white whitespace-pre-line">
                          {content.resultaten.footer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Section>
                <div className="w-full h-px bg-brand-border my-8"></div>
              </React.Fragment>
            );
          case 'aanbod':
            return (
              <React.Fragment key="aanbod">
                <Section id="aanbod" className="pt-8 md:pt-10">
                  <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-white">{content.aanbod.title}</h2>
                    <p className="text-brand-grey text-lg md:text-xl leading-relaxed whitespace-pre-line">
                      {content.aanbod.intro}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.pricing.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="p-10 flex flex-col gap-4 border-t border-brand-border"
                      >
                        <h3 className="text-xl font-bold text-brand-white">
                          {item.title}
                        </h3>
                        <div className={`font-serif text-brand-white ${item.price.length > 12 ? 'text-lg md:text-xl' : 'text-3xl'}`}>
                          {item.price}
                        </div>
                        <p className="text-brand-grey text-sm leading-relaxed">
                          {item.description}
                        </p>
                        {item.subtext && (
                          <p className="text-xs italic text-brand-accent mt-1">
                            {item.subtext}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 text-center text-sm text-brand-accent space-y-2">
                    <p>* Alle prijzen zijn excl. BTW.</p>
                  </div>
                </Section>
                <div className="w-full h-px bg-brand-border my-6"></div>
              </React.Fragment>
            );
          case 'over-mij':
            return (
              <React.Fragment key="over-mij">
                <Section id="over-mij">
                  <div className="grid lg:grid-cols-12 gap-16">
                    
                    {/* Left Column: Story */}
                    <div className="lg:col-span-7">
                      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-brand-white">{content.overmij.title}</h2>
                      
                      <div className="flex flex-col md:flex-row items-start gap-8 max-w-[760px]">
                        <div className="shrink-0 w-full md:w-[260px]">
                          <img 
                            src="https://i.imgur.com/mUrRzIp.jpg" 
                            alt="Portret van Tristan Wiering" 
                            className="w-full rounded-[10px] object-cover shadow-sm mt-1"
                          />
                        </div>

                        <div className="flex-1 max-w-[480px] text-lg md:text-xl leading-relaxed text-brand-grey space-y-6 font-normal">
                          <p>{content.overmij.p1}</p>
                          <p>{content.overmij.p2}</p>
                          <p>{content.overmij.p3}</p>
                          <p>{content.overmij.p4}</p>
                          <p className="font-serif italic text-brand-white text-xl pt-2">
                            {content.overmij.footer}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Relevante Opleidingen (Replaced Locatie position) */}
                    <div className="lg:col-span-5 space-y-12 mt-6">
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-wider mb-6 text-brand-white">Relevante Opleidingen</h3>
                        
                        <div className="mt-10 border-l-2 border-brand-border pl-6 flex flex-col gap-9">
                          {content.education.map((edu: any, idx: number) => (
                            <div key={idx} className="relative">
                              <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-brand-white rounded-full"></div>
                              <div>
                                <div className="text-sm text-brand-accent tracking-[0.5px] mb-1 uppercase">
                                  {edu.year}
                                </div>
                                <div className="font-semibold text-base text-brand-white mb-0.5">
                                  {edu.title}
                                </div>
                                {edu.institution && (
                                  <div className="text-sm text-gray-500">
                                    {edu.institution}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
                <div className="w-full h-px bg-brand-border my-6"></div>
              </React.Fragment>
            );
          case 'contact':
            return (
              <React.Fragment key="contact">
                <Section id="contact" className="relative">
                  <div className="grid lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                      <h2 className="text-4xl md:text-5xl font-bold text-brand-white">{content.contact.title}</h2>
                      <p className="text-lg md:text-xl text-brand-grey leading-relaxed whitespace-pre-line">
                        {content.contact.p1}
                      </p>
                      <div className="h-px w-24 bg-brand-white"></div>
                      <p className="text-lg md:text-xl text-brand-white leading-relaxed whitespace-pre-line">
                        {content.contact.p2}
                      </p>
                      <p className="text-sm text-brand-accent italic">Vertrouwelijkheid en discretie zijn vanzelfsprekend.</p>
                      
                      {/* LOCATIE moved from Over Mij */}
                      <div className="pt-8">
                          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-brand-white flex items-center gap-2">
                            <MapPin size={20} /> LOCATIE
                          </h3>
                          <p className="text-lg md:text-xl text-brand-grey leading-relaxed">
                            {content.contact.location}
                          </p>
                          <p className="text-sm text-brand-accent italic mt-2">
                            Bij intensieve trajecten of noodsituaties zijn andere opties mogelijk.
                          </p>
                      </div>

                      <div className="pt-8 flex gap-4">
                          <a 
                            href="https://www.linkedin.com/in/tristan-w-57402b6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 border border-brand-border rounded-full hover:border-brand-white hover:text-brand-black text-brand-grey transition-all"
                          >
                            <Linkedin size={24} />
                          </a>
                          <a 
                            href="https://www.instagram.com/tristanwiering" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 border border-brand-border rounded-full hover:border-brand-white hover:text-brand-black text-brand-grey transition-all"
                          >
                            <Instagram size={24} />
                          </a>
                      </div>
                    </div>

                    <div className="relative">
                      <IntakeForm />
                    </div>
                  </div>
                </Section>
              </React.Fragment>
            );
          default:
            return null;
        }
      })}

      {/* FOOTER */}
      <footer className="bg-brand-black py-12 border-t border-brand-border text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <Logo className="h-12 md:h-14 opacity-60" />
          <p 
            className="text-xs text-brand-accent tracking-widest cursor-text select-none flex flex-col items-center gap-2"
            onClick={handleFooterClick}
          >
            <span>&copy; {new Date().getFullYear()} Tristan Wiering - Inner Leadership. Alle rechten voorbehouden.</span>
          </p>
          
          {/* Secret Admin Link */}
          {showAdminLink && (
            <button 
              onClick={() => setView('admin')}
              className="mt-4 text-xs font-bold text-brand-white bg-brand-border px-3 py-1 rounded hover:bg-brand-grey hover:text-brand-black transition-colors animate-fade-in"
            >
              Ga naar Backend (/admin)
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;