export const SOCIAL_LINKS = [
  {
    id: 'instagram',
    name: 'Instagram',
    user: '@jared_duron10',
    url: 'https://www.instagram.com/jared_duron10/',
    icon: 'instagram',
    ariaLabel: {
      es: 'Seguir a Jared Durón en Instagram',
      en: 'Follow Jared Durón on Instagram',
      ca: 'Seguir Jared Durón a Instagram',
    },
    description: {
      es: 'Rodajes, fotografía comercial y contenido detrás de cámaras.',
      en: 'Shoots, commercial photography and behind-the-scenes content.',
      ca: 'Rodatges, fotografia comercial i contingut entre bastidors.',
    },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    user: '@0801Studiohn',
    url: 'https://www.youtube.com/@0801Studiohn',
    icon: 'youtube',
    ariaLabel: {
      es: 'Ver el canal de 0801 Studiohn en YouTube',
      en: 'Watch 0801 Studiohn on YouTube',
      ca: 'Veure el canal de 0801 Studiohn a YouTube',
    },
    description: {
      es: 'Producciones audiovisuales, cortometrajes, proyectos creativos y contenido sobre filmmaking.',
      en: 'Audiovisual productions, short films, creative projects and filmmaking content.',
      ca: 'Produccions audiovisuals, curtmetratges, projectes creatius i contingut sobre filmmaking.',
    },
  },
  {
    id: 'behance',
    name: 'Behance',
    user: 'jaredduron',
    url: 'https://www.behance.net/jaredduron',
    icon: 'behance',
    ariaLabel: {
      es: 'Ver los proyectos de Jared Durón en Behance',
      en: 'View Jared Durón’s projects on Behance',
      ca: 'Veure els projectes de Jared Durón a Behance',
    },
    description: {
      es: 'Fotografía, diseño gráfico y proyectos de producción audiovisual.',
      en: 'Photography, graphic design and audiovisual production projects.',
      ca: 'Fotografia, disseny gràfic i projectes de producció audiovisual.',
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    user: 'Jared Durón',
    url: 'https://www.linkedin.com/in/jared-duron-87a041100/',
    icon: 'linkedin',
    ariaLabel: {
      es: 'Conectar con Jared Durón en LinkedIn',
      en: 'Connect with Jared Durón on LinkedIn',
      ca: 'Connectar amb Jared Durón a LinkedIn',
    },
    description: {
      es: 'Experiencia, colaboraciones y contacto profesional.',
      en: 'Experience, collaborations and professional contact.',
      ca: 'Experiència, col·laboracions i contacte professional.',
    },
  },
]

export const SOCIAL_PROFILE_URLS = SOCIAL_LINKS.map(({ url }) => url)
