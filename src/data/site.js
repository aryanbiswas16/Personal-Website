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
  // What I'm looking for right now. Shown in the hero, About, and the footer.
  availability: 'Open to full-time software and AI engineering roles, in Toronto or remote.',
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
