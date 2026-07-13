'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Play, Mail, Instagram, Linkedin, MessageCircle, MapPin, Plus, Minus, X, ExternalLink, Sparkles, Star, Clock3, Clapperboard, BadgeCheck, Layers3 } from 'lucide-react'
import { PROJECTS, PORTFOLIO_CATEGORY_PROJECTS, REAL_CLIENTS, BLOG_POSTS } from '@/lib/projects'
import HeroMedia from '@/components/hero-media'
import SocialFeed from '@/components/social-feed'
import { SOCIAL_LINKS } from '@/lib/social-links'
import { trackEvent } from '@/lib/analytics'
import { openConsentPreferences } from '@/lib/consent'

const Toaster = dynamic(() => import('sonner').then((module) => module.Toaster), { ssr: false })

/* ---------- i18n ---------- */
const T = {
  es: {
    seo: {
      title: 'Jared Durón | Filmmaker, Fotografía y Diseño en Barcelona',
      description: 'Filmmaker en Barcelona especializado en producción audiovisual, fotografía comercial y diseño gráfico para marcas, agencias, documentales y eventos.',
    },
    a11y: { viewOnBehance: 'Ver proyecto en Behance', primaryLink: 'Enlace de navegación principal', mobileLink: 'Enlace del menú móvil', footerLink: 'Enlace del pie de página' },
    nav: { work: 'Proyectos', about: 'Sobre mí', services: 'Servicios', process: 'Proceso', blog: 'Blog', contact: 'Contacto' },
    hero: {
      eyebrow: 'Filmmaker & Graphic Designer · Barcelona',
      title: 'Jared Durón · Filmmaker en Barcelona',
      title1: 'Jared Durón — Filmmaker in Barcelona.',
      title2: 'Films that grow brands.',
      sub: 'Producción audiovisual y diseño gráfico para marcas premium, agencias creativas y productoras internacionales. Más de 7 años transformando ideas en experiencias visuales.',
      cta1: 'Ver Proyectos',
      cta2: 'Trabajemos juntos',
      playReel: 'Reproducir reel',
      reelAria: 'Reproducir reel de Jared Durón',
      menuAria: 'Abrir menú de navegación',
      scroll: 'Desplázate',
    },
    marquee: 'Disponible para proyectos · Barcelona · Worldwide · Comercial · Documental · Eventos ·',
    about: {
      kicker: '01 — Sobre mí',
      title: 'Cine, marca y verdad en cada frame.',
      body1: 'Jared Durón es filmmaker en Barcelona especializado en producción audiovisual, fotografía comercial y diseño gráfico para marcas, agencias y productoras. Desarrolla proyectos audiovisuales, documentales, eventos y campañas desde la idea y el rodaje hasta la edición, el color y la entrega final.',
      body2: 'He participado en proyectos para KNX (ISE 2026 Barcelona, Light+Building 2026 Frankfurt), WWF, BCIE, John Deere, Grupo Roble (Multiplaza, MetroMall), Miniso y clientes creadores como Juan Lucho o Prósperos Podcast. Especializado en producción integral: preproducción, rodaje, edición, motion, color grading y VideoMapping.',
      stats: [
        { n: '7+', l: 'Años de experiencia' },
        { n: '30+', l: 'Proyectos audiovisuales' },
        { n: '15+', l: 'Marcas y agencias' },
        { n: '3', l: 'Disciplinas · Film, Foto & Design' },
      ],
      experience: {
        eyebrow: 'Experiencia · Producción · Diseño',
        titleIntro: 'Crear un vídeo es fácil.',
        titleHighlight: 'Hacer que una marca se recuerde,\nno tanto.',
        body1: 'Producción audiovisual, filmmaking y diseño gráfico en Barcelona para marcas, agencias y productoras que buscan contenido cinematográfico, campañas visuales y piezas digitales capaces de conectar con su audiencia.',
        body2: 'Desde la idea y el rodaje hasta la edición, el color y la entrega final, cada proyecto combina narrativa, estrategia y una ejecución visual cuidada.',
        highlights1: ['Producción audiovisual', 'Barcelona', 'marcas'],
        highlights2: ['color', 'narrativa'],
      },
    },
    work: {
      nav: { filmmaking: 'Filmmaking', photography: 'Fotografía', graphicDesign: 'Diseño gráfico' },
      filmmaking: {
        eyebrow: '01 · Producción audiovisual',
        title: 'Filmmaking',
        highlight: '',
        description: 'Producción audiovisual, dirección de fotografía y edición de vídeo para marcas, agencias, instituciones y productoras que buscan contenido cinematográfico capaz de conectar con su audiencia.',
      },
      photography: {
        eyebrow: '02 · Fotografía',
        title: 'Fotografía',
        highlight: '',
        description: 'Fotografía comercial, fotografía de producto, retrato editorial y fotografía urbana en Barcelona, desarrolladas con una dirección visual cuidada y una iluminación pensada para cada proyecto.',
      },
      graphicDesign: {
        eyebrow: '03 · Diseño gráfico',
        title: 'Diseño gráfico',
        highlight: '',
        description: 'Diseño gráfico, identidad visual, contenido para redes sociales y comunicación de marca desarrollados para transformar conceptos en sistemas visuales claros, coherentes y memorables.',
      },
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
        { t: 'Color Grading', d: 'Color cinematográfico que define atmósfera, intención y una identidad visual memorable para cada pieza.' },
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
        { n: '04', t: 'Rodaje', d: 'Dirección y captura con enfoque cinematográfico. Iluminación, sonido y planos coreografiados según el storyboard.' },
        { n: '05', t: 'Postproducción', d: 'Edición, color grading, sound design, mezcla y motion graphics.' },
        { n: '06', t: 'Delivery', d: 'Másteres para todos los formatos y adaptaciones para cada canal.' },
      ],
    },
    clients: { kicker: '05 — Clientes', title: 'Confían en el trabajo.' },
    testimonials: {
      kicker: '06 — Testimonios',
      title: 'Lo que dicen quienes trabajan con él.',
      items: [
        { q: 'Jared entiende la producción como pocos. Rápido, cinematográfico y con criterio. Es de esas personas que dejas trabajar sin preocuparte por el resultado.', a: 'Nico', r: 'CEO · Ready.Barcelona' },
        { q: 'Su capacidad de contar una historia con imagen es enorme. Con Jared no solo grabas contenido, construyes marca. Un aliado clave en Prósperos Podcast.', a: 'Juan Lucho', r: 'CEO · New Wave & Prósperos Podcast' },
        { q: 'Talento, disciplina y una mirada única detrás de cámara. Jared elevó todas las campañas donde trabajamos juntos: dirección de arte impecable y ejecución impecable.', a: 'Bianka Culotta', r: 'Head of Marketing · Push Digital' },
        { q: 'Es un profesional integral: dirige, filma, edita y diseña. En ACERTA fue pieza clave de proyectos con clientes como WWF y BCIE. Su rigor y sensibilidad marcan la diferencia.', a: 'Carlos Castañeda', r: 'CEO · ACERTA' },
      ],
    },
    faq: {
      kicker: '07 — FAQ',
      title: 'Preguntas frecuentes.',
      items: [
        { q: '¿Dónde estás basado y viajas para proyectos?', a: 'Estoy basado en Barcelona y viajo regularmente por España, Europa y proyectos internacionales. Trabajo con equipos locales en cada destino.' },
        { q: '¿Cuánto cuesta un vídeo corporativo o una campaña?', a: 'Cada proyecto se cotiza según brief, días de rodaje, equipo y postproducción. Podemos empezar desde 350€ para piezas sencillas y crecer hasta donde la creatividad y el alcance del cliente quieran llegar.' },
        { q: '¿Cuál es el plazo de entrega habitual?', a: 'Un vídeo corporativo suele entregarse en 3-4 semanas. Campañas publicitarias entre 6-10 semanas dependiendo del alcance.' },
        { q: '¿Trabajas con agencias y productoras?', a: 'Sí. Colaboro como director, editor o videografo freelance con agencias creativas y productoras nacionales e internacionales. También asumo dirección creativa y diseño gráfico para campañas integrales.' },
      ],
    },
    contact: {
      kicker: '08 — Contacto',
      title: 'Trabajemos juntos.',
      sub: 'Cuéntame sobre tu proyecto. Respondo en menos de 24 horas.',
      name: 'Nombre', email: 'Email', phone: 'Teléfono', company: 'Empresa', budget: 'Presupuesto', type: 'Tipo de proyecto', message: 'Cuéntame tu proyecto',
      send: 'Enviar mensaje', sending: 'Enviando…', success: 'Mensaje enviado. Te respondo en breve.', error: 'Algo falló. Escribe a jaredmisaelduron@gmail.com',
      types: ['Publicidad / Brand film', 'Vídeo corporativo', 'Documental', 'Evento', 'Redes sociales', 'Otro'],
      budgets: ['Desde 350€', '350€ - 1.500€', '1.500€ - 5.000€', '5.000€ - 15.000€', 'A medida / sin límite creativo'],
    },
    footer: {
      tagline: 'Cinematic video production. Made in Barcelona.',
      rights: 'Todos los derechos reservados.',
      privacy: 'Preferencias de privacidad',
      seoKicker: 'Producción audiovisual en Barcelona',
      seoBody: 'Trabajo con marcas, agencias y proyectos creativos que necesitan producción audiovisual en Barcelona: brand films, vídeo corporativo, cobertura de eventos, contenido para redes sociales, edición de vídeo, motion graphics, diseño gráfico y piezas cinematográficas pensadas para comunicar con claridad.',
    },
  },
  en: {
    seo: {
      title: 'Jared Durón | Filmmaker, Photography & Design Barcelona',
      description: 'Barcelona filmmaker specializing in audiovisual production, commercial photography and graphic design for brands, agencies, documentaries and events.',
    },
    a11y: { viewOnBehance: 'View project on Behance', primaryLink: 'Primary navigation link', mobileLink: 'Mobile menu link', footerLink: 'Footer link' },
    nav: { work: 'Work', about: 'About', services: 'Services', process: 'Process', blog: 'Journal', contact: 'Contact' },
    hero: {
      eyebrow: 'Filmmaker & Graphic Designer · Barcelona',
      title: 'Jared Durón · Filmmaker in Barcelona',
      title1: 'Jared Durón — Filmmaker in Barcelona.',
      title2: 'Films that grow brands.',
      sub: 'Audiovisual production and graphic design for premium brands, creative agencies and international production houses. 7+ years turning ideas into visual experiences.',
      cta1: 'View Work', cta2: "Let's Work Together", playReel: 'Play reel', reelAria: 'Play Jared Durón reel', menuAria: 'Open navigation menu', scroll: 'Scroll',
    },
    marquee: 'Available for projects · Barcelona · Worldwide · Commercial · Documentary · Events ·',
    about: {
      kicker: '01 — About',
      title: 'Cinema, brand and truth in every frame.',
      body1: 'Jared Durón is a Barcelona filmmaker specializing in audiovisual production, commercial photography and graphic design for brands, agencies and production companies. He develops audiovisual projects, documentaries, events and campaigns from concept and filming to editing, color grading and final delivery.',
      body2: 'I have participated in projects for KNX (ISE 2026 Barcelona, Light+Building 2026 Frankfurt), WWF, BCIE, John Deere, Grupo Roble (Multiplaza, MetroMall), Miniso and creator clients like Juan Lucho and Prósperos Podcast. Specialized in end-to-end production: pre-production, shooting, editing, motion, color grading and VideoMapping.',
      stats: [
        { n: '7+', l: 'Years of experience' },
        { n: '30+', l: 'Audiovisual projects' },
        { n: '15+', l: 'Brands and agencies' },
        { n: '3', l: 'Disciplines · Film, Photo & Design' },
      ],
      experience: {
        eyebrow: 'Experience · Production · Design',
        titleIntro: 'Creating a video is easy.',
        titleHighlight: 'Making a brand memorable\nis not.',
        body1: 'Audiovisual production, filmmaking and graphic design in Barcelona for brands, agencies and production companies looking for cinematic content, visual campaigns and digital pieces that connect with their audience.',
        body2: 'From concept and production to editing, color grading and final delivery, every project combines storytelling, strategy and carefully crafted visuals.',
        highlights1: ['Audiovisual production', 'Barcelona', 'brands'],
        highlights2: ['color grading', 'storytelling'],
      },
    },
    work: {
      nav: { filmmaking: 'Filmmaking', photography: 'Photography', graphicDesign: 'Graphic Design' },
      filmmaking: {
        eyebrow: '01 · Audiovisual Production', title: 'Filmmaking', highlight: '',
        description: 'Audiovisual production, cinematography and video editing for brands, agencies, institutions and production companies seeking cinematic content that connects with their audience.',
      },
      photography: {
        eyebrow: '02 · Photography', title: 'Photography', highlight: '',
        description: 'Commercial photography, product photography, editorial portraits and urban photography in Barcelona, created with carefully considered art direction and lighting.',
      },
      graphicDesign: {
        eyebrow: '03 · Graphic Design', title: 'Graphic Design', highlight: '',
        description: 'Graphic design, visual identity, social media content and brand communication created to transform concepts into clear, coherent and memorable visual systems.',
      },
    },
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
        { t: 'Color Grading', d: 'Cinematic color that shapes mood, intention and a memorable visual identity for every piece.' },
        { t: 'Motion Graphics', d: 'Motion design, titles and 2D animation to reinforce the narrative.' },
      ],
    },
    process: {
      kicker: '04 — Process', title: 'A proven method.',
      steps: [
        { n: '01', t: 'Discovery', d: 'We understand the brief, goals and audience. Define KPIs and tone.' },
        { n: '02', t: 'Concept', d: 'Creative treatment, moodboard, script and cinematic references.' },
        { n: '03', t: 'Pre-production', d: 'Casting, locations, crew, permits, storyboard and shooting plan.' },
        { n: '04', t: 'Shooting', d: 'Directing and capturing with a cinematic approach. Lighting, sound and choreographed shots per storyboard.' },
        { n: '05', t: 'Post-production', d: 'Editing, color grading, sound design, mix and motion graphics.' },
        { n: '06', t: 'Delivery', d: 'Masters for all formats and adaptations for each channel.' },
      ],
    },
    clients: { kicker: '05 — Clients', title: 'Trusted work.' },
    testimonials: {
      kicker: '06 — Testimonials', title: 'What people who work with him say.',
      items: [
        { q: 'Jared gets production like few people do. Fast, cinematic and sharp. He is one of those people you can let work without worrying about the result.', a: 'Nico', r: 'CEO · Ready.Barcelona' },
        { q: 'His ability to tell a story with visuals is huge. With Jared you don\'t just record content — you build a brand. A key ally on Prósperos Podcast.', a: 'Juan Lucho', r: 'CEO · New Wave & Prósperos Podcast' },
        { q: 'Talent, discipline and a unique eye behind the camera. Jared elevated every campaign we worked on together: flawless art direction and execution.', a: 'Bianka Culotta', r: 'Head of Marketing · Push Digital' },
        { q: 'He\'s a full-stack creative: directs, shoots, edits and designs. At ACERTA he was a key part of projects with WWF and BCIE. His rigor makes the difference.', a: 'Carlos Castañeda', r: 'CEO · ACERTA' },
      ],
    },
    faq: {
      kicker: '07 — FAQ', title: 'Frequently asked.',
      items: [
        { q: 'Where are you based and do you travel?', a: 'Based in Barcelona and traveling regularly across Spain, Europe and international projects. I work with local crews in each destination.' },
        { q: 'How much does a corporate video or a campaign cost?', a: 'Each project is quoted based on brief, shoot days, crew and post-production. We can start from €350 for simple pieces and scale as far as the client’s creativity and project scope want to go.' },
        { q: 'What is the usual delivery timeline?', a: 'A corporate video is usually delivered in 3-4 weeks. Advertising campaigns between 6-10 weeks depending on scope.' },
        { q: 'Do you work with agencies and production companies?', a: 'Yes. I collaborate as director, editor or freelance videographer with national and international creative agencies. I also take on creative direction and graphic design for integrated campaigns.' },
      ],
    },
    contact: {
      kicker: '08 — Contact', title: "Let's work together.", sub: 'Tell me about your project. I reply within 24 hours.',
      name: 'Name', email: 'Email', phone: 'Phone', company: 'Company', budget: 'Budget', type: 'Project type', message: 'Tell me about your project',
      send: 'Send message', sending: 'Sending…', success: 'Message sent. I will reply soon.', error: 'Something failed. Write to jaredmisaelduron@gmail.com',
      types: ['Advertising / Brand film', 'Corporate video', 'Documentary', 'Event', 'Social media', 'Other'],
      budgets: ['From €350', '€350 - €1.5k', '€1.5k - €5k', '€5k - €15k', 'Custom / no creative limit'],
    },
    footer: {
      tagline: 'Cinematic video production. Made in Barcelona.',
      rights: 'All rights reserved.',
      privacy: 'Privacy preferences',
      seoKicker: 'Audiovisual production in Barcelona',
      seoBody: 'I work with brands, agencies and creative projects that need audiovisual production in Barcelona: brand films, corporate video, event coverage, social content, video editing, motion graphics, graphic design and cinematic pieces made to communicate clearly.',
    },
  },
  ca: {
    seo: {
      title: 'Jared Durón | Filmmaker, Fotografia i Disseny a Barcelona',
      description: 'Filmmaker a Barcelona especialitzat en producció audiovisual, fotografia comercial i disseny gràfic per a marques, agències, documentals i esdeveniments.',
    },
    a11y: { viewOnBehance: 'Veure projecte a Behance', primaryLink: 'Enllaç de navegació principal', mobileLink: 'Enllaç del menú mòbil', footerLink: 'Enllaç del peu de pàgina' },
    nav: { work: 'Projectes', about: 'Sobre mi', services: 'Serveis', process: 'Procés', blog: 'Blog', contact: 'Contacte' },
    hero: {
      eyebrow: 'Filmmaker & Graphic Designer · Barcelona',
      title: 'Jared Durón · Filmmaker a Barcelona',
      title1: 'Jared Durón — Filmmaker a Barcelona.',
      title2: 'Pel·lícules que fan créixer marques.',
      sub: 'Producció audiovisual i disseny gràfic per a marques premium, agències creatives i productores internacionals.',
      cta1: 'Veure Projectes', cta2: 'Treballem junts', playReel: 'Reproduir reel', reelAria: 'Reproduir reel de Jared Durón', menuAria: 'Obrir menú de navegació', scroll: "Desplaça't",
    },
    marquee: 'Disponible per a projectes · Barcelona · Worldwide · Comercial · Documental · Esdeveniments ·',
    about: {
      kicker: '01 — Sobre mi', title: 'Cinema, marca i veritat a cada frame.',
      body1: 'Jared Durón és filmmaker a Barcelona especialitzat en producció audiovisual, fotografia comercial i disseny gràfic per a marques, agències i productores. Desenvolupa projectes audiovisuals, documentals, esdeveniments i campanyes des de la idea i el rodatge fins a l’edició, el color i el lliurament final.',
      body2: "He participat en projectes per a KNX (ISE 2026 Barcelona, Light+Building 2026 Frankfurt), WWF, BCIE, John Deere, Grupo Roble, Miniso i creadors com Juan Lucho o Prósperos Podcast. Especialitzat en producció integral: preproducció, rodatge, edició, motion, color grading i VideoMapping.",
      stats: [
        { n: '7+', l: "Anys d'experiència" },
        { n: '30+', l: 'Projectes audiovisuals' },
        { n: '15+', l: 'Marques i agències' },
        { n: '3', l: 'Disciplines · Film, Foto & Design' },
      ],
      experience: {
        eyebrow: 'Experiència · Producció · Disseny',
        titleIntro: 'Crear un vídeo és fàcil.',
        titleHighlight: 'Fer que una marca sigui recordada\nno tant.',
        body1: 'Producció audiovisual, filmmaking i disseny gràfic a Barcelona per a marques, agències i productores que busquen contingut cinematogràfic, campanyes visuals i peces digitals capaces de connectar amb la seva audiència.',
        body2: "Des de la idea i el rodatge fins a l'edició, el color i el lliurament final, cada projecte combina narrativa, estratègia i una execució visual cuidada.",
        highlights1: ['Producció audiovisual', 'Barcelona', 'marques'],
        highlights2: ['color', 'narrativa'],
      },
    },
    work: {
      nav: { filmmaking: 'Filmmaking', photography: 'Fotografia', graphicDesign: 'Disseny gràfic' },
      filmmaking: {
        eyebrow: '01 · Producció audiovisual', title: 'Filmmaking', highlight: '',
        description: 'Producció audiovisual, direcció de fotografia i edició de vídeo per a marques, agències, institucions i productores que busquen contingut cinematogràfic capaç de connectar amb la seva audiència.',
      },
      photography: {
        eyebrow: '02 · Fotografia', title: 'Fotografia', highlight: '',
        description: 'Fotografia comercial, fotografia de producte, retrat editorial i fotografia urbana a Barcelona, creades amb una direcció visual i una il·luminació cuidada.',
      },
      graphicDesign: {
        eyebrow: '03 · Disseny gràfic', title: 'Disseny gràfic', highlight: '',
        description: 'Disseny gràfic, identitat visual, contingut per a xarxes socials i comunicació de marca desenvolupats per transformar conceptes en sistemes visuals clars, coherents i memorables.',
      },
    },
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
        { t: 'Color Grading', d: 'Color cinematogràfic que defineix atmosfera, intenció i una identitat visual memorable per a cada peça.' },
        { t: 'Motion Graphics', d: 'Disseny de moviment, títols i animació 2D per reforçar la narrativa.' },
      ],
    },
    process: {
      kicker: '04 — Procés', title: 'Un mètode provat.',
      steps: [
        { n: '01', t: 'Discovery', d: 'Entenem el brief, els objectius i el públic. Definim KPI i to.' },
        { n: '02', t: 'Concepte', d: 'Tractament creatiu, moodboard, guió i referències cinematogràfiques.' },
        { n: '03', t: 'Preproducció', d: 'Càsting, localitzacions, equip, permisos, storyboard i pla de rodatge.' },
        { n: '04', t: 'Rodatge', d: 'Direcció i captura amb enfocament cinematogràfic. Il·luminació, so i plans coreografiats segons el storyboard.' },
        { n: '05', t: 'Postproducció', d: 'Edició, color grading, sound design, mescla i motion graphics.' },
        { n: '06', t: 'Delivery', d: 'Màsters per a tots els formats i adaptacions per a cada canal.' },
      ],
    },
    clients: { kicker: '05 — Clients', title: 'Confien en el treball.' },
    testimonials: {
      kicker: '06 — Testimonis', title: 'Què diuen els qui hi treballen.',
      items: [
        { q: 'En Jared entén la producció com pocs. Ràpid, cinematogràfic i amb criteri. Un perfil en qui pots confiar plenament.', a: 'Nico', r: 'CEO · Ready.Barcelona' },
        { q: 'La seva capacitat d\'explicar històries amb imatge és enorme. Amb ell no només graves contingut, construeixes marca.', a: 'Juan Lucho', r: 'CEO · New Wave & Prósperos Podcast' },
        { q: 'Talent, disciplina i una mirada única darrere la càmera. En Jared va elevar totes les campanyes on vam treballar junts.', a: 'Bianka Culotta', r: 'Head of Marketing · Push Digital' },
        { q: 'És un professional integral: dirigeix, filma, edita i dissenya. A ACERTA va ser peça clau en projectes amb WWF i BCIE.', a: 'Carlos Castañeda', r: 'CEO · ACERTA' },
      ],
    },
    faq: {
      kicker: '07 — FAQ', title: 'Preguntes freqüents.',
      items: [
        { q: 'On et bases i viatges per als projectes?', a: 'Base a Barcelona i viatjo regularment per Espanya, Europa i projectes internacionals.' },
        { q: 'Quant costa un vídeo corporatiu o una campanya?', a: 'Cada projecte es cotitza segons brief, dies de rodatge, equip i postproducció. Podem començar des de 350€ per peces senzilles i créixer fins on la creativitat i l’abast del client vulguin arribar.' },
        { q: 'Quin és el termini de lliurament habitual?', a: 'Un vídeo corporatiu es lliura en 3-4 setmanes. Campanyes publicitàries entre 6-10 setmanes.' },
        { q: 'Treballes amb agències i productores?', a: 'Sí, com a director, editor o videògraf freelance amb agències i productores. També assumeixo direcció creativa i disseny gràfic.' },
      ],
    },
    contact: {
      kicker: '08 — Contacte', title: 'Treballem junts.', sub: 'Explica\'m el teu projecte. Responc en menys de 24 hores.',
      name: 'Nom', email: 'Email', phone: 'Telèfon', company: 'Empresa', budget: 'Pressupost', type: 'Tipus de projecte', message: 'Explica\'m el teu projecte',
      send: 'Enviar missatge', sending: 'Enviant…', success: 'Missatge enviat. Et responc aviat.', error: 'Alguna cosa ha fallat. Escriu a jaredmisaelduron@gmail.com',
      types: ['Publicitat / Brand film', 'Vídeo corporatiu', 'Documental', 'Esdeveniment', 'Xarxes socials', 'Altres'],
      budgets: ['Des de 350€', '350€ - 1.500€', '1.500€ - 5.000€', '5.000€ - 15.000€', 'A mida / sense límit creatiu'],
    },
    footer: {
      tagline: 'Cinematic video production. Made in Barcelona.',
      rights: 'Tots els drets reservats.',
      privacy: 'Preferències de privacitat',
      seoKicker: 'Producció audiovisual a Barcelona',
      seoBody: 'Treballo amb marques, agències i projectes creatius que necessiten producció audiovisual a Barcelona: brand films, vídeo corporatiu, cobertura d’esdeveniments, contingut per a xarxes socials, edició de vídeo, motion graphics, disseny gràfic i peces cinematogràfiques pensades per comunicar amb claredat.',
    },
  },
}

