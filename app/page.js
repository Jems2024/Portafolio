'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Play, Mail, Instagram, Linkedin, MessageCircle, MapPin, Plus, Minus, X, Calendar, ExternalLink } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { PROJECTS, REAL_CLIENTS, BLOG_POSTS } from '@/lib/projects'

/* ---------- i18n ---------- */
const T = {
  es: {
    nav: { work: 'Proyectos', about: 'Sobre mí', services: 'Servicios', process: 'Proceso', blog: 'Blog', contact: 'Contacto' },
    hero: {
      eyebrow: 'Filmmaker · Barcelona',
      title1: 'Stories that move people.',
      title2: 'Films that grow brands.',
      sub: 'Producción audiovisual cinematográfica para marcas premium, agencias creativas y productoras internacionales.',
      cta1: 'Ver Proyectos',
      cta2: 'Trabajemos juntos',
      scroll: 'Desplázate',
    },
    marquee: 'Disponible para proyectos · Barcelona · Worldwide · Comercial · Documental · Eventos ·',
    about: {
      kicker: '01 — Sobre mí',
      title: 'Cine, marca y verdad en cada frame.',
      body1: 'Soy Jared Duron, filmmaker y fotógrafo con base en Barcelona. Originario de Honduras, dirijo, filmo y edito historias cinematográficas para marcas globales, agencias creativas y productoras internacionales.',
      body2: 'He trabajado con clientes como John Deere, Dior, WWF, KNX y Messe Frankfurt, cubriendo desde eventos internacionales (ISE Barcelona, Light + Building Frankfurt) hasta documental humano, fotografía comercial y contenido de marca. Cada proyecto es una oportunidad para construir imagen memorable con narrativa, luz y ritmo.',
      stats: [
        { n: '120+', l: 'Proyectos entregados' },
        { n: '9', l: 'Años de experiencia' },
        { n: '15+', l: 'Países filmados' },
        { n: '40+', l: 'Marcas premium' },
      ],
    },
    work: {
      kicker: '02 — Selected Work',
      title: 'Trabajo seleccionado',
      sub: 'Una selección de campañas comerciales, documentales y coberturas internacionales.',
    },
    services: {
      kicker: '03 — Servicios',
      title: 'De la idea al máster final.',
      items: [
        { t: 'Producción Audiovisual', d: 'Preproducción, rodaje y postproducción integral con un equipo cinematográfico de primer nivel.' },
        { t: 'Publicidad & Brand Films', d: 'Spots, campañas y películas de marca que conectan emocionalmente y generan resultados medibles.' },
        { t: 'Contenido para Redes', d: 'Verticales optimizados para Meta, TikTok y YouTube con lenguaje cinematográfico.' },
        { t: 'Documentales', d: 'Historias humanas contadas con sensibilidad, rigor y ritmo cinematográfico.' },
        { t: 'Eventos Internacionales', d: 'Cobertura audiovisual de conferencias, lanzamientos y activaciones de marca.' },
        { t: 'Fotografía Comercial', d: 'Dirección de fotografía y still photography con estética editorial premium.' },
        { t: 'Vídeo Corporativo', d: 'Recruitment films, culture videos y presentaciones ejecutivas para empresas tecnológicas.' },
        { t: 'Color Grading', d: 'Etalonaje cinematográfico en DaVinci Resolve con LUTs personalizados.' },
        { t: 'Motion Graphics', d: 'Diseño de movimiento, títulos y animación 2D para reforzar la narrativa.' },
      ],
    },
    process: {
      kicker: '04 — Proceso',
      title: 'Un método probado.',
      steps: [
        { n: '01', t: 'Discovery', d: 'Entendemos el brief, los objetivos y la audiencia. Definimos KPI y tono.' },
        { n: '02', t: 'Concepto', d: 'Tratamiento creativo, moodboard, guion y referencias cinematográficas.' },
        { n: '03', t: 'Preproducción', d: 'Casting, locations, equipo, permisos, storyboard y plan de rodaje.' },
        { n: '04', t: 'Rodaje', d: 'Dirección con equipo cinematográfico: RED, ARRI, ópticas Zeiss/Cooke.' },
        { n: '05', t: 'Postproducción', d: 'Edición, color grading, sound design, mezcla y motion graphics.' },
        { n: '06', t: 'Delivery', d: 'Másteres para todos los formatos y adaptaciones para cada canal.' },
      ],
    },
    clients: { kicker: '05 — Clientes', title: 'Confían en el trabajo.' },
    testimonials: {
      kicker: '06 — Testimonios',
      title: 'Lo que dicen los clientes.',
      items: [
        { q: 'Jared entiende la marca desde el primer briefing. El resultado superó todo lo que teníamos en mente.', a: 'Laia Serra', r: 'Head of Brand · Startup B2B Barcelona' },
        { q: 'La cinematografía y el ritmo narrativo son de otro nivel. Un profesional al que volveríamos a contratar sin dudar.', a: 'Marc Puig', r: 'Creative Director · Agencia de publicidad' },
        { q: 'Cubrió nuestro evento internacional con una sensibilidad documental impresionante. Material listo en tiempo récord.', a: 'Elena Rossi', r: 'Event Producer · Milano' },
      ],
    },
    faq: {
      kicker: '07 — FAQ',
      title: 'Preguntas frecuentes.',
      items: [
        { q: '¿Dónde estás basado y viajas para proyectos?', a: 'Estoy basado en Barcelona y viajo regularmente por España, Europa y proyectos internacionales. Trabajo con equipos locales en cada destino.' },
        { q: '¿Cuánto cuesta un vídeo corporativo o una campaña?', a: 'Cada proyecto se cotiza según brief, días de rodaje, equipo y postproducción. Los proyectos típicos van desde 3.000€ hasta producciones publicitarias de +50.000€.' },
        { q: '¿Cuál es el plazo de entrega habitual?', a: 'Un vídeo corporativo suele entregarse en 3-4 semanas. Campañas publicitarias entre 6-10 semanas dependiendo del alcance.' },
        { q: '¿Trabajas con agencias y productoras?', a: 'Sí. Colaboro como director, DoP o filmmaker freelance con agencias creativas y productoras nacionales e internacionales.' },
        { q: '¿Qué equipo utilizas para rodar?', a: 'Cámaras RED Komodo, Sony FX6/FX3, ópticas Zeiss Supreme y Cooke, gimbals Ronin, iluminación Aputure/ARRI y grip profesional.' },
      ],
    },
    contact: {
      kicker: '08 — Contacto',
      title: 'Trabajemos juntos.',
      sub: 'Cuéntame sobre tu proyecto. Respondo en menos de 24 horas.',
      name: 'Nombre', email: 'Email', company: 'Empresa', budget: 'Presupuesto', type: 'Tipo de proyecto', message: 'Cuéntame tu proyecto',
      send: 'Enviar mensaje', sending: 'Enviando…', success: 'Mensaje enviado. Te respondo en breve.', error: 'Algo falló. Escribe a hello@jaredduron.com',
      types: ['Publicidad / Brand film', 'Vídeo corporativo', 'Documental', 'Evento', 'Redes sociales', 'Otro'],
      budgets: ['< 5.000€', '5.000€ - 15.000€', '15.000€ - 50.000€', '+ 50.000€'],
    },
    footer: {
      tagline: 'Cinematic video production. Made in Barcelona.',
      rights: 'Todos los derechos reservados.',
    },
  },
  en: {
    nav: { work: 'Work', about: 'About', services: 'Services', process: 'Process', blog: 'Journal', contact: 'Contact' },
    hero: {
      eyebrow: 'Filmmaker · Barcelona',
      title1: 'Stories that move people.',
      title2: 'Films that grow brands.',
      sub: 'Cinematic video production for premium brands, creative agencies and international production houses.',
      cta1: 'View Work', cta2: "Let's Work Together", scroll: 'Scroll',
    },
    marquee: 'Available for projects · Barcelona · Worldwide · Commercial · Documentary · Events ·',
    about: {
      kicker: '01 — About',
      title: 'Cinema, brand and truth in every frame.',
      body1: "I'm Jared Duron, a filmmaker and photographer based in Barcelona. Originally from Honduras, I direct, shoot and edit cinematic stories for global brands, creative agencies and international production houses.",
      body2: 'I have worked with clients like John Deere, Dior, WWF, KNX and Messe Frankfurt, covering everything from international events (ISE Barcelona, Light + Building Frankfurt) to human documentary, commercial photography and brand content.',
      stats: [
        { n: '120+', l: 'Projects delivered' }, { n: '9', l: 'Years of experience' }, { n: '15+', l: 'Countries filmed' }, { n: '40+', l: 'Premium brands' },
      ],
    },
    work: { kicker: '02 — Selected Work', title: 'Selected Work', sub: 'A curated selection of commercial campaigns, documentaries and international coverage.' },
    services: {
      kicker: '03 — Services',
      title: 'From idea to final master.',
      items: [
        { t: 'Video Production', d: 'End-to-end pre-production, shooting and post with a top-tier cinematic crew.' },
        { t: 'Advertising & Brand Films', d: 'Spots, campaigns and brand films that connect emotionally and drive measurable results.' },
        { t: 'Social Content', d: 'Verticals optimized for Meta, TikTok and YouTube with cinematic language.' },
        { t: 'Documentary', d: 'Human stories told with sensitivity, rigor and cinematic pace.' },
        { t: 'International Events', d: 'Audiovisual coverage of conferences, launches and brand activations.' },
        { t: 'Commercial Photography', d: 'Direction of photography and still photography with premium editorial aesthetic.' },
        { t: 'Corporate Video', d: 'Recruitment films, culture videos and executive presentations for tech companies.' },
        { t: 'Color Grading', d: 'Cinematic grading in DaVinci Resolve with custom LUTs.' },
        { t: 'Motion Graphics', d: 'Motion design, titles and 2D animation to reinforce the narrative.' },
      ],
    },
    process: {
      kicker: '04 — Process', title: 'A proven method.',
      steps: [
        { n: '01', t: 'Discovery', d: 'We understand the brief, goals and audience. Define KPIs and tone.' },
        { n: '02', t: 'Concept', d: 'Creative treatment, moodboard, script and cinematic references.' },
        { n: '03', t: 'Pre-production', d: 'Casting, locations, crew, permits, storyboard and shooting plan.' },
        { n: '04', t: 'Shooting', d: 'Directing with a cinematic crew: RED, ARRI, Zeiss/Cooke optics.' },
        { n: '05', t: 'Post-production', d: 'Editing, color grading, sound design, mix and motion graphics.' },
        { n: '06', t: 'Delivery', d: 'Masters for all formats and adaptations for each channel.' },
      ],
    },
    clients: { kicker: '05 — Clients', title: 'Trusted work.' },
    testimonials: {
      kicker: '06 — Testimonials', title: 'What clients say.',
      items: [
        { q: 'Jared understood the brand from the first briefing. The result surpassed everything we had in mind.', a: 'Laia Serra', r: 'Head of Brand · B2B Startup Barcelona' },
        { q: 'The cinematography and narrative pace are on another level. A professional we would hire again without hesitation.', a: 'Marc Puig', r: 'Creative Director · Advertising agency' },
        { q: 'He covered our international event with impressive documentary sensitivity. Material delivered in record time.', a: 'Elena Rossi', r: 'Event Producer · Milano' },
      ],
    },
    faq: {
      kicker: '07 — FAQ', title: 'Frequently asked.',
      items: [
        { q: 'Where are you based and do you travel?', a: 'Based in Barcelona and traveling regularly across Spain, Europe and international projects. I work with local crews in each destination.' },
        { q: 'How much does a corporate video or a campaign cost?', a: 'Each project is quoted based on brief, shoot days, crew and post-production. Typical projects range from €3,000 to advertising productions of €50,000+.' },
        { q: 'What is the usual delivery timeline?', a: 'A corporate video is usually delivered in 3-4 weeks. Advertising campaigns between 6-10 weeks depending on scope.' },
        { q: 'Do you work with agencies and production companies?', a: 'Yes. I collaborate as director, DoP or freelance filmmaker with national and international creative agencies and production houses.' },
        { q: 'What gear do you shoot with?', a: 'RED Komodo, Sony FX6/FX3, Zeiss Supreme and Cooke optics, Ronin gimbals, Aputure/ARRI lighting and pro grip.' },
      ],
    },
    contact: {
      kicker: '08 — Contact', title: "Let's work together.", sub: 'Tell me about your project. I reply within 24 hours.',
      name: 'Name', email: 'Email', company: 'Company', budget: 'Budget', type: 'Project type', message: 'Tell me about your project',
      send: 'Send message', sending: 'Sending…', success: 'Message sent. I will reply soon.', error: 'Something failed. Write to hello@jaredduron.com',
      types: ['Advertising / Brand film', 'Corporate video', 'Documentary', 'Event', 'Social media', 'Other'],
      budgets: ['< €5k', '€5k - €15k', '€15k - €50k', '€50k+'],
    },
    footer: { tagline: 'Cinematic video production. Made in Barcelona.', rights: 'All rights reserved.' },
  },
  ca: {
    nav: { work: 'Projectes', about: 'Sobre mi', services: 'Serveis', process: 'Procés', blog: 'Blog', contact: 'Contacte' },
    hero: {
      eyebrow: 'Filmmaker · Barcelona',
      title1: 'Històries que emocionen.',
      title2: 'Pel·lícules que fan créixer marques.',
      sub: 'Producció audiovisual cinematogràfica per a marques premium, agències creatives i productores internacionals.',
      cta1: 'Veure Projectes', cta2: 'Treballem junts', scroll: 'Baixa',
    },
    marquee: 'Disponible per a projectes · Barcelona · Worldwide · Comercial · Documental · Esdeveniments ·',
    about: {
      kicker: '01 — Sobre mi', title: 'Cinema, marca i veritat a cada frame.',
      body1: 'Sóc Jared Duron, filmmaker amb base a Barcelona. Dirigeixo, filmo i edito històries cinematogràfiques per a marques, agències i productores que volen elevar la seva comunicació audiovisual.',
      body2: "El meu treball es mou entre la publicitat comercial, el documental humà i la cobertura d'esdeveniments internacionals. Cada projecte és una oportunitat per construir una imatge memorable.",
      stats: [
        { n: '120+', l: 'Projectes lliurats' }, { n: '9', l: "Anys d'experiència" }, { n: '15+', l: 'Països filmats' }, { n: '40+', l: 'Marques premium' },
      ],
    },
    work: { kicker: '02 — Selected Work', title: 'Treball seleccionat', sub: 'Una selecció de campanyes comercials, documentals i cobertures internacionals.' },
    services: {
      kicker: '03 — Serveis', title: 'De la idea al màster final.',
      items: [
        { t: 'Producció Audiovisual', d: 'Preproducció, rodatge i postproducció integral amb un equip cinematogràfic de primer nivell.' },
        { t: 'Publicitat & Brand Films', d: 'Espots, campanyes i pel·lícules de marca que connecten emocionalment.' },
        { t: 'Contingut per a Xarxes', d: 'Verticals optimitzats per a Meta, TikTok i YouTube amb llenguatge cinematogràfic.' },
        { t: 'Documentals', d: 'Històries humanes explicades amb sensibilitat, rigor i ritme cinematogràfic.' },
        { t: 'Esdeveniments Internacionals', d: 'Cobertura audiovisual de conferències, llançaments i activacions de marca.' },
        { t: 'Fotografia Comercial', d: 'Direcció de fotografia i still photography amb estètica editorial premium.' },
        { t: 'Vídeo Corporatiu', d: 'Recruitment films, culture videos i presentacions executives per a empreses tecnològiques.' },
        { t: 'Color Grading', d: 'Etalonatge cinematogràfic en DaVinci Resolve amb LUTs personalitzats.' },
        { t: 'Motion Graphics', d: 'Disseny de moviment, títols i animació 2D per reforçar la narrativa.' },
      ],
    },
    process: {
      kicker: '04 — Procés', title: 'Un mètode provat.',
      steps: [
        { n: '01', t: 'Discovery', d: 'Entenem el brief, els objectius i el públic. Definim KPI i to.' },
        { n: '02', t: 'Concepte', d: 'Tractament creatiu, moodboard, guió i referències cinematogràfiques.' },
        { n: '03', t: 'Preproducció', d: 'Càsting, localitzacions, equip, permisos, storyboard i pla de rodatge.' },
        { n: '04', t: 'Rodatge', d: 'Direcció amb equip cinematogràfic: RED, ARRI, òptiques Zeiss/Cooke.' },
        { n: '05', t: 'Postproducció', d: 'Edició, color grading, sound design, mescla i motion graphics.' },
        { n: '06', t: 'Delivery', d: 'Màsters per a tots els formats i adaptacions per a cada canal.' },
      ],
    },
    clients: { kicker: '05 — Clients', title: 'Confien en el treball.' },
    testimonials: {
      kicker: '06 — Testimonis', title: 'Què diuen els clients.',
      items: [
        { q: 'En Jared entén la marca des del primer briefing. El resultat va superar tot el que teníem al cap.', a: 'Laia Serra', r: 'Head of Brand · Startup B2B Barcelona' },
        { q: 'La cinematografia i el ritme narratiu són d\'un altre nivell.', a: 'Marc Puig', r: 'Creative Director · Agència de publicitat' },
        { q: "Va cobrir el nostre esdeveniment internacional amb una sensibilitat documental impressionant.", a: 'Elena Rossi', r: 'Event Producer · Milano' },
      ],
    },
    faq: {
      kicker: '07 — FAQ', title: 'Preguntes freqüents.',
      items: [
        { q: 'On et bases i viatges per als projectes?', a: 'Base a Barcelona i viatjo regularment per Espanya, Europa i projectes internacionals.' },
        { q: 'Quant costa un vídeo corporatiu o una campanya?', a: 'Cada projecte es cotitza segons brief, dies de rodatge, equip i postproducció.' },
        { q: 'Quin és el termini de lliurament habitual?', a: 'Un vídeo corporatiu es lliura en 3-4 setmanes. Campanyes publicitàries entre 6-10 setmanes.' },
        { q: 'Treballes amb agències i productores?', a: 'Sí, com a director, DoP o filmmaker freelance amb agències i productores.' },
        { q: 'Quin equip fas servir?', a: 'RED Komodo, Sony FX6/FX3, òptiques Zeiss Supreme i Cooke, gimbals, il·luminació Aputure/ARRI.' },
      ],
    },
    contact: {
      kicker: '08 — Contacte', title: 'Treballem junts.', sub: 'Explica\'m el teu projecte. Responc en menys de 24 hores.',
      name: 'Nom', email: 'Email', company: 'Empresa', budget: 'Pressupost', type: 'Tipus de projecte', message: 'Explica\'m el teu projecte',
      send: 'Enviar missatge', sending: 'Enviant…', success: 'Missatge enviat. Et responc aviat.', error: 'Alguna cosa ha fallat. Escriu a hello@jaredduron.com',
      types: ['Publicitat / Brand film', 'Vídeo corporatiu', 'Documental', 'Esdeveniment', 'Xarxes socials', 'Altres'],
      budgets: ['< 5.000€', '5.000€ - 15.000€', '15.000€ - 50.000€', '+ 50.000€'],
    },
    footer: { tagline: 'Cinematic video production. Made in Barcelona.', rights: 'Tots els drets reservats.' },
  },
}

