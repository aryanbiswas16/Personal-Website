export const site = {
  name: 'Aryan Biswas',
  firstName: 'Aryan',
  role: 'Software developer & AI engineer',
  location: 'Toronto, Canada',
  timeZone: 'America/Toronto',
  email: 'aryanbiswas.dev@gmail.com',
  github: 'https://github.com/aryanbiswas16',
  linkedin: 'https://www.linkedin.com/in/aryan-biswas/',
  url: 'https://aryanbiswas.ca',
  // What I'm doing right now. Shown in the hero, About, and the footer.
  availability: 'AI/ML engineer at TCS Pace Port in Toronto, full time since August 2026.',
}

// The résumé lives in public/ so the link stays stable: https://aryanbiswas.ca/Aryan-Biswas-Resume.pdf
export const resumeUrl = `${import.meta.env.BASE_URL}Aryan-Biswas-Resume.pdf`

export const navLinks = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const sectionIds = ['top', ...navLinks.map((l) => l.id)]
