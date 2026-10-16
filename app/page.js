'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Play, Mail, Instagram, Linkedin, MessageCircle, MapPin, Plus, Minus, X, ExternalLink, Sparkles, Star, Clock3, Clapperboard, BadgeCheck, Layers3, Volume2, VolumeX, Maximize2 } from 'lucide-react'
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
        { q: '¿Cuál es el plazo de entrega habitual?', a: 'El plazo de entrega depende de la complejidad y alcance del proyecto, ajustándose habitualmente desde 4 días hasta 10 semanas.' },
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
        { q: 'What is the usual delivery timeline?', a: 'Delivery timeline depends on the project scope and complexity, ranging from 4 days to 10 weeks.' },
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
        { q: 'Quin és el termini de lliurament habitual?', a: 'El termini de lliurament depèn del projecte i la seva complexitat, variant habitualment de 4 dies a 10 setmanes.' },
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
      setScrolled(window.scrollY > 40)
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
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 motion-reduce:transition-none border-b ${scrolled ? 'border-[#415A77]/35 bg-[#0D1B2A]/95 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl' : 'border-[#415A77]/20 bg-[#0D1B2A]/85 backdrop-blur-md'}`}>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10 md:py-4">
        <a href="#top" className="flex items-center gap-3 group" aria-label="Home · Jared Durón">
          <span className="w-2 h-2 bg-[#415A77] group-hover:bg-[#E0E1DD] transition-colors" />
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="font-display text-base md:text-lg font-bold tracking-tight text-[#E0E1DD]">JARED DURÓN</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#778DA9]">FILMMAKER · BCN</span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-[11px] font-mono uppercase tracking-[0.22em] lg:flex" aria-label="Primary navigation">
          {['work', 'about', 'services', 'process', 'blog', 'contact'].map((key) => (
            <a
              key={key}
              href={`#${key}`}
              aria-label={`${t.a11y.primaryLink}: ${t.nav[key]}`}
              className="text-[#778DA9] hover:text-[#E0E1DD] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#E0E1DD] hover:after:w-full after:transition-all after:duration-300"
            >
              {t.nav[key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1 border border-[#415A77]/40 bg-[#1B263B]/50 p-1 text-[10px] font-mono uppercase tracking-widest md:flex">
            {['es', 'en', 'ca'].map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2 py-0.5 transition-all ${locale === l ? 'bg-[#415A77] text-[#E0E1DD] font-semibold' : 'text-[#778DA9] hover:text-[#E0E1DD]'}`}
                aria-pressed={locale === l}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="#contact"
            aria-label={`${t.a11y.primaryLink}: ${t.hero.cta2}`}
            className="hidden items-center gap-2 border border-[#415A77] bg-[#1B263B]/60 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#E0E1DD] transition-all hover:border-[#778DA9] hover:bg-[#1B263B] motion-reduce:transition-none md:inline-flex"
          >
            <span>{t.hero.cta2}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#778DA9]" />
          </a>
          <button
            type="button"
            className="group flex h-9 w-9 items-center justify-center border border-[#415A77]/50 bg-[#1B263B]/60 text-[#E0E1DD] transition-colors hover:border-[#778DA9] lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={t.hero.menuAria}
            aria-expanded={open}
          >
            <span className="sr-only">{t.hero.menuAria}</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-px w-4 bg-[#E0E1DD] transition-transform ${open ? 'translate-y-[2.5px] rotate-45' : ''}`} />
              <span className={`block h-px w-4 bg-[#E0E1DD] transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mb-4 border border-[#415A77]/40 bg-[#1B263B] px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl md:mx-10 lg:ml-auto lg:max-w-sm"
          >
            {['work', 'about', 'services', 'process', 'blog', 'contact'].map((k) => (
              <a
                key={k}
                href={`#${k}`}
                aria-label={`${t.a11y.mobileLink}: ${t.nav[k]}`}
                onClick={() => setOpen(false)}
                className="block border-b border-[#415A77]/25 py-3 text-lg font-mono uppercase tracking-wider text-[#E0E1DD] transition-colors last:border-b-0 hover:text-white"
              >
                {t.nav[k]}
              </a>
            ))}
            <div className="flex gap-2 pt-4">
              {['es', 'en', 'ca'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`border border-[#415A77]/40 px-3 py-1 text-xs font-mono uppercase tracking-widest ${locale === l ? 'bg-[#415A77] text-[#E0E1DD]' : 'text-[#778DA9]'}`}
                  aria-pressed={locale === l}
                >
                  {l}
                </button>
              ))}
            </div>
            <a
              href="#contact"
              aria-label={`${t.a11y.mobileLink}: ${t.hero.cta2}`}
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex items-center gap-2 border border-[#415A77] bg-[#0D1B2A] px-4 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#E0E1DD]"
            >
              {t.hero.cta2}
              <ArrowUpRight className="h-3.5 w-3.5 text-[#778DA9]" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ---------- Concise Project-First Hero ---------- */
/* ---------- Minimalist Cinematic Video Hero ---------- */
function Hero({ t, locale }) {
  const [reelOpen, setReelOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoElementRef = useRef(null)

  const openReel = () => {
    trackEvent('reel_play', { location: 'hero' })
    setReelOpen(true)
  }

  const toggleSound = () => {
    setIsMuted((prev) => !prev)
  }

  const toggleFullscreen = () => {
    if (!videoElementRef.current) {
      openReel()
      return
    }
    if (!document.fullscreenElement) {
      videoElementRef.current.requestFullscreen?.().catch(() => openReel())
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }

  return (
    <section id="top" className="cinematic-hero relative w-full overflow-hidden border-b border-[#415A77]/25 bg-[#0D1B2A] h-[86vh] min-h-[580px] max-h-[940px] flex flex-col justify-between">
      {/* BACKGROUND VIDEO: Clearly visible, atmospheric and sharp */}
      <div className="absolute inset-0 pointer-events-auto opacity-80 md:opacity-85 transition-opacity duration-700">
        <HeroMedia isMuted={isMuted} onVideoRef={(el) => { videoElementRef.current = el }} />
        {/* Subtle cinematic gradient to keep background video vivid while guaranteeing contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/20 to-[#0D1B2A]/40 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/60 via-transparent to-[#0D1B2A]/35 pointer-events-none" aria-hidden="true" />
      </div>

      {/* TOP HUD TELEMETRY BAR */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-28 md:pt-32">
        <div className="flex items-center justify-between border-b border-[#415A77]/30 pb-3 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-[#778DA9]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
            <span className="text-[#E0E1DD] font-semibold">REC ● LIVE REEL</span>
            <span className="hidden sm:inline text-[#415A77]">|</span>
            <span className="hidden sm:inline">BCN 41.3879° N, 2.1699° E</span>
          </div>
          <div className="flex items-center gap-4 text-[#778DA9]">
            <span className="hidden md:inline">24 FPS · 4K MASTER</span>
            <button
              type="button"
              onClick={toggleSound}
              aria-label={isMuted ? 'Activar audio de fondo' : 'Silenciar audio de fondo'}
              className="inline-flex items-center gap-1.5 border border-[#415A77]/40 bg-[#1B263B]/80 px-2.5 py-1 text-[10px] text-[#E0E1DD] hover:bg-[#E0E1DD] hover:text-[#0D1B2A] transition-colors"
            >
              {isMuted ? <VolumeX className="w-3 h-3 text-[#778DA9]" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
              <span>{isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CENTER / LOWER EDITORIAL MINIMALIST TITLE (Ultra clean, no paragraphs) */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-10 my-auto pb-4 pt-10">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2.75rem,8.5vw,7.5rem)] font-bold leading-[0.9] tracking-tight text-[#E0E1DD] drop-shadow-[0_8px_32px_rgba(13,27,42,0.9)]"
          >
            JARED DURÓN
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="mt-3.5 text-xs md:text-xl font-mono uppercase tracking-[0.24em] text-[#E0E1DD]/90"
          >
            FILMMAKER & AUDIOVISUAL DIRECTOR · BARCELONA
          </motion.div>
        </div>
      </div>

      {/* BOTTOM ACTION & NAVIGATION BAR */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-10 pb-8 md:pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#415A77]/30 pt-5 text-xs font-mono uppercase tracking-[0.2em]">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {/* PROMINENT OPTION TO WATCH FULL VIDEO */}
            <button
              type="button"
              onClick={openReel}
              data-cursor="Play"
              aria-label={locale === 'en' ? 'Watch full reel video' : locale === 'ca' ? 'Veure reel complet' : 'Ver video reel completo'}
              className="group inline-flex items-center gap-3 bg-[#E0E1DD] text-[#0D1B2A] px-6 py-3.5 text-xs font-mono uppercase tracking-widest font-semibold hover:bg-[#415A77] hover:text-[#E0E1DD] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            >
              <Play className="h-3.5 w-3.5 fill-[#0D1B2A] text-[#0D1B2A] group-hover:fill-[#E0E1DD] group-hover:text-[#E0E1DD] transition-colors" />
              <span>{locale === 'en' ? 'WATCH FULL REEL' : locale === 'ca' ? 'VEURE REEL COMPLET' : 'VER VIDEO COMPLETO'}</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Pantalla completa"
              className="hidden sm:inline-flex items-center gap-2 border border-[#415A77]/50 bg-[#1B263B]/70 px-4 py-3.5 text-xs text-[#778DA9] hover:text-[#E0E1DD] hover:border-[#778DA9] transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{locale === 'en' ? 'FULLSCREEN' : 'PANTALLA COMPLETA'}</span>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#work"
              className="inline-flex items-center gap-2 text-[#778DA9] hover:text-[#E0E1DD] transition-colors py-2 px-1"
            >
              <span>[ 01 // SELECTED WORK ↓ ]</span>
            </a>
          </div>
        </div>
      </div>

      <ReelModal open={reelOpen} onClose={() => setReelOpen(false)} locale={locale} />
    </section>
  )
}

function ReelModal({ open, onClose, locale }) {
  const [activeReelIndex, setActiveReelIndex] = useState(0)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  const REEL_TRACKS = [
    {
      title: locale === 'en' ? 'Master Cinematic Reel' : 'Reel Cinematográfico Master',
      sourceType: 'mp4',
      src: 'https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/qkv7mv6p_Toma%20Dron%201.mp4',
      specs: 'BARCELONA 4K · 24 FPS',
    },
    {
      title: 'Lo que me gusta (Cortometraje)',
      sourceType: 'embed',
      src: 'https://www.youtube.com/embed/hmC-gPI-KZQ?autoplay=1',
      specs: 'FICCIÓN · BARCELONA',
    },
    {
      title: 'Ayudas invisibles (Behind The Scenes)',
      sourceType: 'embed',
      src: 'https://www.youtube.com/embed/iz_8WSOb6hM?autoplay=1',
      specs: 'DOCUMENTAL · BARCELONA',
    },
  ]

  const currentTrack = REEL_TRACKS[activeReelIndex]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[140] bg-[#0D1B2A]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Top modal header bar */}
          <div className="w-full max-w-6xl flex items-center justify-between pb-3 text-xs font-mono uppercase tracking-[0.2em] text-[#778DA9]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
              <span className="text-[#E0E1DD] font-medium">{currentTrack.title}</span>
              <span className="hidden sm:inline text-[#415A77]">/</span>
              <span className="hidden sm:inline">{currentTrack.specs}</span>
            </div>

            <button
              onClick={onClose} data-cursor="Close"
              className="w-10 h-10 border border-[#415A77]/40 bg-[#1B263B] flex items-center justify-center text-[#E0E1DD] hover:bg-[#E0E1DD] hover:text-[#0D1B2A] transition-all"
              aria-label="Cerrar video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Video Frame */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl aspect-video bg-black border border-[#415A77]/40 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
          >
            {currentTrack.sourceType === 'mp4' ? (
              <video
                key={currentTrack.src}
                className="w-full h-full object-cover"
                controls autoPlay playsInline preload="auto"
                poster="/hero/hero-poster-desktop.jpg"
              >
                <source src={currentTrack.src} type="video/mp4" />
                <source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" type="video/mp4" />
              </video>
            ) : (
              <iframe
                key={currentTrack.src}
                src={currentTrack.src}
                title={currentTrack.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </motion.div>

          {/* Bottom Video Selection Tabs */}
          <div className="w-full max-w-6xl mt-4 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {REEL_TRACKS.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveReelIndex(idx)}
                className={`px-3.5 py-2 text-[10px] md:text-[11px] font-mono uppercase tracking-widest border transition-colors ${idx === activeReelIndex ? 'bg-[#1B263B] border-[#E0E1DD] text-[#E0E1DD]' : 'border-[#415A77]/30 text-[#778DA9] hover:border-[#778DA9]'}`}
              >
                0{idx + 1} // {t.title}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Marquee ---------- */
function Marquee({ text }) {
  const items = Array(6).fill(text)
  return (
    <div className="border-y border-[#415A77]/25 overflow-hidden py-4 md:py-5 bg-[#0D1B2A]">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.concat(items).map((s, i) => (
          <span key={i} className="font-mono text-xs md:text-sm uppercase tracking-[0.25em] mx-6 text-[#778DA9]">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Highlight helper: wraps keywords in platinum/silver accent ---------- */
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
  const sorted = [...HIGHLIGHT_WORDS].sort((a, b) => b.length - a.length)
  const pattern = new RegExp(`(${sorted.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  const parts = text.split(pattern)
  return (
    <span className={className}>
      {parts.map((p, i) => (
        sorted.includes(p)
          ? <span key={i} className="text-[#E0E1DD] font-medium">{p}</span>
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
      <span className="hidden md:block bg-[#1B263B] border border-[#415A77] text-[#E0E1DD] text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </span>
      <div className="relative">
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-none border border-[#415A77] bg-[#1B263B] flex items-center justify-center shadow-2xl group-hover:border-[#778DA9] transition-colors duration-300">
          <svg viewBox="0 0 32 32" className="w-6 h-6 md:w-7 md:h-7 fill-[#E0E1DD]" xmlns="http://www.w3.org/2000/svg">
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
    const duration = activePortrait === 0 ? 6500 : 5500
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
    <section id="about" className="relative py-20 md:py-32 px-6 md:px-10 border-t border-[#415A77]/25 bg-[#0D1B2A]">
      <div className="max-w-[1600px] mx-auto">
        <SectionKicker>{t.about.kicker}</SectionKicker>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center mt-8">
          {/* Portrait — left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-none bg-[#1B263B] border border-[#415A77]/40">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={portrait}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={portrait}
                    alt={`Jared Durón — retrato ${activePortrait + 1}`}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    quality={95}
                    className="object-cover"
                    priority={activePortrait === 0}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end text-[10px] font-mono uppercase tracking-widest text-[#778DA9]">
                <span className="text-[#E0E1DD]">JARED DURÓN</span>
                <span>EST. 2017 · BCN</span>
              </div>
            </div>
          </motion.div>

          {/* Copy — right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay: 0.15 }}
            className="md:col-span-7"
          >
            <h2 className="font-display max-w-4xl text-3xl leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl text-[#E0E1DD]">
              {t.about.title}
            </h2>
            <div className="mt-8 space-y-5 text-[#778DA9] leading-relaxed text-sm md:text-base max-w-2xl">
              <p><Highlight text={t.about.body1} /></p>
              <p><Highlight text={t.about.body2} /></p>
            </div>
          </motion.div>
        </div>

        {/* Stats — 4 cols structured grid */}
        <div className="relative mt-16 scroll-mt-28 overflow-hidden border-t border-[#415A77]/25 pt-12 md:mt-20 md:pt-16">
          <div className="grid items-start justify-between gap-10 lg:grid-cols-[38%_56%] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <div className="mb-4 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.26em] text-[#778DA9]">
                <span className="h-px w-8 bg-[#415A77]" />
                <span>{t.about.experience.eyebrow}</span>
              </div>
              <h3 className="max-w-[590px] font-display leading-[1.05] tracking-tight text-[#E0E1DD]">
                <span className="block text-2xl md:text-3xl font-semibold text-[#E0E1DD]">{t.about.experience.titleIntro}</span>
                <span className="mt-2 block whitespace-pre-line text-3xl md:text-5xl font-bold text-[#778DA9]">{t.about.experience.titleHighlight}</span>
              </h3>
              <div className="mt-5 h-px w-16 bg-[#415A77]" />
              <div className="mt-6 max-w-xl space-y-3 text-sm leading-relaxed text-[#778DA9]">
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
          ? <strong key={`${part}-${index}`} className="font-semibold text-[#E0E1DD]">{part}</strong>
          : <span key={`${part}-${index}`}>{part}</span>
      ))}
    </>
  )
}

function StatCard({ stat, index }) {
  const Icon = [Clock3, Clapperboard, BadgeCheck, Layers3][index] || Star

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group min-h-[140px] rounded-none border border-[#415A77]/35 bg-[#1B263B]/60 p-5 transition-colors duration-300 hover:border-[#778DA9] hover:bg-[#1B263B] md:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-none border border-[#415A77]/60 bg-[#0D1B2A] text-[#778DA9] group-hover:text-[#E0E1DD] transition-colors">
          <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="h-px flex-1 bg-[#415A77]/25" aria-hidden="true" />
        <span className="font-mono text-[10px] text-[#415A77]">0{index + 1}</span>
      </div>
      <div className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#E0E1DD]">
        <AnimatedStatNumber value={stat.n} />
      </div>
      <div className="mt-3 text-[10px] font-mono uppercase leading-relaxed tracking-[0.2em] text-[#778DA9]">
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

  const photographyProjectIds = ['barcelona-city', 'cyberpunk-portraits', 'fotografia-producto', 'sauvage-dior', 'fotografias']
  const graphicDesignProjectIds = ['john-deere-expo', 'miniso', 'fotomontaje-epico', 'de-la-granja', 'ultra-burger', 'blass-coffee', 'mall-multiplaza']
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
    <section id="work" aria-label={t.nav.work} className="relative py-16 md:py-28 px-6 md:px-10 border-t border-[#415A77]/25 bg-[#0D1B2A]">
      <div className="max-w-[1600px] mx-auto">
        <nav aria-label={t.nav.work} className="mb-14 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-[#415A77]/30 py-3.5 md:mb-20">
          {categoryLinks.map((link, index) => (
            <span key={link.id} className="inline-flex items-center gap-3">
              {index > 0 && <span aria-hidden="true" className="text-[#415A77]">/</span>}
              <a
                href={`#${link.id}`}
                onClick={(event) => scrollToCategory(event, link.id)}
                aria-current={activeCategory === link.id ? 'location' : undefined}
                className={`text-[11px] font-mono uppercase tracking-[0.22em] transition-colors motion-reduce:transition-none ${activeCategory === link.id ? 'text-[#E0E1DD] font-semibold border-b border-[#E0E1DD]' : 'text-[#778DA9] hover:text-[#E0E1DD]'}`}
              >
                {link.label}
              </a>
            </span>
          ))}
        </nav>

        <PortfolioCategory id="filmmaking" headingId="filmmaking-title" copy={t.work.filmmaking}>
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {filmmakingProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} featured={i === 0 || (i === 3 && Boolean(p.featured))} locale={locale} onOpen={() => setActive(p)} />
            ))}
          </div>
        </PortfolioCategory>

        <PortfolioCategory id="fotografia" headingId="fotografia-title" copy={t.work.photography} separated>
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {photographyProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} featured={i === 0} locale={locale} external={Boolean(p.categoryGroup)} onOpen={() => setActive(p)} />
            ))}
          </div>
        </PortfolioCategory>

        <PortfolioCategory id="diseno-grafico" headingId="diseno-grafico-title" copy={t.work.graphicDesign} separated>
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {graphicDesignProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} featured={i === 0} locale={locale} external={Boolean(p.categoryGroup)} onOpen={() => setActive(p)} />
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
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-28 ${separated ? 'mt-20 border-t border-[#415A77]/30 pt-20 md:mt-32 md:pt-28' : ''}`}>
      <header className="mb-10 md:mb-16">
        <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#778DA9]">{copy.eyebrow}</div>
        <h2 id={headingId} className="mt-4 max-w-5xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-tight text-balance">
          <span className="block text-[#E0E1DD]">{copy.title}</span>
          {copy.highlight && <span className="block text-[#778DA9]">{copy.highlight}</span>}
        </h2>
        <p className="mt-4 max-w-[760px] text-sm md:text-base leading-[1.7] text-[#778DA9]">{copy.description}</p>
        <div aria-hidden="true" className="mt-6 h-px w-16 bg-[#415A77]" />
      </header>
      {children}
    </section>
  )
}

function ProjectCard({ project, index, locale, onOpen, external = false, featured = false }) {
  const trackProjectOpen = () => {
    trackEvent('project_open', {
      project_slug: project.slug || project.id,
      project_category: project.categoryGroup || project.category?.[locale] || 'portfolio',
    })
  }
  const sharedProps = {
    'data-cursor': external ? 'Open' : 'View',
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-20px' },
    transition: { duration: 0.6, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] },
    className: `group block text-left w-full min-w-0 ${featured ? 'md:col-span-2' : 'col-span-1'}`,
  }

  const content = (
    <>
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[16/10]'} bg-[#1B263B] border border-[#415A77]/35 group-hover:border-[#778DA9] transition-colors duration-300 rounded-none`}>
        <div className="absolute inset-0">
          <Image
            src={project.cover}
            alt={project.alt?.[locale] || `${project.title} — ${project.client} — Jared Durón filmmaker Barcelona`}
            fill
            loading="lazy"
            sizes={featured ? "(min-width: 1024px) 100vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"}
            quality={95}
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 ease-out motion-reduce:transition-none"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-transparent to-transparent opacity-65 group-hover:opacity-30 transition-opacity duration-300 motion-reduce:transition-none" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[#778DA9]">
          <span className="bg-[#0D1B2A]/90 border border-[#415A77]/50 px-2 py-0.5 text-[#E0E1DD] truncate max-w-[65%]">
            {project.category[locale] || project.categoryGroup}
          </span>
          <span className="bg-[#0D1B2A]/90 border border-[#415A77]/50 px-2 py-0.5 text-[#E0E1DD] font-mono-num">
            {project.year}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-none border border-[#415A77]/60 bg-[#0D1B2A]/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-[#E0E1DD]">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4 border-b border-[#415A77]/25 pb-2.5">
        <div className="min-w-0">
          <h3 className="font-display text-base md:text-lg font-semibold tracking-tight text-[#E0E1DD] group-hover:text-white transition-colors truncate">
            {project.title}
          </h3>
          <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-[#778DA9] truncate">
            {external ? 'Behance' : (project.client || project.role)} {project.location ? `· ${project.location}` : ''}
          </p>
        </div>
        <div className="shrink-0 text-right font-mono text-[10px] uppercase tracking-widest text-[#415A77] group-hover:text-[#778DA9] transition-colors">
          [ {external ? 'BEHANCE' : 'VIEW'} ]
        </div>
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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[120] overflow-y-auto bg-[#0D1B2A]"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            data-cursor="Close"
            className="fixed right-5 top-5 md:right-8 md:top-7 z-30 w-10 h-10 rounded-none bg-[#1B263B]/90 backdrop-blur-md border border-[#415A77]/40 text-[#E0E1DD] flex items-center justify-center hover:bg-[#E0E1DD] hover:text-[#0D1B2A] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="relative min-h-screen w-full"
          >

            {/* HERO full-bleed */}
            <div className="relative w-full h-[55vh] min-h-[340px] max-h-[600px] overflow-hidden">
              <motion.div
                initial={{ scale: 1.06, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  priority
                  sizes="100vw"
                  quality={95}
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/50 to-[#0D1B2A]/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/40 via-transparent to-transparent" />

              <div className="absolute top-6 left-6 md:top-8 md:left-10">
                <span className="inline-flex items-center gap-2 rounded-none border border-[#415A77]/40 bg-[#0D1B2A]/85 backdrop-blur-md px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9]">
                  <span className="w-1.5 h-1.5 bg-[#415A77] inline-block" />
                  {project.category[locale]} · {project.year}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-12 md:pb-12 lg:px-16 lg:pb-14">
                <motion.h2
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                  className="font-display text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] tracking-tight text-[#E0E1DD] max-w-5xl text-balance"
                >
                  {project.title}
                </motion.h2>
                {project.subtitle && (
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
                    className="mt-2.5 font-display italic text-base md:text-xl text-[#778DA9] max-w-3xl"
                  >
                    {project.subtitle}
                  </motion.p>
                )}
              </div>
            </div>

            {/* BODY: 2-column layout */}
            <div className="mx-auto w-full max-w-[1360px] px-6 md:px-12 lg:px-16 pb-28">
              <div className="pt-10 md:pt-14 lg:grid lg:grid-cols-[260px_1fr] xl:grid-cols-[300px_1fr] lg:gap-14 xl:gap-20 lg:items-start">

                {/* Sidebar sticky */}
                <aside className="mb-10 lg:mb-0">
                  <div className="lg:sticky lg:top-10">
                    <div className="rounded-none border border-[#415A77]/30 bg-[#1B263B]/60 p-6 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.3)]">

                      <div className="space-y-5">
                        {[
                          { k: locale === 'en' ? 'Client' : locale === 'ca' ? 'Client' : 'Cliente', v: project.client },
                          { k: locale === 'en' ? 'Role' : locale === 'ca' ? 'Rol' : 'Rol', v: project.role },
                          { k: locale === 'en' ? 'Location' : locale === 'ca' ? 'Ubicació' : 'Ubicación', v: project.location },
                          { k: locale === 'en' ? 'Year' : 'Año', v: project.year },
                        ].filter(({ v }) => v).map(({ k, v }) => (
                          <div key={k}>
                            <div className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#778DA9] mb-1">{k}</div>
                            <div className="text-sm text-[#E0E1DD] font-medium leading-snug">{v}</div>
                          </div>
                        ))}
                      </div>

                      {project.tags?.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-[#415A77]/25">
                          <div className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#778DA9] mb-3">
                            {locale === 'en' ? 'Skills' : 'Disciplinas'}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map(tag => (
                              <span key={tag} className="rounded-none border border-[#415A77]/30 bg-[#0D1B2A] px-2.5 py-1 text-[10px] font-mono text-[#778DA9]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.behanceUrl && (
                        <div className="mt-6 pt-5 border-t border-[#415A77]/25">
                          <a
                            href={project.behanceUrl}
                            target="_blank" rel="noopener noreferrer"
                            aria-label={`${behanceLabel}: ${project.title}`}
                            className="group flex items-center justify-center gap-2 w-full rounded-none bg-[#E0E1DD] px-4 py-3 text-[11px] font-mono uppercase tracking-widest text-[#0D1B2A] hover:bg-[#415A77] hover:text-[#E0E1DD] transition-colors duration-300 font-medium"
                          >
                            Behance <ExternalLink className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </aside>

                {/* Main content */}
                <main className="min-w-0">

                  <p className="text-base md:text-lg leading-relaxed text-[#E0E1DD]/80 max-w-2xl">
                    {project.description[locale]}
                  </p>

                  {hasVideos && (
                    <section className="mt-12 md:mt-16">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="h-px w-5 bg-[#415A77]" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9]">{mediaLabel}</span>
                        </div>
                        {!loadMedia && (
                          <button
                            type="button"
                            onClick={() => setLoadMedia(true)}
                            className="inline-flex items-center gap-2 rounded-none border border-[#415A77]/40 bg-[#1B263B]/60 px-4 py-2 text-[11px] font-mono uppercase tracking-widest text-[#E0E1DD] hover:bg-[#E0E1DD] hover:text-[#0D1B2A] transition-all duration-300"
                          >
                            {loadLabel} <Play className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {loadMedia ? (
                        <div className="grid gap-4">
                          {project.videoEmbeds.map((src, idx) => (
                            <div key={src} className="relative aspect-video overflow-hidden rounded-none border border-[#415A77]/30 bg-[#0D1B2A] shadow-[0_16px_64px_rgba(0,0,0,0.55)]">
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
                          className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-none border border-[#415A77]/30 bg-[#0D1B2A] shadow-[0_16px_64px_rgba(0,0,0,0.45)]"
                        >
                          <Image
                            src={project.cover}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 1000px, 100vw"
                            quality={95}
                            className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 to-transparent" />
                          <span className="relative flex h-14 w-14 items-center justify-center rounded-none bg-[#E0E1DD] text-[#0D1B2A] shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110">
                            <Play className="h-5 w-5 translate-x-0.5" />
                          </span>
                        </button>
                      )}
                    </section>
                  )}

                  <section className="mt-12 md:mt-16">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-px w-5 bg-[#415A77]" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9]">{galleryLabel}</span>
                    </div>

                    {isPhotoProject ? (
                      <PhotoMosaic project={project} onOpen={setLightboxIndex} />
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        {project.gallery.map((img, idx) => (
                          <div
                            key={idx}
                            className="overflow-hidden rounded-none border border-[#415A77]/25 bg-[#0D1B2A] shadow-[0_10px_40px_rgba(0,0,0,0.38)]"
                          >
                            <Image
                              src={img}
                              alt={`Material visual de ${project.title} ${idx + 1}`}
                              width={1400}
                              height={900}
                              loading="lazy"
                              sizes="(min-width: 1280px) 900px, 100vw"
                              quality={95}
                              className="h-auto w-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {behanceEmbedUrl && (
                    <section className="mt-12 md:mt-16">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="h-px w-5 bg-[#415A77]" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9]">Behance</span>
                        </div>
                        <a
                          href={project.behanceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${behanceLabel}: ${project.title}`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#778DA9] hover:text-[#E0E1DD] transition-colors"
                        >
                          {locale === 'en' ? 'Open' : 'Abrir'} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="overflow-hidden rounded-none border border-[#415A77]/30 bg-[#0D1B2A] shadow-[0_10px_40px_rgba(0,0,0,0.38)]">
                        {loadMedia ? (
                          <div className="relative h-[480px] md:h-[620px]">
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
                            className="flex min-h-[180px] w-full flex-col items-center justify-center gap-3 text-[#778DA9] hover:text-[#E0E1DD] transition-colors"
                          >
                            <span className="w-12 h-12 rounded-none bg-[#1B263B] border border-[#415A77]/40 flex items-center justify-center text-[#E0E1DD]">
                              <Play className="w-4 h-4" />
                            </span>
                            <span className="text-xs font-mono uppercase tracking-widest">{locale === 'en' ? 'Load Behance preview' : 'Cargar preview de Behance'}</span>
                          </button>
                        )}
                      </div>
                    </section>
                  )}

                  <div className="mt-16 md:mt-20 pt-10 border-t border-[#415A77]/25">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#778DA9] mb-3">Next chapter</div>
                    <a
                      href="#contact"
                      onClick={onClose}
                      className="font-display text-3xl md:text-5xl italic text-[#E0E1DD]/80 hover:text-[#E0E1DD] hover:underline transition-colors duration-300"
                    >
                      Let&apos;s work together →
                    </a>
                  </div>
                </main>
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
            className={`group relative overflow-hidden rounded-none border border-[#415A77]/30 bg-[#0D1B2A] shadow-[0_18px_60px_rgba(0,0,0,0.38)] ${tileClass}`}
            aria-label={`Abrir foto ${idx + 1} de ${project.title}`}
          >
            <Image
              src={img}
              alt={`Fotografia de ${project.title} ${idx + 1}`}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={95}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-[#0D1B2A]/20" />
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
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[140] flex flex-col items-center justify-center overflow-hidden bg-[#0D1B2A]/95 backdrop-blur-2xl"
          onClick={(e) => { e.stopPropagation(); onClose() }}
        >
          {/* Blurred background color sampling */}
          <div className="absolute inset-0 opacity-20 blur-3xl scale-110 pointer-events-none">
            <Image src={image} alt="" fill sizes="100vw" quality={75} className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/80 via-[#0D1B2A]/40 to-[#0D1B2A]/90 pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-none bg-[#1B263B]/90 border border-[#415A77]/40 text-[#E0E1DD] backdrop-blur-md transition-all hover:bg-[#E0E1DD] hover:text-[#0D1B2A] md:right-8 md:top-6"
            aria-label="Cerrar imagen"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Counter */}
          {total > 1 && (
            <div className="absolute top-5 left-1/2 z-20 -translate-x-1/2 rounded-none border border-[#415A77]/40 bg-[#0D1B2A]/90 px-4 py-1.5 font-mono text-[11px] tracking-[0.24em] text-[#778DA9] backdrop-blur-md">
              {String((currentIndex ?? 0) + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          )}

          {/* Prev arrow */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-none border border-[#415A77]/40 bg-[#1B263B]/90 text-[#E0E1DD] backdrop-blur-md transition-all hover:bg-[#E0E1DD] hover:text-[#0D1B2A] md:left-6 md:h-14 md:w-14"
              aria-label="Foto anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}

          {/* Next arrow */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNext() }}
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-none border border-[#415A77]/40 bg-[#1B263B]/90 text-[#E0E1DD] backdrop-blur-md transition-all hover:bg-[#E0E1DD] hover:text-[#0D1B2A] md:right-6 md:h-14 md:w-14"
              aria-label="Foto siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7"/></svg>
            </button>
          )}

          {/* Main image with keyed AnimatePresence for smooth transition */}
          <div className="relative z-10 flex-1 flex items-center justify-center w-full px-16 md:px-20 py-16" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative w-full h-full max-h-[75dvh] max-w-6xl"
              >
                <Image
                  src={image}
                  alt={`Foto ampliada de ${projectTitle}`}
                  fill
                  sizes="(min-width: 1280px) 80vw, 95vw"
                  quality={100}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail strip */}
          {total > 1 && (
            <div className="relative z-20 flex gap-1.5 px-4 pb-5 overflow-x-auto max-w-full" onClick={(e) => e.stopPropagation()}>
              {(images ?? []).map((thumb, idx) => (
                <button
                  key={thumb}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    const diff = idx - (currentIndex ?? 0)
                    if (diff < 0) { for (let i = 0; i < -diff; i++) onPrev() }
                    else if (diff > 0) { for (let i = 0; i < diff; i++) onNext() }
                  }}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-none border transition-all duration-200 ${idx === currentIndex ? 'border-[#E0E1DD] opacity-100 scale-105' : 'border-[#415A77]/40 opacity-45 hover:opacity-75'}`}
                  aria-label={`Ir a foto ${idx + 1}`}
                >
                  <Image src={thumb} alt="" fill sizes="64px" quality={75} className="object-cover" />
                </button>
              ))}
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
    <section id="blog" className="relative py-24 md:py-36 px-6 md:px-10 border-t border-[#415A77]/20">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <SectionKicker>08 — {locale === 'en' ? 'Journal' : 'Blog'}</SectionKicker>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-3xl text-balance flex items-baseline gap-4 text-[#E0E1DD]">
              {locale === 'es' ? 'Ideas sobre cine, marca y producción.' : locale === 'ca' ? 'Idees sobre cinema, marca i producció.' : 'Ideas on cinema, brand and production.'}
              <motion.span animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex text-[#778DA9]">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </motion.span>
            </h2>
          </div>
        </div>
        <div className="border-t border-[#415A77]/25">
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
      className="group grid grid-cols-12 items-baseline gap-4 md:gap-6 py-7 md:py-9 border-b border-[#415A77]/20 relative overflow-hidden text-left w-full transition-colors hover:bg-[#1B263B]/30"
    >
      <span
        className="absolute left-0 bottom-0 h-[1px] bg-[#778DA9] transition-transform duration-700 ease-out origin-left"
        style={{ width: '100%', transform: hover ? 'scaleX(1)' : 'scaleX(0)' }}
      />

      <div className="col-span-2 md:col-span-1 text-[11px] uppercase tracking-widest text-[#778DA9]/60 font-mono">
        0{index + 1}
      </div>

      <div className="col-span-10 md:col-span-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#778DA9]">
          <span className="w-1.5 h-1.5 bg-[#415A77]" />
          {post.category[locale]}
        </span>
      </div>

      <div className="col-span-12 md:col-span-6">
        <h3 className={`font-display text-2xl md:text-3xl lg:text-4xl leading-[1.1] tracking-tight text-balance text-[#E0E1DD] transition-all duration-500 ${hover ? 'italic translate-x-1 text-white' : ''}`}>
          {post.title[locale]}
        </h3>
      </div>

      <div className="hidden md:block md:col-span-2 text-[11px] uppercase tracking-widest text-[#778DA9]/70 font-mono text-right">
        {new Date(post.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ca' ? 'ca-ES' : 'es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
        <div className="mt-1 text-[#778DA9]/40">{post.read}</div>
      </div>

      <div className="col-span-12 md:col-span-1 flex md:justify-end">
        <motion.span
          animate={hover ? { rotate: 45, backgroundColor: '#E0E1DD', color: '#0D1B2A' } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="w-9 h-9 rounded-none border border-[#415A77]/40 flex items-center justify-center text-[#778DA9]"
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
          className="fixed inset-0 z-[85] bg-[#0D1B2A]/80 px-4 py-5 md:px-10 md:py-10 overflow-y-auto"
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-modal-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.88, y: 36, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.94, y: 24, filter: 'blur(10px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-none border border-[#415A77]/35 bg-[#0D1B2A]/98 shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
          >
            <button
              onClick={onClose}
              data-cursor="Close"
              className="absolute right-4 top-4 z-20 w-10 h-10 rounded-none bg-[#1B263B] backdrop-blur-md border border-[#415A77]/40 flex items-center justify-center text-[#E0E1DD] hover:bg-[#E0E1DD] hover:text-[#0D1B2A] transition-all"
              aria-label="Close blog article"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid lg:grid-cols-12 min-h-[70vh]">
              <div className="relative lg:col-span-5 min-h-[260px] lg:min-h-full bg-[#1B263B]">
                <Image
                  src={post.cover}
                  alt={post.title[locale]}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={95}
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/35 to-transparent" />
                <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9]">
                  <span className="text-[#E0E1DD]">{post.category[locale]}</span>
                  <span className="font-mono">{post.read}</span>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 md:p-10 lg:p-12">
                <div className="text-[11px] uppercase tracking-[0.32em] text-[#778DA9] font-mono">
                  {new Date(post.date).toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 id="blog-modal-title" className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight mt-5 text-balance text-[#E0E1DD]">
                  {post.title[locale]}
                </h3>
                <p className="mt-6 text-[#778DA9] leading-relaxed max-w-2xl">
                  {post.excerpt[locale]}
                </p>

                <div className="my-8 h-[1px] bg-gradient-to-r from-[#415A77] via-[#415A77]/30 to-transparent" />

                <div className="space-y-5 text-[#E0E1DD]/80 leading-relaxed text-[15px] md:text-[17px]">
                  {content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-[#415A77]/25 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#778DA9]">
                    Jared Durón · Barcelona
                  </div>
                  <a
                    href="#contact"
                    onClick={onClose}
                    data-cursor="Contact"
                    className="inline-flex items-center justify-center gap-3 bg-[#E0E1DD] text-[#0D1B2A] px-5 py-3 rounded-none text-[11px] font-mono uppercase tracking-widest hover:bg-[#415A77] hover:text-[#E0E1DD] transition-colors"
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
    <section id="testimonials" className="relative py-24 md:py-36 px-6 md:px-10 border-t border-[#415A77]/20">
      <div className="max-w-[1600px] mx-auto flex flex-col items-center text-center">
        <div className="flex justify-center">
          <SectionKicker>{t.testimonials.kicker}</SectionKicker>
        </div>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mt-6 max-w-4xl text-balance flex items-baseline justify-center gap-4 text-[#E0E1DD]">
          {t.testimonials.title}
          <motion.span animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex text-[#778DA9]">
            <Star className="w-7 h-7 md:w-9 md:h-9 fill-[#778DA9]" strokeWidth={0} />
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
                    className="text-[#778DA9]"
                  >
                    <Star className="w-4 h-4 fill-[#778DA9]" strokeWidth={0} />
                  </motion.span>
                ))}
              </div>
              <p className="font-display text-2xl md:text-4xl lg:text-5xl leading-[1.2] italic text-balance text-[#E0E1DD]">
                &ldquo;{item.q}&rdquo;
              </p>
              <footer className="mt-8 md:mt-12 flex items-center justify-center gap-4 md:gap-5 text-sm">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-none bg-[#1B263B] border border-[#415A77]/40 flex items-center justify-center text-[#E0E1DD] font-mono text-base md:text-lg">
                  {initials}
                </div>
                <div className="text-left">
                  <div className="font-medium text-base text-[#E0E1DD]">{item.a}</div>
                  <div className="text-[#778DA9] text-xs md:text-sm font-mono">{item.r}</div>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-12 flex min-h-[92px] justify-center gap-3 flex-wrap">
            {t.testimonials.items.map((item2, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`text-center transition-all duration-300 px-4 py-3 rounded-none border ${idx === i ? 'bg-[#1B263B] border-[#778DA9]' : 'border-[#415A77]/30 hover:border-[#778DA9]/60'}`}
              >
                <div className={`text-xs font-mono font-medium ${idx === i ? 'text-[#E0E1DD]' : 'text-[#778DA9]'}`}>{item2.a}</div>
                <div className="text-[10px] font-mono text-[#778DA9]/60 mt-0.5">{item2.r}</div>
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
    <section id="faq" className="relative py-24 md:py-36 px-6 md:px-10 border-t border-[#415A77]/20">
      <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-8 md:gap-16">
        <div className="md:col-span-4">
          <SectionKicker>{t.faq.kicker}</SectionKicker>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight mt-6 text-balance text-[#E0E1DD]">
            {t.faq.title}
          </h2>
        </div>
        <div className="md:col-span-8">
          {t.faq.items.map((f, i) => (
            <div key={i} className="border-b border-[#415A77]/25">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 py-6 md:py-8 text-left group"
                aria-expanded={open === i}
              >
                <span className="font-display text-xl md:text-2xl tracking-tight pr-4 text-[#E0E1DD] group-hover:text-white transition-colors">
                  {f.q}
                </span>
                <span className="shrink-0 w-8 h-8 rounded-none border border-[#415A77]/40 text-[#E0E1DD] flex items-center justify-center group-hover:border-[#778DA9] transition-colors">
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
                    <p className="pb-6 md:pb-8 text-[#778DA9] leading-relaxed max-w-2xl">{f.a}</p>
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
    <section id="contact" className="deferred-section relative py-24 md:py-36 px-6 md:px-10 border-t border-[#415A77]/20">
      <div className="max-w-[1600px] mx-auto grid md:grid-cols-12 gap-8 md:gap-16">
        <div className="md:col-span-5">
          <SectionKicker>{t.contact.kicker}</SectionKicker>
          <h2 className="font-display text-5xl md:text-7xl leading-[1] tracking-tight mt-6 text-balance text-[#E0E1DD]">
            {t.contact.title}
          </h2>
          <p className="mt-6 text-[#778DA9] leading-relaxed max-w-md">{t.contact.sub}</p>

          <div className="mt-12 space-y-4 text-sm font-mono">
            <a href="https://wa.me/34637434235?text=Hola%20Jared%2C%20me%20interesa%20trabajar%20contigo" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { location: 'contact_section' })} data-cursor="Chat" className="flex items-center gap-4 text-[#778DA9] hover:text-[#E0E1DD] transition-colors group">
              <MessageCircle className="w-4 h-4 text-[#415A77] group-hover:text-[#E0E1DD]" /> WhatsApp · +34 637 43 42 35
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="mailto:jaredmisaelduron@gmail.com" className="flex items-center gap-4 text-[#778DA9] hover:text-[#E0E1DD] transition-colors group">
              <Mail className="w-4 h-4 text-[#415A77] group-hover:text-[#E0E1DD]" /> jaredmisaelduron@gmail.com
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            {SOCIAL_LINKS.map((social) => {
              const SocialIcon = social.id === 'instagram' ? Instagram : social.id === 'linkedin' ? Linkedin : social.id === 'youtube' ? Play : ExternalLink
              return (
                <a key={social.id} href={social.url} target="_blank" rel="me noopener noreferrer" aria-label={`${social.ariaLabel[locale]}. ${social.name} · ${social.user}`} onClick={() => trackEvent('social_click', { network: social.id, location: 'contact_section' })} className="flex items-center gap-4 text-[#778DA9] hover:text-[#E0E1DD] transition-colors group">
                  <SocialIcon aria-hidden="true" className="w-4 h-4 text-[#415A77] group-hover:text-[#E0E1DD]" /> {social.name} · {social.user}
                  <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )
            })}
            <div className="flex items-center gap-4 text-[#778DA9]/60 pt-4">
              <MapPin className="w-4 h-4 text-[#415A77]" /> Barcelona, Catalunya · Available worldwide
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="md:col-span-7 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label={t.contact.name} htmlFor="contact-name" required>
              <input id="contact-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#1B263B]/30 border border-[#415A77]/30 focus:border-[#778DA9] focus:bg-[#1B263B]/60 outline-none px-4 py-3 text-sm text-[#E0E1DD] transition-colors rounded-none placeholder:text-[#778DA9]/40" />
            </FormField>
            <FormField label={t.contact.email} htmlFor="contact-email" required>
              <input id="contact-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#1B263B]/30 border border-[#415A77]/30 focus:border-[#778DA9] focus:bg-[#1B263B]/60 outline-none px-4 py-3 text-sm text-[#E0E1DD] transition-colors rounded-none placeholder:text-[#778DA9]/40" />
            </FormField>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label={t.contact.company} htmlFor="contact-company">
              <input id="contact-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-[#1B263B]/30 border border-[#415A77]/30 focus:border-[#778DA9] focus:bg-[#1B263B]/60 outline-none px-4 py-3 text-sm text-[#E0E1DD] transition-colors rounded-none placeholder:text-[#778DA9]/40" />
            </FormField>
            <FormField label={t.contact.phone} htmlFor="contact-phone">
              <input id="contact-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+34 600 000 000" className="w-full bg-[#1B263B]/30 border border-[#415A77]/30 focus:border-[#778DA9] focus:bg-[#1B263B]/60 outline-none px-4 py-3 text-sm text-[#E0E1DD] transition-colors rounded-none placeholder:text-[#778DA9]/40" />
            </FormField>
          </div>
          <FormField label={t.contact.budget}>
            <div className="flex flex-wrap gap-2 pt-2">
              {t.contact.budgets.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setForm({ ...form, budget: b })}
                  className={`px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider border transition-all ${form.budget === b ? 'bg-[#E0E1DD] text-[#0D1B2A] border-[#E0E1DD]' : 'border-[#415A77]/40 text-[#778DA9] hover:border-[#778DA9] hover:text-[#E0E1DD] bg-[#1B263B]/30'}`}
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
                  className={`px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider border transition-all ${form.projectType === typ ? 'bg-[#E0E1DD] text-[#0D1B2A] border-[#E0E1DD]' : 'border-[#415A77]/40 text-[#778DA9] hover:border-[#778DA9] hover:text-[#E0E1DD] bg-[#1B263B]/30'}`}
                >
                  {typ}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label={t.contact.message} htmlFor="contact-message" required>
            <textarea id="contact-message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-[#1B263B]/30 border border-[#415A77]/30 focus:border-[#778DA9] focus:bg-[#1B263B]/60 outline-none px-4 py-3 text-sm text-[#E0E1DD] transition-colors resize-none rounded-none placeholder:text-[#778DA9]/40" />
          </FormField>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              data-cursor="Send"
              className="group inline-flex items-center gap-3 bg-[#E0E1DD] text-[#0D1B2A] px-8 py-4 rounded-none text-xs font-mono uppercase tracking-wider hover:bg-[#415A77] hover:text-[#E0E1DD] transition-all disabled:opacity-50"
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
        <label htmlFor={htmlFor} className="block text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9] mb-1.5">
          {label}{required && <span className="text-[#415A77]"> *</span>}
        </label>
      ) : (
        <div className="block text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9] mb-1.5">
          {label}{required && <span className="text-[#415A77]"> *</span>}
        </div>
      )}
      {children}
    </div>
  )
}

/* ---------- Footer ---------- */
function Footer({ t, locale }) {
  return (
    <footer className="relative border-t border-[#415A77]/25 px-6 md:px-10 py-16 bg-[#0D1B2A]">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <p className="font-display text-4xl md:text-6xl leading-tight text-balance text-[#E0E1DD]">
              Jared Durón<span className="text-[#415A77]">.</span>
            </p>
            <p className="mt-4 text-[#778DA9] max-w-md">{t.footer.tagline}</p>
          </div>
          <div className="md:col-span-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9] mb-4">Menu</div>
            <ul className="space-y-2 text-sm font-mono">
              {['work', 'about', 'services', 'process', 'blog', 'contact'].map((k) => (
                <li key={k}><a href={`#${k}`} aria-label={`${t.a11y.footerLink}: ${t.nav[k]}`} className="text-[#778DA9]/80 hover:text-[#E0E1DD] transition-colors">{t.nav[k]}</a></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9] mb-4">Social</div>
            <ul className="space-y-2 text-sm font-mono">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.id}>
                  <a href={social.url} target="_blank" rel="me noopener noreferrer" aria-label={social.ariaLabel[locale]} onClick={() => trackEvent('social_click', { network: social.id, location: 'footer' })} className="text-[#778DA9]/80 hover:text-[#E0E1DD] transition-colors">{social.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#778DA9] mb-4">Contact</div>
            <ul className="space-y-2 text-sm font-mono">
              <li><a href="mailto:jaredmisaelduron@gmail.com" className="text-[#778DA9]/80 hover:text-[#E0E1DD] transition-colors break-all">jaredmisaelduron@gmail.com</a></li>
              <li><a href="https://wa.me/34637434235" onClick={() => trackEvent('whatsapp_click', { location: 'footer' })} className="text-[#778DA9]/80 hover:text-[#E0E1DD] transition-colors">+34 637 43 42 35</a></li>
              <li className="text-[#778DA9]/60">Barcelona, ES</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-[#415A77]/20 flex flex-col md:flex-row justify-between gap-4 text-xs font-mono uppercase tracking-widest text-[#778DA9]/70">
          <div>© {new Date().getFullYear()} Jared Durón. {t.footer.rights}</div>
          <div className="flex gap-6">
            <span>Made in Barcelona</span>
            <button type="button" onClick={openConsentPreferences} className="text-left hover:text-[#E0E1DD] transition-colors">{t.footer.privacy}</button>
          </div>
        </div>

        {/* Natural SEO copy for organic discovery */}
        <div className="mt-14 pt-10 border-t border-[#415A77]/20">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#778DA9] mb-5 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#415A77]" />
            <span>{t.footer.seoKicker}</span>
          </div>
          <p className="max-w-4xl text-sm md:text-base text-[#778DA9]/80 leading-relaxed">
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
      className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.28em] text-[#778DA9]"
    >
      <div className="w-6 h-[1px] bg-[#415A77]" />
      <span className="w-1.5 h-1.5 bg-[#415A77]" />
      <span>{children}</span>
    </motion.div>
  )
}

/* ---------- Modern Cinematic Render Loader ---------- */
function RenderLoader() {
  const [mounted, setMounted] = useState(false)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stageIndex, setStageIndex] = useState(0)

  const STAGES = [
    'INITIALIZING ENGINE & BUFFERS...',
    'CALCULATING 12-COLUMN EDITORIAL GRID...',
    'BUILDING WIREFRAME CANVASES...',
    'RENDERING RECTANGULAR ASSET BUFFERS...',
    'COMPOSITING 24 FPS TIMELINES...',
    'READY // REVEALING WORK',
  ]

  useEffect(() => {
    setMounted(true)

    // Check if user already saw render loader this session
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('portfolio_rendered')) {
        setDone(true)
        return
      }
    } catch (e) {
      // ignore
    }

    // Check reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDone(true)
      return
    }

    let current = 0
    let fontsReady = false

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true
      }).catch(() => {
        fontsReady = true
      })
    } else {
      fontsReady = true
    }

    const interval = setInterval(() => {
      const increment = fontsReady ? Math.floor(Math.random() * 8 + 4) : Math.floor(Math.random() * 4 + 2)
      current = Math.min(current + increment, 100)
      setProgress(current)

      const stage = Math.min(Math.floor((current / 100) * (STAGES.length - 1)), STAGES.length - 1)
      setStageIndex(stage)

      if (current >= 100) {
        clearInterval(interval)
        try {
          sessionStorage.setItem('portfolio_rendered', 'true')
        } catch (e) {}
        setTimeout(() => {
          setDone(true)
        }, 360)
      }
    }, 28)

    return () => clearInterval(interval)
  }, [])

  if (done) return null

  const currentFrame = Math.min(Math.round((progress / 100) * 120), 120)

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#0D1B2A] text-[#E0E1DD] p-6 md:p-12 select-none"
        >
          {/* Underlying 12-column architectural wireframe grid */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-6 md:grid-cols-12 opacity-30">
            {Array.from({ length: 12 }).map((_, col) => (
              <div key={col} className="border-r border-[#415A77]/30 last:border-r-0 h-full" />
            ))}
          </div>

          {/* Wireframe Rectangular Blocks appearing progressively (The Render Grid Effect) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 mx-auto max-w-[1600px] px-6 md:px-10 flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-25">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 25 ? 0.35 : 0 }}
                transition={{ duration: 0.4 }}
                className="h-44 md:h-64 border border-[#415A77] bg-[#1B263B]/20 relative"
              >
                <div className="absolute top-2 left-2 text-[9px] font-mono text-[#778DA9]">FRAME // 01 · WIREFRAME</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-px bg-[#415A77]/60" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 45 ? 0.35 : 0 }}
                transition={{ duration: 0.4 }}
                className="h-44 md:h-64 border border-[#415A77] bg-[#1B263B]/20 relative"
              >
                <div className="absolute top-2 left-2 text-[9px] font-mono text-[#778DA9]">FRAME // 02 · WIREFRAME</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-px bg-[#415A77]/60" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Subtle horizontal scanline */}
          <div className="pointer-events-none absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[#415A77]/10 to-transparent animate-scanline" />

          {/* Top metadata row */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#415A77]/30 pb-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#778DA9]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#415A77]" />
              <span className="text-[#E0E1DD] font-semibold">JARED DURON</span>
              <span className="hidden sm:inline text-[#415A77]">/</span>
              <span className="hidden sm:inline">AUDIOVISUAL PORTFOLIO</span>
            </div>
            <div className="text-right">
              <span>ENGINE // 24 FPS · 4K MASTER</span>
            </div>
          </div>

          {/* Center technical display */}
          <div className="relative z-10 mx-auto w-full max-w-xl text-center py-10">
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#778DA9] mb-3">
              RENDERING PORTFOLIO
            </div>

            {/* Large Percentage */}
            <div className="font-display text-7xl md:text-9xl font-semibold tracking-tight text-[#E0E1DD] font-mono-num">
              {String(progress).padStart(2, '0')}<span className="text-3xl md:text-5xl text-[#778DA9] font-normal">%</span>
            </div>

            {/* Subtle precision progress line */}
            <div className="relative mt-8 h-1.5 w-full overflow-hidden bg-[#1B263B] border border-[#415A77]/40">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#415A77] via-[#778DA9] to-[#E0E1DD]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* Frame counter and status indicator */}
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#778DA9]">
              <span>FRAME {String(currentFrame).padStart(3, '0')} / 120</span>
              <span className="text-[#E0E1DD] truncate max-w-[55%]">{STAGES[stageIndex]}</span>
              <span>24 FPS</span>
            </div>
          </div>

          {/* Bottom coordinates / status bar */}
          <div className="relative z-10 flex items-center justify-between border-t border-[#415A77]/30 pt-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#778DA9]">
            <span>LOCATION: BARCELONA [41.3874° N]</span>
            <span className="hidden sm:inline">COLOR SYSTEM: CINEMATIC MONOCHROME</span>
            <span>STATUS: {progress === 100 ? 'COMPLETE' : 'PROCESSING'}</span>
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
      <RenderLoader />
      {deferredReady && <Toaster position="bottom-right" theme="dark" />}
      <div className="grain relative z-10">
        <Nav locale={locale} setLocale={changeLocale} t={t} />
        <main>
          <Hero t={t} locale={locale} />
          <Marquee text={t.marquee} />
          <Work t={t} locale={locale} />
          <About t={t} />
          <Services t={t} />
          <Process t={t} />
          <SocialFeed locale={locale} />
          {deferredReady && (
            <>
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