/* ---------- Portfolio Data (imported from /lib/projects) ---------- */

/* ---------- Nav ---------- */
function Nav({ locale, setLocale, t }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let ticking = false
    const update = () => {
      setScrolled(window.scrollY > 96)
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 motion-reduce:transition-none ${scrolled ? 'border-b border-white/10 bg-[#070B1A]/78 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl' : 'border-transparent bg-transparent'}`}>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <a href="#top" className="flex items-center gap-2 group" aria-label="Home · Jared Durón">
          <div className="w-2 h-2 bg-white rounded-full group-hover:animate-pulse" />
          <span className="font-display text-lg tracking-tight">Jared Durón</span>
        </a>

        <nav className={`hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-500 motion-reduce:transition-none lg:flex ${scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`} aria-label="Primary navigation">
          {['work', 'about', 'services', 'process', 'blog', 'contact'].map((key) => (
            <a key={key} href={`#${key}`} aria-label={`${t.a11y.primaryLink}: ${t.nav[key]}`} className="hover:text-[#F5C518] transition-colors">{t.nav[key]}</a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className={`hidden items-center gap-1 rounded-full border border-white/10 p-1 text-[11px] uppercase tracking-widest transition-all duration-500 motion-reduce:transition-none md:flex ${scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}>
            {['es', 'en', 'ca'].map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-0.5 rounded-full transition-all ${locale === l ? 'bg-white text-black font-semibold' : 'font-medium text-white/60 hover:text-[#F5C518]'}`}
                aria-pressed={locale === l}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="#contact" aria-label={`${t.a11y.primaryLink}: ${t.hero.cta2}`} className={`hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-500 hover:border-[#F5C518]/70 hover:text-[#F5C518] motion-reduce:transition-none md:inline-flex ${scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}>
            {t.hero.cta2} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white backdrop-blur-sm transition-colors hover:border-white/45 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={t.hero.menuAria}
            aria-expanded={open}
          >
            <span className="sr-only">{t.hero.menuAria}</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-px w-5 bg-white transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`block h-px w-5 bg-white transition-transform ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mb-4 rounded-[24px] border border-white/10 bg-[#070B1A]/95 px-6 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:mx-10 lg:ml-auto lg:max-w-sm"
          >
            {['work', 'about', 'services', 'process', 'blog', 'contact'].map((k) => (
              <a key={k} href={`#${k}`} aria-label={`${t.a11y.mobileLink}: ${t.nav[k]}`} onClick={() => setOpen(false)} className="block border-b border-white/10 py-3 text-2xl font-semibold leading-none transition-colors last:border-b-0 hover:text-[#F5C518]">{t.nav[k]}</a>
            ))}
            <div className="flex gap-2 pt-4">
              {['es', 'en', 'ca'].map((l) => (
                <button key={l} onClick={() => setLocale(l)} className={`rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest ${locale === l ? 'bg-white text-black' : ''}`} aria-pressed={locale === l}>{l}</button>
              ))}
            </div>
            <a href="#contact" aria-label={`${t.a11y.mobileLink}: ${t.hero.cta2}`} onClick={() => setOpen(false)} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#F5C518]/55 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#F5C518]">
              {t.hero.cta2}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
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
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const [reelOpen, setReelOpen] = useState(false)
  const [heroName, heroRoleLine = ''] = t.hero.title.split(' · ')
  const [heroRole = '', ...heroPlaceParts] = heroRoleLine.split(' ')
  const heroPlace = heroPlaceParts.join(' ')
  const openReel = () => {
    trackEvent('reel_play', { location: 'hero' })
    setReelOpen(true)
  }

  return (
    <section ref={ref} id="top" className="cinematic-hero relative min-h-[100svh] w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <HeroMedia />
        <div className="absolute inset-0 hero-vignette" aria-hidden="true" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            className="sr-only"
          >
            <div className="w-8 h-[1px] bg-white/60" />
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70">{t.hero.eyebrow}</span>
          </motion.div>

          <h1 className="hero-viewfinder max-w-[min(92vw,1320px)] text-balance font-sans text-[clamp(0.98rem,2.05vw,2rem)] leading-[1.45] tracking-[0.16em] text-[#F6F4EF] md:tracking-[0.24em] 2xl:whitespace-nowrap">
            <motion.span
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="block will-change-transform"
            >
              <span className="font-semibold">{heroName}</span>
              <span aria-hidden="true" className="px-2 text-white/64">·</span>
              <span className="font-bold text-[#F5C518]">{heroRole}</span>
              {heroPlace && <span className="font-medium text-white/82"> {heroPlace}</span>}
            </motion.span>
          </h1>

        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="grid items-end gap-6 text-[11px] uppercase tracking-[0.26em] text-white/58 sm:grid-cols-3"
        >
          <div className="hidden text-white/35 sm:block">
            <span>41.3874° N</span>
          </div>
          <button
            type="button"
            onClick={openReel}
            data-cursor="Play"
            aria-label={t.hero.reelAria}
            className="group mx-auto inline-flex w-fit items-center gap-3 rounded-full border border-white/28 bg-white/[0.035] px-4 py-2.5 text-white/82 backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10 hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 transition-all group-hover:bg-white group-hover:text-black">
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            </span>
            <span>{t.hero.playReel}</span>
          </button>
          <div className="flex justify-center gap-2 sm:justify-end">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-[1px] h-8 bg-white/40" />
            <span>{t.hero.scroll}</span>
          </div>
        </motion.div>
      </motion.div>

      <ReelModal open={reelOpen} onClose={() => setReelOpen(false)} />
    </section>
  )
}

function ReelModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <button
            onClick={onClose} data-cursor="Close"
            className="absolute top-6 right-6 md:top-8 md:right-10 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
          >
            <video
              className="w-full h-full object-cover"
              controls autoPlay playsInline preload="auto"
              poster="/hero/hero-poster-desktop.jpg"
            >
              <source src="https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/qkv7mv6p_Toma%20Dron%201.mp4" type="video/mp4" />
              <source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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

/* ---------- Highlight helper: wraps keywords in yellow accent ---------- */
const HIGHLIGHT_WORDS = [
  // ES
  'filmmaker', 'Filmmaker', 'FILMMAKER',
  'videographer', 'Videographer', 'videógrafo',
  'diseñador gráfico', 'Diseñador Gráfico', 'graphic designer', 'Graphic Designer',
  'Barcelona', 'BARCELONA',
  'cinematográfico', 'cinematográfica', 'cinematográficas', 'cinematográficos', 'cinematográfic',
  'cinematic', 'Cinematic',
  'premium', 'Premium',
  'documental', 'documentales', 'Documental', 'documentary', 'Documentary',
  'producción audiovisual', 'video production', 'productora audiovisual',
  'vídeo corporativo', 'video corporativo', 'corporate video',
  'marca', 'marcas', 'brand', 'brands',
  'motion graphics', 'Motion Graphics',
  'color grading', 'Color Grading',
  'VideoMapping', 'videomapping',
  'John Deere', 'WWF', 'KNX', 'BCIE', 'Messe Frankfurt', 'Grupo Roble', 'Miniso',
  'ISE 2026', 'Light+Building',
]

function Highlight({ text, className = '' }) {
  // Build a regex that captures all highlight words (longer first to prioritize multi-word matches)
  const sorted = [...HIGHLIGHT_WORDS].sort((a, b) => b.length - a.length)
  const pattern = new RegExp(`(${sorted.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  const parts = text.split(pattern)
  return (
    <span className={className}>
      {parts.map((p, i) => (
        sorted.includes(p)
          ? <span key={i} className="text-[#F5C518]">{p}</span>
          : <span key={i}>{p}</span>
      ))}
    </span>
  )
}

/* ---------- Floating WhatsApp (persistent on all pages) ---------- */
function FloatingWhatsApp({ locale }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const label = locale === 'en' ? 'Chat on WhatsApp' : locale === 'ca' ? 'Xateja per WhatsApp' : 'Chatea por WhatsApp'
  const msg = locale === 'en' ? 'Hi Jared, I would love to work with you' : locale === 'ca' ? "Hola Jared, m'agradaria treballar amb tu" : 'Hola Jared, me gustaría trabajar contigo'

  return (
    <motion.a
      href={`https://wa.me/34637434235?text=${encodeURIComponent(msg)}`}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Chat"
      aria-label={label}
      onClick={() => trackEvent('whatsapp_click', { location: 'floating_button' })}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20, scale: visible ? 1 : 0.9 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed z-[70] bottom-5 right-5 md:bottom-8 md:right-8 group flex items-center gap-3"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <span className="hidden md:block bg-white text-black text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </span>
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
          <svg viewBox="0 0 32 32" className="w-7 h-7 md:w-8 md:h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.406-.545-.489-1.093-1.203-1.5-1.808-.043-.086-.087-.172-.087-.272 0-.316.977-.848.977-1.335 0-.114-.031-.242-.083-.362-.115-.263-.83-1.876-.985-2.155-.157-.283-.325-.436-.618-.436h-.618c-.199 0-.395.083-.535.222-.4.4-.945 1.146-.945 2.098 0 1.234.923 2.454 1.235 2.87 1.363 1.827 2.868 3.242 5.008 4.128.518.216 1.043.383 1.564.457.457.066.881.058 1.242-.006.55-.096 1.643-.669 1.87-1.322.086-.253.086-.472.048-.522-.031-.049-.101-.079-.202-.129-.099-.05-.622-.31-.79-.377-.132-.055-.284-.109-.415-.109zm-3.028 6.855h-.006a10.056 10.056 0 0 1-5.115-1.4l-.367-.218-3.803.996 1.015-3.71-.238-.379a10.078 10.078 0 0 1-1.545-5.383c.002-5.573 4.537-10.107 10.112-10.107a10.03 10.03 0 0 1 7.148 2.963c1.907 1.912 2.955 4.453 2.954 7.153-.003 5.573-4.537 10.086-10.112 10.086zm8.605-18.708C22.394 3.086 19.348 1.999 16.077 2 9.301 2 3.776 7.523 3.774 14.31c-.001 2.169.566 4.287 1.643 6.153L3.673 27.226l7.052-1.849a12.298 12.298 0 0 0 5.877 1.494h.006c6.775 0 12.302-5.523 12.305-12.31.001-3.288-1.276-6.379-3.598-8.703z" />
          </svg>
        </div>
      </div>
    </motion.a>
  )
}

const ABOUT_PORTRAITS = [
  '/IMG/portrait-main.webp',
  '/IMG/portrait-01.webp',
  '/IMG/portrait-02.webp',
  '/IMG/portrait-03.webp',
  '/IMG/portrait-04.webp',
  '/IMG/portrait-05.webp',
  '/IMG/portrait-06.webp',
  '/IMG/portrait-07.webp',
  '/IMG/portrait-08.webp',
  '/IMG/portrait-09.webp',
  '/IMG/portrait-10.webp',
  '/IMG/portrait-11.webp',
]

/* ---------- About ---------- */
function About({ t }) {
  const [activePortrait, setActivePortrait] = useState(0)
  const portraitMountedRef = useRef(false)
  const portrait = ABOUT_PORTRAITS[activePortrait]

  useEffect(() => {
    portraitMountedRef.current = true
  }, [])

  useEffect(() => {
    const duration = activePortrait === 0 ? 5000 : 3000
    const timeout = setTimeout(() => {
      setActivePortrait((current) => (current + 1) % ABOUT_PORTRAITS.length)
    }, duration)

    return () => clearTimeout(timeout)
  }, [activePortrait])

  useEffect(() => {
    const nextPortrait = ABOUT_PORTRAITS[(activePortrait + 1) % ABOUT_PORTRAITS.length]
    const preloader = new window.Image()
    preloader.src = nextPortrait
  }, [activePortrait])

  return (
    <section id="about" className="relative py-24 md:py-40 px-6 md:px-10">
      <div className="max-w-[1600px] mx-auto">
        <SectionKicker>{t.about.kicker}</SectionKicker>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center mt-8">
          {/* Portrait — symmetric left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <motion.div
                key={portrait}
                initial={portraitMountedRef.current ? { scale: 1.012 } : false}
                animate={{ scale: 1 }}
                transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={portrait}
                  alt={`Jared Durón — retrato ${activePortrait + 1}`}
                  fill
                  sizes="(min-width: 768px) 38vw, 100vw"
                  quality={78}
                  className="object-cover"
                  priority={activePortrait === 0}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-[11px] uppercase tracking-widest text-white/70">
                <span>Jared Durón</span>
                <span className="font-mono-num">EST. 2017</span>
              </div>
            </div>
          </motion.div>

          {/* Copy — symmetric right */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.2, delay: 0.2 }}
            className="md:col-span-7"
          >
            <h2 className="font-display max-w-4xl text-4xl leading-[1.05] tracking-normal text-balance md:text-5xl lg:text-6xl">
              {t.about.title}
            </h2>
            <div className="mt-8 space-y-5 text-white/70 leading-relaxed text-base md:text-[17px] max-w-2xl">
              <p><Highlight text={t.about.body1} /></p>
              <p><Highlight text={t.about.body2} /></p>
            </div>
          </motion.div>
        </div>

        {/* Stats — perfectly symmetric 4 cols */}
        <div className="experience-panel relative mt-16 scroll-mt-28 overflow-hidden border-t border-white/10 py-[46px] md:mt-22 md:py-[64px]">
          <div className="grid items-start justify-between gap-10 lg:grid-cols-[38%_56%] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <div className="mb-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-white/55">
                <span className="h-px w-10 bg-[#F5C518]" />
                <span>{t.about.experience.eyebrow}</span>
              </div>
              <h3 className="max-w-[590px] font-sans leading-[1] tracking-normal text-[#F6F4EF]">
                <span className="block text-[clamp(1.55rem,2.15vw,2.55rem)] font-semibold leading-[1.12] text-white/88">{t.about.experience.titleIntro}</span>
                <span className="mt-3 block whitespace-pre-line text-[clamp(2.05rem,3.35vw,4.1rem)] font-bold leading-[1] text-[#F5C518]">{t.about.experience.titleHighlight}</span>
              </h3>
              <div className="mt-5 h-px w-20 bg-[#F5C518]/70" />
              <div className="mt-6 max-w-xl space-y-3 text-sm leading-relaxed text-white/68 md:text-[15px]">
                <p><AccentText text={t.about.experience.body1} terms={t.about.experience.highlights1} /></p>
                <p><AccentText text={t.about.experience.body2} terms={t.about.experience.highlights2} /></p>
              </div>
            </motion.div>

            <div className="relative z-10 grid w-full max-w-[980px] justify-self-end self-start gap-4 sm:grid-cols-2">
              {t.about.stats.map((s, i) => (
                <StatCard key={s.n} stat={s} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AccentText({ text, terms = [] }) {
  if (!terms.length) return text

  const escaped = terms
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, index) => (
        terms.some((term) => term.toLowerCase() === part.toLowerCase())
          ? <strong key={`${part}-${index}`} className="font-semibold text-[#F5C518]">{part}</strong>
          : <span key={`${part}-${index}`}>{part}</span>
      ))}
    </>
  )
}

function StatCard({ stat, index }) {
  const Icon = [Clock3, Clapperboard, BadgeCheck, Layers3][index] || Star

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group min-h-[150px] rounded-[22px] border border-[#F5C518]/45 bg-white/[0.025] p-5 transition-colors duration-300 hover:border-[#F5C518]/70 hover:bg-white/[0.045] md:min-h-[168px] md:p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-[13px] border border-[#F5C518]/45 bg-[#F5C518]/10 text-[#F5C518]">
          <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="h-px flex-1 bg-[#F5C518]/25" aria-hidden="true" />
      </div>
      <div className="font-sans text-[clamp(3.15rem,5.45vw,5.05rem)] font-semibold leading-[0.84] tracking-[-0.03em] text-[#F6F4EF]">
        <AnimatedStatNumber value={stat.n} />
      </div>
      <div className="mt-4 max-w-[14rem] text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-white/66">
        {stat.l}
      </div>
    </motion.div>
  )
}

function AnimatedStatNumber({ value }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value)
  const [played, setPlayed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || played) return

    const match = String(value).match(/^(\d+)(.*)$/)
    if (!match) return

    const target = Number(match[1])
    const suffix = match[2]
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played) return
      setPlayed(true)

      if (reduceMotion) {
        setDisplay(value)
        observer.disconnect()
        return
      }

      const start = performance.now()
      const duration = 950
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(`${Math.round(target * eased)}${suffix}`)
        if (progress < 1) requestAnimationFrame(tick)
        else setDisplay(value)
      }

      setDisplay(`0${suffix}`)
      requestAnimationFrame(tick)
      observer.disconnect()
    }, { threshold: 0.45 })

    observer.observe(node)
    return () => observer.disconnect()
  }, [played, value])

  return <span ref={ref}>{display}</span>
}