/* ---------- Portfolio Data (imported from /lib/projects) ---------- */

/* ---------- Custom Cursor ---------- */
function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { damping: 25, stiffness: 400, mass: 0.4 })
  const springY = useSpring(cursorY, { damping: 25, stiffness: 400, mass: 0.4 })
  const [size, setSize] = useState(12)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const move = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY) }
    const over = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (t) {
        setSize(72)
        setLabel(t.getAttribute('data-cursor') || '')
      } else if (e.target.closest('a, button')) {
        setSize(40); setLabel('')
      } else {
        setSize(12); setLabel('')
      }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="custom-cursor flex items-center justify-center text-[10px] uppercase tracking-widest text-black font-medium"
      style={{
        translateX: springX,
        translateY: springY,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    >
      {label}
    </motion.div>
  )
}

/* ---------- Nav ---------- */
function Nav({ locale, setLocale, t }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-4 md:py-5 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group" aria-label="Home">
          <div className="w-2 h-2 bg-white rounded-full group-hover:animate-pulse" />
          <span className="font-display text-lg tracking-tight">Jared Duron</span>
        </a>

        <nav className="hidden md:flex items-center gap-10 text-[13px] tracking-wide uppercase">
          <a href="#work" className="hover:text-white/60 transition-colors">{t.nav.work}</a>
          <a href="#about" className="hover:text-white/60 transition-colors">{t.nav.about}</a>
          <a href="#services" className="hover:text-white/60 transition-colors">{t.nav.services}</a>
          <a href="#process" className="hover:text-white/60 transition-colors">{t.nav.process}</a>
          <a href="#blog" className="hover:text-white/60 transition-colors">{t.nav.blog}</a>
          <a href="#contact" className="hover:text-white/60 transition-colors">{t.nav.contact}</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-[11px] uppercase tracking-widest border border-white/10 rounded-full p-1">
            {['es', 'en', 'ca'].map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-0.5 rounded-full transition-all ${locale === l ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="#contact" className="hidden md:inline-flex items-center gap-2 text-[13px] uppercase tracking-wide border border-white/20 rounded-full px-4 py-2 hover:bg-white hover:text-black transition-all duration-300">
            {t.hero.cta2} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
            <div className="w-6 h-[1px] bg-white mb-1.5"></div>
            <div className="w-6 h-[1px] bg-white"></div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#0A0A0A] border-t border-white/10 px-6 py-6 space-y-4"
          >
            {['work', 'about', 'services', 'process', 'blog', 'contact'].map((k) => (
              <a key={k} href={`#${k}`} onClick={() => setOpen(false)} className="block text-xl font-display">{t.nav[k]}</a>
            ))}
            <div className="flex gap-2 pt-4">
              {['es', 'en', 'ca'].map((l) => (
                <button key={l} onClick={() => setLocale(l)} className={`px-3 py-1 text-xs uppercase tracking-widest border border-white/20 rounded-full ${locale === l ? 'bg-white text-black' : ''}`}>{l}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ---------- Hero ---------- */
function Hero({ t }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section ref={ref} id="top" className="relative h-screen w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline preload="auto"
          poster="https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=srgb&fm=jpg&w=1920&q=85"
        >
          <source src="https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 hero-vignette" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-between px-6 md:px-10 py-24 md:py-32 max-w-[1600px] mx-auto">
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <div className="w-8 h-[1px] bg-white/60" />
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70">{t.hero.eyebrow}</span>
          </motion.div>

          <h1 className="font-display text-[13vw] md:text-[9vw] leading-[0.95] tracking-tight text-balance">
            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {t.hero.title1}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="block italic text-white/80"
            >
              {t.hero.title2}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1 }}
            className="mt-8 md:mt-10 max-w-xl text-base md:text-lg text-white/70 leading-relaxed"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.3 }}
            className="mt-10 md:mt-12 flex flex-wrap gap-3 md:gap-4"
          >
            <a href="#work" data-cursor="View" className="inline-flex items-center gap-3 bg-white text-black px-6 md:px-7 py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-white/90 transition-all group">
              <span>{t.hero.cta1}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-3 border border-white/20 px-6 md:px-7 py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-white/10 transition-all">
              <span>{t.hero.cta2}</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.6 }}
          className="flex items-end justify-between text-[11px] uppercase tracking-widest text-white/50"
        >
          <div className="flex items-center gap-2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-[1px] h-8 bg-white/40" />
            <span>{t.hero.scroll}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>41.3874° N</span>
            <span>2.1686° E</span>
            <span>Barcelona / SP</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ---------- Marquee ---------- */
function Marquee({ text }) {
  const items = Array(6).fill(text)
  return (
    <div className="border-y border-white/10 overflow-hidden py-6 md:py-8 bg-[#0A0A0A]">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.concat(items).map((s, i) => (
          <span key={i} className="font-display text-3xl md:text-5xl italic mx-8 text-white/80">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- About ---------- */
function About({ t }) {
  return (
    <section id="about" className="relative py-24 md:py-40 px-6 md:px-10">
      <div className="max-w-[1600px] mx-auto">
        <SectionKicker>{t.about.kicker}</SectionKicker>
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }}
            className="md:col-span-7"
          >
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-balance">
              {t.about.title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1, delay: 0.15 }}
            className="md:col-span-5 md:pt-4 space-y-5 text-white/70 leading-relaxed text-base md:text-[17px]"
          >
            <p>{t.about.body1}</p>
            <p>{t.about.body2}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-16 md:mt-24 border-t border-white/10 pt-10 md:pt-16">
          {t.about.stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <div className="font-display text-5xl md:text-7xl leading-none">{s.n}</div>
              <div className="text-[11px] uppercase tracking-widest text-white/50 mt-3">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Work ---------- */
function Work({ t, locale }) {
  const [active, setActive] = useState(null)
  return (
    <section id="work" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <SectionKicker>{t.work.kicker}</SectionKicker>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-3xl text-balance">
              {t.work.title}
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-white/60 leading-relaxed">{t.work.sub}</p>
            <a href="https://www.behance.net/jaredduron" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white group">
              <span className="uppercase tracking-widest text-[11px]">Behance</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-20 md:gap-y-32">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} locale={locale} onOpen={() => setActive(p)} />
          ))}
        </div>
      </div>
      <ProjectModal project={active} locale={locale} onClose={() => setActive(null)} />
    </section>
  )
}

function ProjectCard({ project, index, locale, onOpen }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <motion.button
      onClick={onOpen}
      ref={ref}
      data-cursor="View"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group block text-left w-full ${index % 2 === 1 ? 'md:mt-24' : ''}`}
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-neutral-900">
        <motion.div style={{ y }} className="absolute inset-0 -top-12 -bottom-12">
          <img
            src={project.cover}
            alt={`${project.title} — ${project.client} — Jared Duron filmmaker Barcelona`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start text-[11px] uppercase tracking-widest text-white/80">
          <span>{project.category[locale]}</span>
          <span className="font-mono-num">{project.year}</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
          <div>
            <div className="font-display text-2xl md:text-3xl leading-none">{project.title}</div>
            <div className="text-xs text-white/70 mt-1">{project.client}</div>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-6">
        <div className="text-sm text-white/60">{project.subtitle} · {project.location}</div>
        <div className="text-right text-[11px] uppercase tracking-widest text-white/40 shrink-0">{project.role}</div>
      </div>
    </motion.button>
  )
}

function ProjectModal({ project, locale, onClose }) {
  useEffect(() => {
    if (!project) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[80] bg-[#0A0A0A]/98 backdrop-blur-xl overflow-y-auto"
        >
          <button
            onClick={onClose}
            data-cursor="Close"
            className="fixed top-6 right-6 md:top-8 md:right-10 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28"
          >
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-4">{project.category[locale]} · {project.year}</div>
            <h2 className="font-display text-5xl md:text-8xl leading-[0.95] tracking-tight text-balance">
              {project.title}
            </h2>
            <div className="mt-3 font-display italic text-2xl md:text-3xl text-white/60">{project.subtitle}</div>

            <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-8 md:gap-12 border-t border-white/10 pt-8 md:pt-12">
              <div className="md:col-span-4 space-y-6">
                <MetaRow k="Client" v={project.client} />
                <MetaRow k="Role" v={project.role} />
                <MetaRow k="Location" v={project.location} />
                <MetaRow k="Year" v={project.year} />
                {project.tools?.length > 0 && <MetaRow k="Tools" v={project.tools.join(' · ')} />}
                {project.tags?.length > 0 && (
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[11px] px-2.5 py-1 border border-white/15 rounded-full text-white/70">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                <a
                  href={project.behanceUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-3 bg-white text-black px-6 py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-white/90 transition-all group"
                >
                  View on Behance <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </a>
              </div>
              <div className="md:col-span-8">
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">{project.description[locale]}</p>
              </div>
            </div>

            <div className="mt-16 md:mt-24 space-y-4 md:space-y-6">
              {project.gallery.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                  className="overflow-hidden bg-neutral-950"
                >
                  <img src={img} alt={`${project.title} — image ${idx + 1}`} loading="lazy" className="w-full h-auto" />
                </motion.div>
              ))}
            </div>

            <div className="mt-16 md:mt-24 text-center border-t border-white/10 pt-16">
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-4">Next chapter</div>
              <a href="#contact" onClick={onClose} className="font-display text-4xl md:text-6xl italic hover:text-white/60 transition-colors">
                Let&apos;s work together →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MetaRow({ k, v }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1">{k}</div>
      <div className="text-white/90">{v}</div>
    </div>
  )
}

/* ---------- Blog ---------- */
function Blog({ t, locale }) {
  return (
    <section id="blog" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <SectionKicker>08 — {locale === 'en' ? 'Journal' : 'Blog'}</SectionKicker>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-3xl text-balance">
              {locale === 'es' ? 'Ideas sobre cine, marca y producción.' : locale === 'ca' ? 'Idees sobre cinema, marca i producció.' : 'Ideas on cinema, brand and production.'}
            </h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {BLOG_POSTS.slice(0, 6).map((post, i) => (
            <motion.a
              key={post.slug}
              href={`#${post.slug}`}
              data-cursor="Read"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 mb-5">
                <img src={post.cover} alt={post.title[locale]} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4 text-[11px] uppercase tracking-widest bg-black/50 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                  {post.category[locale]}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-white/40 font-mono-num mb-3">
                <span>{new Date(post.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ca' ? 'ca-ES' : 'es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>·</span>
                <span>{post.read}</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl leading-tight tracking-tight group-hover:text-white/70 transition-colors text-balance">
                {post.title[locale]}
              </h3>
              <p className="mt-3 text-white/60 leading-relaxed text-sm">{post.excerpt[locale]}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm">
                <span className="uppercase tracking-widest text-[11px]">Read</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Services ---------- */
function Services({ t }) {
  return (
    <section id="services" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <SectionKicker>{t.services.kicker}</SectionKicker>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-3xl text-balance">
          {t.services.title}
        </h2>

        <div className="mt-16 md:mt-24 border-t border-white/10">
          {t.services.items.map((s, i) => (
            <ServiceRow key={i} index={i} title={s.t} desc={s.d} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceRow({ index, title, desc }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: (index % 4) * 0.05 }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className="group grid grid-cols-12 items-center gap-4 py-6 md:py-8 border-b border-white/10 cursor-pointer transition-colors"
    >
      <div className="col-span-2 md:col-span-1 text-[11px] uppercase tracking-widest text-white/40 font-mono-num">
        0{index + 1}
      </div>
      <div className="col-span-10 md:col-span-4">
        <h3 className={`font-display text-2xl md:text-4xl tracking-tight transition-all duration-500 ${hover ? 'italic translate-x-2' : ''}`}>
          {title}
        </h3>
      </div>
      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <p className="text-white/60 leading-relaxed text-sm md:text-base max-w-lg">{desc}</p>
      </div>
      <div className="hidden md:flex col-span-1 justify-end">
        <ArrowUpRight className={`w-5 h-5 transition-all duration-500 ${hover ? 'rotate-45 text-white' : 'text-white/40'}`} />
      </div>
    </motion.div>
  )
}

/* ---------- Process ---------- */
function Process({ t }) {
  return (
    <section id="process" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <SectionKicker>{t.process.kicker}</SectionKicker>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-3xl text-balance">
          {t.process.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 mt-16 md:mt-24">
          {t.process.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.8, delay: i * 0.08 }}
              className="group"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono-num text-white/40 text-sm">{step.n}</span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-3">{step.t}</h3>
              <p className="text-white/60 leading-relaxed">{step.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Clients Marquee ---------- */
function Clients({ t }) {
  return (
    <section id="clients" className="relative py-16 md:py-24 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-10">
        <SectionKicker>{t.clients.kicker}</SectionKicker>
        <h2 className="font-display text-3xl md:text-5xl leading-tight mt-6 text-balance">{t.clients.title}</h2>
      </div>
      <div className="overflow-hidden border-y border-white/10 py-8">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...REAL_CLIENTS, ...REAL_CLIENTS, ...REAL_CLIENTS].map((c, i) => (
            <span key={i} className="mx-8 md:mx-12 text-lg md:text-2xl tracking-[0.15em] text-white/50 hover:text-white transition-colors">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Testimonials ---------- */
function Testimonials({ t }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % t.testimonials.items.length), 6500)
    return () => clearInterval(id)
  }, [t.testimonials.items.length])

  const item = t.testimonials.items[i]

  return (
    <section id="testimonials" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <SectionKicker>{t.testimonials.kicker}</SectionKicker>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-3xl text-balance">
          {t.testimonials.title}
        </h2>

        <div className="mt-16 md:mt-24 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7 }}
            >
              <p className="font-display text-3xl md:text-5xl leading-[1.15] italic text-balance">
                &ldquo;{item.q}&rdquo;
              </p>
              <footer className="mt-8 md:mt-12 flex items-center gap-4 text-sm">
                <div className="w-10 h-[1px] bg-white/40" />
                <div>
                  <div className="font-medium">{item.a}</div>
                  <div className="text-white/50">{item.r}</div>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-12 flex gap-2">
            {t.testimonials.items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-[2px] transition-all duration-500 ${idx === i ? 'w-12 bg-white' : 'w-6 bg-white/20'}`}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */
function FAQ({ t }) {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-8 md:gap-16">
        <div className="md:col-span-4">
          <SectionKicker>{t.faq.kicker}</SectionKicker>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight mt-6 text-balance">
            {t.faq.title}
          </h2>
        </div>
        <div className="md:col-span-8">
          {t.faq.items.map((f, i) => (
            <div key={i} className="border-b border-white/10">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 py-6 md:py-8 text-left group"
                aria-expanded={open === i}
              >
                <span className="font-display text-xl md:text-2xl tracking-tight pr-4 group-hover:text-white/70 transition-colors">
                  {f.q}
                </span>
                <span className="shrink-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                  {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 md:pb-8 text-white/60 leading-relaxed max-w-2xl">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Contact ---------- */
function Contact({ t, locale }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', budget: '', projectType: '', message: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      if (!res.ok) throw new Error('fail')
      toast.success(t.contact.success)
      setForm({ name: '', email: '', company: '', budget: '', projectType: '', message: '' })
    } catch {
      toast.error(t.contact.error)
    } finally { setLoading(false) }
  }

  return (
    <section id="contact" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-8 md:gap-16">
        <div className="md:col-span-5">
          <SectionKicker>{t.contact.kicker}</SectionKicker>
          <h2 className="font-display text-5xl md:text-7xl leading-[1] tracking-tight mt-6 text-balance">
            {t.contact.title}
          </h2>
          <p className="mt-6 text-white/60 leading-relaxed max-w-md">{t.contact.sub}</p>

          <div className="mt-12 space-y-4 text-sm">
            <a href="https://calendly.com/jaredduron/30min" target="_blank" rel="noopener noreferrer" data-cursor="Book" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
              <Calendar className="w-4 h-4" /> {locale === 'en' ? 'Book a call · Calendly' : locale === 'ca' ? 'Reserva una trucada · Calendly' : 'Reserva una llamada · Calendly'}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="mailto:hello@jaredduron.com" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
              <Mail className="w-4 h-4" /> hello@jaredduron.com
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
              <MessageCircle className="w-4 h-4" /> WhatsApp
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://www.instagram.com/jaredduron" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
              <Instagram className="w-4 h-4" /> Instagram
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://www.linkedin.com/in/jaredduron" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
              <Linkedin className="w-4 h-4" /> LinkedIn
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="flex items-center gap-4 text-white/60 pt-4">
              <MapPin className="w-4 h-4" /> Barcelona, Catalunya
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="md:col-span-7 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label={t.contact.name} required>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors" />
            </FormField>
            <FormField label={t.contact.email} required>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors" />
            </FormField>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label={t.contact.company}>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors" />
            </FormField>
            <FormField label={t.contact.budget}>
              <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors cursor-pointer">
                <option value="" className="bg-black">—</option>
                {t.contact.budgets.map((b) => <option key={b} value={b} className="bg-black">{b}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label={t.contact.type}>
            <div className="flex flex-wrap gap-2 pt-2">
              {t.contact.types.map((typ) => (
                <button
                  type="button"
                  key={typ}
                  onClick={() => setForm({ ...form, projectType: typ })}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${form.projectType === typ ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/60'}`}
                >
                  {typ}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label={t.contact.message} required>
            <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors resize-none" />
          </FormField>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              data-cursor="Send"
              className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-sm uppercase tracking-wider hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loading ? t.contact.sending : t.contact.send}
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-white/50 mb-1">
        {label}{required && <span className="text-white/40"> *</span>}
      </label>
      {children}
    </div>
  )
}

/* ---------- Footer ---------- */
function Footer({ t }) {
  return (
    <footer className="relative border-t border-white/10 px-6 md:px-10 py-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <h3 className="font-display text-4xl md:text-6xl leading-tight text-balance">
              Jared Duron<span className="text-white/40">.</span>
            </h3>
            <p className="mt-4 text-white/50 max-w-md">{t.footer.tagline}</p>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-widest text-white/40 mb-4">Menu</div>
            <ul className="space-y-2 text-sm">
              {['work', 'about', 'services', 'process', 'blog', 'contact'].map((k) => (
                <li key={k}><a href={`#${k}`} className="hover:text-white/60">{t.nav[k]}</a></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-widest text-white/40 mb-4">Social</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.behance.net/jaredduron" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">Behance</a></li>
              <li><a href="https://www.instagram.com/jaredduron" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">Instagram</a></li>
              <li><a href="https://www.linkedin.com/in/jaredduron" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">LinkedIn</a></li>
              <li><a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">Vimeo</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-widest text-white/40 mb-4">Contact</div>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:hello@jaredduron.com" className="hover:text-white/60">hello@jaredduron.com</a></li>
              <li className="text-white/60">Barcelona, ES</li>
              <li className="text-white/60">41.3874° N · 2.1686° E</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs uppercase tracking-widest text-white/40">
          <div>© {new Date().getFullYear()} Jared Duron. {t.footer.rights}</div>
          <div className="flex gap-6">
            <span>Made in Barcelona</span>
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SectionKicker({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
      className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/50"
    >
      <div className="w-6 h-[1px] bg-white/40" />
      <span>{children}</span>
    </motion.div>
  )
}

/* ---------- Loader ---------- */
function Loader() {
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 15 + 5
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(() => setDone(true), 500)
      }
      setProgress(Math.floor(p))
    }, 120)
    return () => clearInterval(id)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="font-display text-6xl md:text-8xl italic">Jared Duron</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.4em] text-white/50">Filmmaker · Barcelona</div>
          </motion.div>
          <div className="absolute bottom-16 left-6 right-6 md:left-10 md:right-10 flex items-end justify-between">
            <div className="font-mono-num text-xs text-white/50">{String(progress).padStart(3, '0')}</div>
            <div className="flex-1 mx-6 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs uppercase tracking-widest text-white/50">Loading</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Root ---------- */
function App() {
  const [locale, setLocale] = useState('es')
  const t = useMemo(() => T[locale], [locale])

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('locale') : null
    if (saved && T[saved]) setLocale(saved)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('locale', locale)
  }, [locale])

  return (
    <>
      <CustomCursor />
      <Loader />
      <Toaster position="bottom-right" theme="dark" />
      <div className="grain">
        <Nav locale={locale} setLocale={setLocale} t={t} />
        <main>
          <Hero t={t} />
          <Marquee text={t.marquee} />
          <About t={t} />
          <Work t={t} locale={locale} />
          <Services t={t} />
          <Process t={t} />
          <Clients t={t} />
          <Testimonials t={t} />
          <FAQ t={t} />
          <Blog t={t} locale={locale} />
          <Contact t={t} locale={locale} />
        </main>
        <Footer t={t} />
      </div>
    </>
  )
}

export default App