/* ---------- Work ---------- */
function Work({ t, locale }) {
  const [active, setActive] = useState(null)
  const [activeCategory, setActiveCategory] = useState('filmmaking')
  const orderedProjects = useMemo(() => {
    const pinnedIds = ['pallapupas-videos', 'ayudas-invisibles-bts', 'cortometraje']
    const pinnedProjects = pinnedIds
      .map((id) => PROJECTS.find((project) => project.id === id))
      .filter(Boolean)
    const barcelonaProjects = PROJECTS.filter((project) => (
      !pinnedIds.includes(project.id) && project.location?.toLowerCase().includes('barcelona')
    ))
    const otherProjects = PROJECTS.filter((project) => (
      !pinnedIds.includes(project.id) && !project.location?.toLowerCase().includes('barcelona')
    ))

    return [
      ...pinnedProjects,
      ...barcelonaProjects,
      ...otherProjects,
    ]
  }, [])

  const photographyProjectIds = ['barcelona-city', 'cyberpunk-portraits', 'fotografia-producto']
  const graphicDesignProjectIds = ['john-deere-expo', 'miniso', 'fotomontaje-epico']
  const filmmakingProjects = useMemo(
    () => orderedProjects.filter((project) => !photographyProjectIds.includes(project.id) && !graphicDesignProjectIds.includes(project.id)),
    [orderedProjects]
  )

  const photographyProjects = useMemo(
    () => [
      ...orderedProjects.filter((project) => photographyProjectIds.includes(project.id)),
      ...PORTFOLIO_CATEGORY_PROJECTS.filter((project) => project.categoryGroup === 'photography'),
    ],
    [orderedProjects]
  )
  const graphicDesignProjects = useMemo(
    () => [
      ...orderedProjects.filter((project) => graphicDesignProjectIds.includes(project.id)),
      ...PORTFOLIO_CATEGORY_PROJECTS.filter((project) => project.categoryGroup === 'graphic-design'),
    ],
    [orderedProjects]
  )

  useEffect(() => {
    const sections = ['filmmaking', 'fotografia', 'diseno-grafico']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveCategory(visible.target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.35] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const scrollToCategory = (event, id) => {
    event.preventDefault()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  const categoryLinks = [
    { id: 'filmmaking', label: t.work.nav.filmmaking },
    { id: 'fotografia', label: t.work.nav.photography },
    { id: 'diseno-grafico', label: t.work.nav.graphicDesign },
  ]

  return (
    <section id="work" aria-label={t.nav.work} className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <nav aria-label={t.nav.work} className="mb-20 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-white/10 py-4 md:mb-28">
          {categoryLinks.map((link, index) => (
            <span key={link.id} className="inline-flex items-center gap-3">
              {index > 0 && <span aria-hidden="true" className="text-white/25">·</span>}
              <a
                href={`#${link.id}`}
                onClick={(event) => scrollToCategory(event, link.id)}
                aria-current={activeCategory === link.id ? 'location' : undefined}
                className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-colors motion-reduce:transition-none ${activeCategory === link.id ? 'text-[#F5C518]' : 'text-white/55 hover:text-white'}`}
              >
                {link.label}
              </a>
            </span>
          ))}
        </nav>

        <PortfolioCategory id="filmmaking" headingId="filmmaking-title" copy={t.work.filmmaking}>
          <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filmmakingProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} locale={locale} onOpen={() => setActive(p)} />
            ))}
          </div>
        </PortfolioCategory>

        <PortfolioCategory id="fotografia" headingId="fotografia-title" copy={t.work.photography} separated>
          <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {photographyProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} locale={locale} external={Boolean(p.categoryGroup)} onOpen={() => setActive(p)} />
            ))}
          </div>
        </PortfolioCategory>

        <PortfolioCategory id="diseno-grafico" headingId="diseno-grafico-title" copy={t.work.graphicDesign} separated>
          <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {graphicDesignProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} locale={locale} external={Boolean(p.categoryGroup)} onOpen={() => setActive(p)} />
            ))}
          </div>
        </PortfolioCategory>
      </div>
      <ProjectModal project={active} locale={locale} onClose={() => setActive(null)} />
    </section>
  )
}

function PortfolioCategory({ id, headingId, copy, separated = false, children }) {
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-28 ${separated ? 'mt-28 border-t border-[#F5C518]/15 pt-28 md:mt-44 md:pt-40' : ''}`}>
      <header className="mb-14 md:mb-20">
        <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">{copy.eyebrow}</div>
        <h2 id={headingId} className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.98] tracking-tight text-balance">
          <span className="block text-white">{copy.title}</span>
          {copy.highlight && <span className="block text-[#F5C518]">{copy.highlight}</span>}
        </h2>
        <p className="mt-7 max-w-[760px] text-base leading-[1.7] text-white/62 md:text-lg">{copy.description}</p>
        <div aria-hidden="true" className="mt-8 h-px w-20 bg-[#F5C518]" />
      </header>
      {children}
    </section>
  )
}

function ProjectCard({ project, index, locale, onOpen, external = false }) {
  const trackProjectOpen = () => {
    trackEvent('project_open', {
      project_slug: project.slug || project.id,
      project_category: project.categoryGroup || project.category?.[locale] || 'portfolio',
    })
  }
  const sharedProps = {
    'data-cursor': external ? 'Open' : 'View',
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-30px' },
    transition: { duration: 0.8, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] },
    className: 'group block text-left w-full min-w-0',
  }

  const content = (
    <>
      <div className="relative overflow-hidden aspect-square bg-neutral-900">
        <div className="absolute inset-0">
          <Image
            src={project.cover}
            alt={project.alt?.[locale] || `${project.title} — ${project.client} — Jared Durón filmmaker Barcelona`}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
            quality={68}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500 motion-reduce:transition-none" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start text-[10px] uppercase tracking-widest text-white/80">
          <span className="truncate max-w-[60%]">{project.category[locale]}</span>
          <span className="font-mono-num">{project.year}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white gap-3">
          <div className="min-w-0">
            <p className={`font-display text-lg md:text-xl leading-tight tracking-tight ${external ? 'line-clamp-2' : 'truncate'}`}>{project.title}</p>
            <div className="text-[11px] text-white/70 mt-0.5 truncate">{external ? 'Behance' : project.client}</div>
          </div>
          <div className="w-9 h-9 shrink-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500 motion-reduce:transition-none">
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3 text-[11px] uppercase tracking-widest text-white/40">
        <span className="truncate">{external ? project.category[locale] : project.location}</span>
        <span className="text-right shrink-0">{external ? 'Behance' : project.role}</span>
      </div>
    </>
  )

  if (external) {
    const externalLabel = locale === 'en' ? 'View project on Behance' : locale === 'ca' ? 'Veure projecte a Behance' : 'Ver proyecto en Behance'
    return <motion.a {...sharedProps} href={project.behanceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${externalLabel}: ${project.title}`} onClick={trackProjectOpen}>{content}</motion.a>
  }

  return (
    <motion.button
      type="button"
      onClick={() => {
        trackProjectOpen()
        onOpen?.()
      }}
      {...sharedProps}
    >
      {content}
    </motion.button>
  )
}

function ProjectModal({ project, locale, onClose }) {
  const [loadMedia, setLoadMedia] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const lightboxRef = useRef(null)
  const behanceProjectId = project?.behanceUrl?.match(/\/gallery\/(\d+)/)?.[1]
  const behanceEmbedUrl = behanceProjectId && !project?.hideBehancePreview ? `https://www.behance.net/embed/project/${behanceProjectId}?ilo0=1` : null
  const hasVideos = Boolean(project?.videoEmbeds?.length)
  const isPhotoProject = project?.type === 'photo'
  const mediaLabel = locale === 'en' ? 'Project film' : locale === 'ca' ? 'Film del projecte' : 'Video del proyecto'
  const loadLabel = locale === 'en' ? 'Load video' : locale === 'ca' ? 'Carregar video' : 'Cargar video'
  const galleryLabel = locale === 'en' ? 'Visual material' : locale === 'ca' ? 'Material visual' : 'Material visual'
  const detailsLabel = locale === 'en' ? 'Project details' : locale === 'ca' ? 'Detalls del projecte' : 'Detalles del proyecto'
  const behanceLabel = locale === 'en' ? 'View project on Behance' : locale === 'ca' ? 'Veure projecte a Behance' : 'Ver proyecto en Behance'
  const lightboxImage = typeof lightboxIndex === 'number' ? project?.gallery?.[lightboxIndex] : null

  const showPrevPhoto = () => {
    if (!project?.gallery?.length) return
    setLightboxIndex((current) => (current === null ? 0 : (current - 1 + project.gallery.length) % project.gallery.length))
  }

  const showNextPhoto = () => {
    if (!project?.gallery?.length) return
    setLightboxIndex((current) => (current === null ? 0 : (current + 1) % project.gallery.length))
  }

  useEffect(() => {
    lightboxRef.current = lightboxIndex
  }, [lightboxIndex])

  useEffect(() => {
    if (!project) return
    setLoadMedia(false)
    setLightboxIndex(null)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxRef.current !== null) setLightboxIndex(null)
        else onClose()
        return
      }
      if (lightboxRef.current === null) return
      if (e.key === 'ArrowLeft') showPrevPhoto()
      if (e.key === 'ArrowRight') showNextPhoto()
    }
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
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-[120] overflow-y-auto bg-[#030711]"
          onClick={onClose}
        >
          <div className="fixed inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-[#030711] via-[#030711]/92 to-transparent pointer-events-none" />
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative min-h-screen w-full px-5 py-24 md:px-10 md:py-28"
          >
            <button
              type="button"
              onClick={onClose}
              data-cursor="Close"
              className="fixed right-4 top-4 md:right-8 md:top-7 z-30 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#F5C518] transition-colors shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative mx-auto w-full max-w-[1280px] overflow-visible">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(28,67,138,0.30),transparent_42%),linear-gradient(180deg,#061126_0%,#030711_48%,#02040A_100%)]" />

              <div className="relative text-center">
                <div className="text-[11px] uppercase tracking-[0.3em] text-white/55 mb-4">{project.category[locale]} · {project.year}</div>
                <h2 className="mx-auto max-w-5xl font-display text-5xl md:text-8xl lg:text-9xl leading-[0.92] tracking-tight text-balance">
                  {project.title}
                </h2>
                <div className="mt-6 md:mt-8 font-display italic text-2xl md:text-4xl text-white/68">{project.subtitle}</div>
                <div className="mx-auto mt-8 md:mt-10 max-w-3xl border border-white/10 bg-white/[0.035] px-6 py-6 text-sm leading-relaxed text-white/68 shadow-[0_24px_80px_rgba(0,0,0,0.32)] md:px-10 md:py-8 md:text-base">
                  {project.description[locale]}
                </div>

                <div className="hidden">
                  <div className="lg:col-span-4">
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-5">
                      <MetaRow k="Client" v={project.client} />
                      <MetaRow k="Role" v={project.role} />
                      <MetaRow k="Location" v={project.location} />
                      <MetaRow k="Year" v={project.year} />
                    </div>
                    {project.tools?.length > 0 && false && <MetaRow k="Tools" v={project.tools.join(' · ')} /> /* Tools intentionally hidden */}
                    {project.tags?.length > 0 && (
                      <div className="mt-6">
                        <div className="text-[11px] uppercase tracking-widest text-white/45 mb-2">Tags</div>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="text-[11px] px-2.5 py-1 border border-white/15 rounded-full bg-black/35 text-white/75">{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {project.behanceUrl && (
                      <a
                        href={project.behanceUrl}
                        target="_blank" rel="noopener noreferrer"
                        aria-label={`${behanceLabel}: ${project.title}`}
                        className="mt-6 inline-flex items-center gap-3 bg-white text-black px-5 py-3 rounded-full text-xs uppercase tracking-wider hover:bg-[#F5C518] transition-colors group"
                      >
                        View on Behance <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      </a>
                    )}
                  </div>
                  <div className="lg:col-span-8 bg-[#08152B] border border-white/10 p-5 md:p-7">
                    <p className="text-base md:text-lg text-white/88 leading-relaxed">{project.description[locale]}</p>
                  </div>
                </div>
              </div>
              {hasVideos && (
                <section className="relative mt-16 md:mt-24">
                  <div className="mb-4 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-[#F5C518]/85">{mediaLabel}</div>
                    {!loadMedia && (
                      <button
                        type="button"
                        onClick={() => setLoadMedia(true)}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] uppercase tracking-widest text-black hover:bg-[#F5C518] transition-colors"
                      >
                        {loadLabel}
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {loadMedia ? (
                    <div className="grid gap-5">
                      {project.videoEmbeds.map((src, idx) => (
                        <div key={src} className="relative aspect-video overflow-hidden border border-white/10 bg-black shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                          <iframe
                            src={src}
                            title={`${project.title} video ${idx + 1}`}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full border-0"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLoadMedia(true)}
                      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden border border-white/10 bg-black text-white shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
                    >
                      <Image
                        src={project.cover}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 1024px, 100vw"
                        quality={70}
                        className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#02040A]/90 via-[#031026]/30 to-transparent" />
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-105">
                        <Play className="h-6 w-6 translate-x-0.5" />
                      </span>
                    </button>
                  )}
                </section>
              )}

              <div className="relative mt-12 md:mt-16">
                <div className="mb-4 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.28em] text-white/55">{galleryLabel}</div>
                {isPhotoProject ? (
                  <PhotoMosaic project={project} onOpen={setLightboxIndex} />
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {project.gallery.map((img, idx) => (
                      <div
                        key={idx}
                        className="overflow-hidden bg-[#030A18]/72 border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.42)]"
                      >
                        <Image
                          src={img}
                          alt={`Material visual de ${project.title} ${idx + 1}`}
                          width={1400}
                          height={900}
                          loading="lazy"
                          sizes="(min-width: 1280px) 1180px, 100vw"
                          quality={72}
                          className="h-auto w-full"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <section className="mt-10 md:mt-14 border border-white/10 bg-[#061126]/88 p-5 md:p-8">
                  <div className="mb-6 text-[10px] uppercase tracking-[0.28em] text-white/55">{detailsLabel}</div>
                  <div className="grid gap-6 md:grid-cols-4">
                    <MetaRow k="Client" v={project.client} />
                    <MetaRow k="Role" v={project.role} />
                    <MetaRow k="Location" v={project.location} />
                    <MetaRow k="Year" v={project.year} />
                  </div>
                  {project.tags?.length > 0 && (
                    <div className="mt-7 flex flex-wrap justify-center gap-2 md:justify-start">
                      {project.tags.map(tag => (
                        <span key={tag} className="rounded-full border border-white/12 bg-black/30 px-3 py-1.5 text-[11px] text-white/65">{tag}</span>
                      ))}
                    </div>
                  )}
                  {project.behanceUrl && (
                    <a
                      href={project.behanceUrl}
                      target="_blank" rel="noopener noreferrer"
                      aria-label={`${behanceLabel}: ${project.title}`}
                      className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs uppercase tracking-wider text-black transition-colors hover:bg-[#F5C518] group"
                    >
                      View on Behance <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </a>
                  )}
                </section>

                {false && project.videoEmbeds?.length > 0 && (
                  <div className="mt-10 md:mt-14 border border-white/10 bg-[#030A18]/72 shadow-[0_18px_60px_rgba(0,0,0,0.42)] overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 md:px-6 py-4 border-b border-white/10">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.28em] text-[#F5C518]/80">Videos del proyecto</div>
                        <div className="mt-1 text-sm text-white/65">Carga los players solo cuando los necesites</div>
                      </div>
                      {!loadMedia && (
                        <button
                          type="button"
                          onClick={() => setLoadMedia(true)}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] uppercase tracking-widest text-black hover:bg-[#F5C518] transition-colors"
                        >
                          Cargar videos
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {loadMedia ? (
                      <div className="grid gap-4 md:gap-6 p-4 md:p-6">
                        {project.videoEmbeds.map((src, idx) => (
                          <div key={src} className="relative aspect-video overflow-hidden bg-[#050A16] border border-white/10">
                            <iframe
                              src={src}
                              title={`${project.title} video ${idx + 1}`}
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full border-0"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-white/55">Los videos no se cargan automáticamente para mantener fluido el scroll y el popup.</div>
                    )}
                  </div>
                )}

                {behanceEmbedUrl && (
                  <div className="mt-10 md:mt-14 border border-white/10 bg-[#030A18]/72 shadow-[0_18px_60px_rgba(0,0,0,0.42)] overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 md:px-6 py-4 border-b border-white/10">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.28em] text-[#F5C518]/80">Preview sacado de Behance</div>
                        <div className="mt-1 text-sm text-white/65">Video, fotos y case study publicado del proyecto</div>
                      </div>
                      <a
                        href={project.behanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${behanceLabel}: ${project.title}`}
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                      >
                        Abrir en Behance
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    {loadMedia ? (
                      <div className="relative h-[520px] md:h-[680px] bg-[#050A16]">
                        <iframe
                          src={behanceEmbedUrl}
                          title={`${project.title} Behance preview`}
                          loading="lazy"
                          allowFullScreen
                          allow="clipboard-write; fullscreen"
                          className="absolute inset-0 w-full h-full border-0"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLoadMedia(true)}
                        className="flex min-h-[220px] w-full flex-col items-center justify-center gap-4 bg-[#050A16] px-6 text-center text-white/70 hover:text-white transition-colors"
                      >
                        <span className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center">
                          <Play className="w-5 h-5" />
                        </span>
                        <span className="text-sm uppercase tracking-widest">Cargar preview de Behance</span>
                        <span className="max-w-md text-xs normal-case tracking-normal text-white/45">Se carga bajo demanda para mantener fluido el scroll y la apertura del popup.</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-14 md:mt-20 text-center border-t border-white/10 pt-12 md:pt-16">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-4">Next chapter</div>
                  <a href="#contact" onClick={onClose} className="font-display text-4xl md:text-6xl italic hover:text-white/60 transition-colors">
                    Let&apos;s work together →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          <PhotoLightbox
            image={lightboxImage}
            images={project.gallery}
            currentIndex={lightboxIndex}
            projectTitle={project.title}
            onClose={() => setLightboxIndex(null)}
            onPrev={showPrevPhoto}
            onNext={showNextPhoto}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PhotoMosaic({ project, onOpen }) {
  return (
    <div className="grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4 md:gap-5">
      {project.gallery.map((img, idx) => {
        const featured = idx % 7 === 0
        const wide = idx % 7 === 3
        const tileClass = featured ? 'md:col-span-2 md:row-span-2' : wide ? 'md:col-span-2' : ''

        return (
          <button
            key={img}
            type="button"
            onClick={() => onOpen(idx)}
            className={`group relative overflow-hidden border border-white/10 bg-[#030A18]/72 shadow-[0_18px_60px_rgba(0,0,0,0.38)] ${tileClass}`}
            aria-label={`Abrir foto ${idx + 1} de ${project.title}`}
          >
            <Image
              src={img}
              alt={`Fotografia de ${project.title} ${idx + 1}`}
              fill
              loading="lazy"
              sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 50vw"
              quality={72}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/18" />
          </button>
        )
      })}
    </div>
  )
}

function PhotoLightbox({ image, images, currentIndex, projectTitle, onClose, onPrev, onNext }) {
  const total = images?.length || 0

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden bg-black/82 p-4 backdrop-blur-2xl md:p-10"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <div className="absolute inset-0 opacity-28 blur-3xl">
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              quality={40}
              className="scale-110 object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#030711]/85 via-black/72 to-[#030711]/90" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#F5C518] md:right-8 md:top-8"
            aria-label="Cerrar imagen"
          >
            <X className="h-5 w-5" />
          </button>
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev()
                }}
                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black md:left-8 md:h-12 md:w-12"
                aria-label="Foto anterior"
              >
                <span className="text-2xl leading-none">‹</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black md:right-8 md:h-12 md:w-12"
                aria-label="Foto siguiente"
              >
                <span className="text-2xl leading-none">›</span>
              </button>
            </>
          )}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="relative h-[82dvh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={image}
              alt={`Foto ampliada de ${projectTitle}`}
              fill
              sizes="100vw"
              quality={82}
              className="object-contain"
            />
          </motion.div>
          {total > 1 && (
            <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-black/45 px-4 py-2 font-mono-num text-[11px] tracking-[0.24em] text-white/70 backdrop-blur-md">
              {String((currentIndex ?? 0) + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          )}
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
  const posts = BLOG_POSTS.slice(0, 6)
  const [activePost, setActivePost] = useState(null)

  return (
    <section id="blog" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <SectionKicker>08 — {locale === 'en' ? 'Journal' : 'Blog'}</SectionKicker>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-3xl text-balance flex items-baseline gap-4">
              {locale === 'es' ? 'Ideas sobre cine, marca y producción.' : locale === 'ca' ? 'Idees sobre cinema, marca i producció.' : 'Ideas on cinema, brand and production.'}
              <motion.span animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex text-[#F5C518]">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </motion.span>
            </h2>
          </div>
        </div>
        <div className="border-t border-white/10">
          {posts.map((post, i) => (
            <BlogRow key={post.slug} post={post} index={i} locale={locale} onOpen={() => setActivePost(post)} />
          ))}
        </div>
      </div>
      <BlogModal post={activePost} locale={locale} onClose={() => setActivePost(null)} />
    </section>
  )
}

function BlogRow({ post, index, locale, onOpen }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="Read"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.05 }}
      className="group grid grid-cols-12 items-baseline gap-4 md:gap-6 py-8 md:py-10 border-b border-white/10 relative overflow-hidden text-left w-full"
    >
      <span
        className="absolute left-0 bottom-0 h-[1px] bg-[#F5C518] transition-transform duration-700 ease-out origin-left"
        style={{ width: '100%', transform: hover ? 'scaleX(1)' : 'scaleX(0)' }}
      />

      <div className="col-span-2 md:col-span-1 text-[11px] uppercase tracking-widest text-white/40 font-mono-num">
        0{index + 1}
      </div>

      <div className="col-span-10 md:col-span-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#F5C518]">
          <span className="w-1 h-1 rounded-full bg-[#F5C518]" />
          {post.category[locale]}
        </span>
      </div>

      <div className="col-span-12 md:col-span-6">
        <h3 className={`font-display text-2xl md:text-3xl lg:text-4xl leading-[1.1] tracking-tight text-balance transition-all duration-500 ${hover ? 'italic translate-x-1' : ''}`}>
          {post.title[locale]}
        </h3>
      </div>

      <div className="hidden md:block md:col-span-2 text-[11px] uppercase tracking-widest text-white/40 font-mono-num text-right">
        {new Date(post.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ca' ? 'ca-ES' : 'es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
        <div className="mt-1 text-white/30">{post.read}</div>
      </div>

      <div className="col-span-12 md:col-span-1 flex md:justify-end">
        <motion.span
          animate={hover ? { rotate: 45, backgroundColor: '#F5C518', color: '#000' } : { rotate: 0 }}
          transition={{ duration: 0.4 }}
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80"
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.span>
      </div>
    </motion.button>
  )
}

function BlogModal({ post, locale, onClose }) {
  useEffect(() => {
    if (!post) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [post, onClose])

  const content = post ? (post.content?.[locale] || post.content?.es || [post.excerpt?.[locale] || post.excerpt?.es]) : []
  const dateLocale = locale === 'en' ? 'en-US' : locale === 'ca' ? 'ca-ES' : 'es-ES'

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          className="fixed inset-0 z-[85] bg-black/70 px-4 py-5 md:px-10 md:py-10 overflow-y-auto"
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-modal-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.82, y: 36, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 24, filter: 'blur(10px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-5xl overflow-hidden border border-white/15 bg-[#080A12]/95 shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
          >
            <button
              onClick={onClose}
              data-cursor="Close"
              className="absolute right-4 top-4 z-20 w-11 h-11 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              aria-label="Close blog article"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid lg:grid-cols-12 min-h-[70vh]">
              <div className="relative lg:col-span-5 min-h-[260px] lg:min-h-full bg-neutral-950">
                <Image
                  src={post.cover}
                  alt={post.title[locale]}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 420px, 100vw"
                  quality={70}
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080A12] via-[#080A12]/25 to-black/10" />
                <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between gap-4 text-[10px] uppercase tracking-[0.28em] text-white/70">
                  <span className="text-[#F5C518]">{post.category[locale]}</span>
                  <span className="font-mono-num">{post.read}</span>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 md:p-10 lg:p-12">
                <div className="text-[11px] uppercase tracking-[0.32em] text-white/45 font-mono-num">
                  {new Date(post.date).toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 id="blog-modal-title" className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight mt-5 text-balance">
                  {post.title[locale]}
                </h3>
                <p className="mt-6 text-white/55 leading-relaxed max-w-2xl">
                  {post.excerpt[locale]}
                </p>

                <div className="my-8 h-[1px] bg-gradient-to-r from-[#F5C518] via-white/15 to-transparent" />

                <div className="space-y-5 text-white/75 leading-relaxed text-[15px] md:text-[17px]">
                  {content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                    Jared Durón · Barcelona
                  </div>
                  <a
                    href="#contact"
                    onClick={onClose}
                    data-cursor="Contact"
                    className="inline-flex items-center justify-center gap-3 bg-white text-black px-5 py-3 rounded-full text-[11px] uppercase tracking-widest hover:bg-[#F5C518] transition-colors"
                  >
                    Trabajemos juntos
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
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
        <p className={`font-display text-2xl md:text-4xl tracking-tight transition-all duration-500 ${hover ? 'italic translate-x-2' : ''}`}>
          {title}
        </p>
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
  const initials = item.a.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <section id="testimonials" className="relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto flex flex-col items-center text-center">
        <div className="flex justify-center">
          <SectionKicker>{t.testimonials.kicker}</SectionKicker>
        </div>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-4xl text-balance flex items-baseline justify-center gap-4">
          {t.testimonials.title}
          <motion.span animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex text-[#F5C518]">
            <Star className="w-7 h-7 md:w-9 md:h-9 fill-[#F5C518]" strokeWidth={0} />
          </motion.span>
        </h2>

        <div className="mt-16 md:mt-24 max-w-5xl mx-auto min-h-[520px] sm:min-h-[460px] md:min-h-[440px] lg:min-h-[390px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7 }}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                {[0,1,2,3,4].map((n) => (
                  <motion.span
                    key={n}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + n * 0.08, type: 'spring' }}
                    className="text-[#F5C518]"
                  >
                    <Star className="w-4 h-4 fill-[#F5C518]" strokeWidth={0} />
                  </motion.span>
                ))}
              </div>
              <p className="font-display text-2xl md:text-4xl lg:text-5xl leading-[1.2] italic text-balance">
                &ldquo;{item.q}&rdquo;
              </p>
              <footer className="mt-8 md:mt-12 flex items-center justify-center gap-4 md:gap-5 text-sm">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#F5C518] to-[#E8A800] flex items-center justify-center text-black font-display text-lg md:text-xl">
                  {initials}
                </div>
                <div>
                  <div className="font-medium text-base">{item.a}</div>
                  <div className="text-white/50 text-xs md:text-sm">{item.r}</div>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-12 flex min-h-[92px] justify-center gap-3 flex-wrap">
            {t.testimonials.items.map((item2, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`text-center transition-all duration-500 px-4 py-3 rounded-lg border ${idx === i ? 'bg-white/5 border-[#F5C518]/40' : 'border-white/10 hover:border-white/30'}`}
              >
                <div className={`text-xs font-medium ${idx === i ? 'text-[#F5C518]' : 'text-white/70'}`}>{item2.a}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{item2.r}</div>
              </button>
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
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', budget: '', projectType: '', message: '' })
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
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.detail || data.error || t.contact.error)
      trackEvent('contact_submit', { status: 'success' })
      const { toast } = await import('sonner')
      toast.success(t.contact.success)
      setForm({ name: '', email: '', phone: '', company: '', budget: '', projectType: '', message: '' })
    } catch (error) {
      trackEvent('contact_submit', { status: 'error' })
      const { toast } = await import('sonner')
      toast.error(error.message || t.contact.error)
    } finally { setLoading(false) }
  }

  return (
    <section id="contact" className="deferred-section relative py-24 md:py-40 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-8 md:gap-16">
        <div className="md:col-span-5">
          <SectionKicker>{t.contact.kicker}</SectionKicker>
          <h2 className="font-display text-5xl md:text-7xl leading-[1] tracking-tight mt-6 text-balance">
            {t.contact.title}
          </h2>
          <p className="mt-6 text-white/60 leading-relaxed max-w-md">{t.contact.sub}</p>

          <div className="mt-12 space-y-4 text-sm">
            <a href="https://wa.me/34637434235?text=Hola%20Jared%2C%20me%20interesa%20trabajar%20contigo" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { location: 'contact_section' })} data-cursor="Chat" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
              <MessageCircle className="w-4 h-4" /> WhatsApp · +34 637 43 42 35
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="mailto:jaredmisaelduron@gmail.com" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
              <Mail className="w-4 h-4" /> jaredmisaelduron@gmail.com
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            {SOCIAL_LINKS.map((social) => {
              const SocialIcon = social.id === 'instagram' ? Instagram : social.id === 'linkedin' ? Linkedin : social.id === 'youtube' ? Play : ExternalLink
              return (
                <a key={social.id} href={social.url} target="_blank" rel="me noopener noreferrer" aria-label={`${social.ariaLabel[locale]}. ${social.name} · ${social.user}`} onClick={() => trackEvent('social_click', { network: social.id, location: 'contact_section' })} className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
                  <SocialIcon aria-hidden="true" className="w-4 h-4" /> {social.name} · {social.user}
                  <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )
            })}
            <div className="flex items-center gap-4 text-white/60 pt-4">
              <MapPin className="w-4 h-4" /> Barcelona, Catalunya · Available worldwide
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="md:col-span-7 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label={t.contact.name} htmlFor="contact-name" required>
              <input id="contact-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors" />
            </FormField>
            <FormField label={t.contact.email} htmlFor="contact-email" required>
              <input id="contact-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors" />
            </FormField>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label={t.contact.company} htmlFor="contact-company">
              <input id="contact-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors" />
            </FormField>
            <FormField label={t.contact.phone} htmlFor="contact-phone">
              <input id="contact-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+34 600 000 000" className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors placeholder:text-white/25" />
            </FormField>
          </div>
          <FormField label={t.contact.budget}>
            <div className="flex flex-wrap gap-2 pt-2">
              {t.contact.budgets.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setForm({ ...form, budget: b })}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${form.budget === b ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/60'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </FormField>
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
          <FormField label={t.contact.message} htmlFor="contact-message" required>
            <textarea id="contact-message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-3 text-lg transition-colors resize-none" />
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

function FormField({ label, htmlFor, required, children }) {
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="block text-[11px] uppercase tracking-widest text-white/50 mb-1">
          {label}{required && <span className="text-white/40"> *</span>}
        </label>
      ) : (
        <div className="block text-[11px] uppercase tracking-widest text-white/50 mb-1">
          {label}{required && <span className="text-white/40"> *</span>}
        </div>
      )}
      {children}
    </div>
  )
}

/* ---------- Footer ---------- */
function Footer({ t, locale }) {
  return (
    <footer className="relative border-t border-white/10 px-6 md:px-10 py-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <p className="font-display text-4xl md:text-6xl leading-tight text-balance">
              Jared Durón<span className="text-white/40">.</span>
            </p>
            <p className="mt-4 text-white/50 max-w-md">{t.footer.tagline}</p>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-widest text-white/40 mb-4">Menu</div>
            <ul className="space-y-2 text-sm">
              {['work', 'about', 'services', 'process', 'blog', 'contact'].map((k) => (
                <li key={k}><a href={`#${k}`} aria-label={`${t.a11y.footerLink}: ${t.nav[k]}`} className="hover:text-white/60">{t.nav[k]}</a></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-widest text-white/40 mb-4">Social</div>
            <ul className="space-y-2 text-sm">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.id}>
                  <a href={social.url} target="_blank" rel="me noopener noreferrer" aria-label={social.ariaLabel[locale]} onClick={() => trackEvent('social_click', { network: social.id, location: 'footer' })} className="hover:text-white/60">{social.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-widest text-white/40 mb-4">Contact</div>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:jaredmisaelduron@gmail.com" className="hover:text-white/60 break-all">jaredmisaelduron@gmail.com</a></li>
              <li><a href="https://wa.me/34637434235" onClick={() => trackEvent('whatsapp_click', { location: 'footer' })} className="hover:text-white/60">+34 637 43 42 35</a></li>
              <li className="text-white/60">Barcelona, ES</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs uppercase tracking-widest text-white/40">
          <div>© {new Date().getFullYear()} Jared Durón. {t.footer.rights}</div>
          <div className="flex gap-6">
            <span>Made in Barcelona</span>
            <button type="button" onClick={openConsentPreferences} className="text-left hover:text-white">{t.footer.privacy}</button>
          </div>
        </div>

        {/* Natural SEO copy for organic discovery */}
        <div className="mt-14 pt-10 border-t border-white/5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518]" />
            <span>{t.footer.seoKicker}</span>
          </div>
          <p className="max-w-4xl text-sm md:text-base text-white/45 leading-relaxed">
            {t.footer.seoBody}
          </p>
        </div>      </div>
    </footer>
  )
}

function SectionKicker({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
      className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/50"
    >
      <div className="w-6 h-[1px] bg-[#F5C518]" />
      <motion.span
        animate={{ scale: [1, 1.15, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-1.5 h-1.5 rounded-full bg-[#F5C518]"
      />
      <span>{children}</span>
    </motion.div>
  )
}

/* ---------- Loader ---------- */
function Loader() {
  const [mounted, setMounted] = useState(false)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setMounted(true)

    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 8 + 3
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(() => setDone(true), 900)
      }
      setProgress(Math.floor(p))
    }, 90)
    return () => clearInterval(id)
  }, [])

  // Deterministic star grid for loader
  const stars = useMemo(() => {
    const rand = (seed) => { const x = Math.sin(seed) * 10000; return x - Math.floor(x) }
    return Array.from({ length: 100 }).map((_, i) => ({
      x: rand(i * 3.1) * 100,
      y: rand(i * 7.7) * 100,
      s: rand(i * 2.3) * 2 + 0.6,
      o: rand(i * 5.5) * 0.7 + 0.2,
      d: rand(i * 11.1) * 3 + 2,
      dl: rand(i * 13.3) * 4,
      yellow: rand(i * 17.7) > 0.86,
    }))
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 1.6, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 50% 30%, rgba(30,58,138,0.35), transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(8,12,30,0.6), transparent 70%), linear-gradient(180deg, #050813 0%, #080B1A 50%, #050609 100%)',
          }}
        >
          {/* Deep space stars */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            {mounted && stars.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full animate-twinkle"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: `${s.s}px`,
                  height: `${s.s}px`,
                  background: s.yellow ? '#F5C518' : '#FFFFFF',
                  '--tw-op': s.o,
                  '--tw-dur': `${s.d}s`,
                  animationDelay: `${s.dl}s`,
                  boxShadow: s.yellow ? `0 0 ${s.s * 3}px #F5C518` : `0 0 ${s.s * 2}px rgba(255,255,255,0.5)`,
                }}
              />
            ))}
          </div>

          {/* Cinematic drift particles (bigger yellow stars floating slowly) */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            {[15, 40, 65, 82].map((left, i) => (
              <motion.span
                key={i}
                initial={{ y: '110vh', opacity: 0 }}
                animate={{ y: '-10vh', opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.5, ease: 'linear' }}
                className="absolute w-1 h-1 rounded-full"
                style={{ left: `${left}%`, background: '#F5C518', boxShadow: '0 0 10px #F5C518, 0 0 24px rgba(245,197,24,0.6)' }}
              />
            ))}
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

          {/* Center name with cinematic reveal */}
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.6em', filter: 'blur(20px)' }}
              animate={{ opacity: 1, letterSpacing: '-0.02em', filter: 'blur(0px)' }}
              transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="font-display text-6xl md:text-9xl italic will-change-[filter,letter-spacing]"
              style={{ textShadow: '0 0 40px rgba(245,197,24,0.15)' }}
            >
              Jared <span className="text-[#F5C518]">Durón</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-[11px] uppercase tracking-[0.5em] text-white/60"
            >
              <span className="text-[#F5C518]">✦</span> Filmmaker · Graphic Designer · Barcelona <span className="text-[#F5C518]">✦</span>
            </motion.div>
          </div>

          {/* Render timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-10 left-6 right-6 md:left-14 md:right-14 z-10"
          >
            <div className="flex items-center justify-between gap-4 text-[10px] md:text-xs uppercase tracking-[0.28em]">
              <div className="text-[#F5C518]/85">Rendering intro</div>
              <div className="font-mono-num text-white/70">{String(progress).padStart(3, '0')}%</div>
            </div>

            <div className="relative mt-3 h-9 md:h-10 overflow-hidden border border-white/15 bg-black/35 shadow-[0_0_30px_rgba(245,197,24,0.08)]">
              <div className="absolute inset-0 grid grid-cols-12">
                {Array.from({ length: 12 }).map((_, frame) => (
                  <div key={frame} className="border-r border-white/10 last:border-r-0" />
                ))}
              </div>
              <motion.div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, rgba(245,197,24,0.15) 0%, rgba(245,197,24,0.85) 72%, #ffffff 100%)',
                  boxShadow: '0 0 18px rgba(245,197,24,0.65)',
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div
                  className="absolute inset-0 opacity-35"
                  style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 14px, rgba(0,0,0,0.45) 14px 16px)' }}
                />
              </motion.div>
              <motion.div
                className="absolute top-0 bottom-0 w-[2px] bg-white"
                style={{ left: `${progress}%`, boxShadow: '0 0 16px #ffffff, 0 0 28px #F5C518' }}
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between gap-4 font-mono-num text-[10px] uppercase tracking-[0.22em] text-white/45">
              <span>Frame {String(Math.round(progress * 2.4)).padStart(3, '0')} / 240</span>
              <span>24 FPS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function IntroLoader() {
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const particles = useMemo(() => {
    const rand = (seed) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    return Array.from({ length: 32 }).map((_, index) => ({
      left: rand(index * 7.13) * 100,
      top: rand(index * 11.37) * 100,
      size: 1.2 + rand(index * 3.71) * 2.8,
      opacity: 0.22 + rand(index * 5.91) * 0.42,
      duration: 7 + rand(index * 2.43) * 7,
      delay: -rand(index * 9.17) * 8,
      driftX: (rand(index * 4.29) - 0.5) * 90,
      driftY: (rand(index * 8.61) - 0.5) * 70,
      accent: rand(index * 6.41) > 0.76,
    }))
  }, [])

  useEffect(() => {
    let value = 0
    const id = setInterval(() => {
      value = Math.min(value + 2, 100)
      setProgress(value)
      if (value === 100) {
        clearInterval(id)
        setTimeout(() => setDone(true), 350)
      }
    }, 24)

    return () => clearInterval(id)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] h-dvh overflow-hidden bg-[#050609]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {particles.map((particle, index) => (
              <span
                key={index}
                className="intro-particle absolute rounded-full"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  background: particle.accent ? '#F5C518' : '#FFFFFF',
                  '--drift-x': `${particle.driftX}px`,
                  '--drift-y': `${particle.driftY}px`,
                  '--particle-duration': `${particle.duration}s`,
                  animationDelay: `${particle.delay}s`,
                  boxShadow: particle.accent
                    ? '0 0 14px rgba(245,197,24,0.68)'
                    : '0 0 10px rgba(255,255,255,0.42)',
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,197,24,0.055),transparent_20%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.035),transparent_32%)]" aria-hidden="true" />

          <div className="absolute left-1/2 top-1/2 w-full max-w-[280px] -translate-x-1/2 -translate-y-1/2 px-6 text-center sm:max-w-[340px]">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="whitespace-nowrap font-display text-[2.65rem] font-bold leading-none text-white italic sm:text-5xl"
            >
              Jared <span className="text-[#F5C518]">Durón</span>
            </motion.div>

            <div className="mt-7 h-3 w-full overflow-hidden rounded-full border border-white/70 bg-transparent p-[2px] shadow-[0_0_26px_rgba(255,255,255,0.22)] sm:mt-8">
              <div
                className="h-full rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.75)] transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3 font-mono-num text-[10px] tracking-[0.28em] text-white/60">
              {String(progress).padStart(3, '0')}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Root ---------- */
function App() {
  const [locale, setLocale] = useState('es')
  const [deferredReady, setDeferredReady] = useState(false)
  const t = useMemo(() => T[locale], [locale])
  const changeLocale = (nextLocale) => {
    if (!T[nextLocale] || nextLocale === locale) return
    setLocale(nextLocale)
    trackEvent('language_change', { selected_language: nextLocale })
    window.dispatchEvent(new CustomEvent('portfolio:locale-change', { detail: nextLocale }))
  }

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('locale') : null
    if (saved && T[saved]) setLocale(saved)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('locale', locale)
  }, [locale])

  useEffect(() => {
    const revealDeferredContent = () => setDeferredReady(true)

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(revealDeferredContent, { timeout: 600 })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = window.setTimeout(revealDeferredContent, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (!deferredReady || !window.location.hash) return
    const targetId = decodeURIComponent(window.location.hash.slice(1))
    const target = document.getElementById(targetId)
    if (!target) return
    const frameId = window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }))
    return () => window.cancelAnimationFrame(frameId)
  }, [deferredReady])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t.seo.title
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', t.seo.description)

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    const ogLocale = document.querySelector('meta[property="og:locale"]')
    ogTitle?.setAttribute('content', t.seo.title)
    ogDescription?.setAttribute('content', t.seo.description)
    twitterTitle?.setAttribute('content', t.seo.title)
    twitterDescription?.setAttribute('content', t.seo.description)
    ogLocale?.setAttribute('content', locale === 'en' ? 'en_US' : locale === 'ca' ? 'ca_ES' : 'es_ES')
  }, [locale, t.seo])

  return (
    <>
      <IntroLoader />
      {deferredReady && <Toaster position="bottom-right" theme="dark" />}
      <div className="grain relative z-10">
        <Nav locale={locale} setLocale={changeLocale} t={t} />
        <main>
          <Hero t={t} />
          <Marquee text={t.marquee} />
          <About t={t} />
          <SocialFeed locale={locale} />
          {deferredReady && (
            <>
              <Work t={t} locale={locale} />
              <Services t={t} />
              <Process t={t} />
              <Clients t={t} />
              <Testimonials t={t} />
              <FAQ t={t} />
              <Blog t={t} locale={locale} />
              <Contact t={t} locale={locale} />
            </>
          )}
        </main>
        {deferredReady && (
          <>
            <Footer t={t} locale={locale} />
            <FloatingWhatsApp locale={locale} />
          </>
        )}
      </div>
    </>
  )
}

export default App
