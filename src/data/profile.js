import {
  FaGithub,
  FaLinkedin,
  FaMailBulk,
} from 'react-icons/fa/index.js';

export const profileData = {
  name: 'Nicolas Oliveira',
  greeting: 'Olá, me chamo',
  headline: 'Gosto de transformar ideias em realidade.',
  subheadline: 'Software Engineer / Linux Lover',
  githubUsername: 'nicolas-oliveira',
  avatarUrl: 'https://github.com/nicolas-oliveira.png',

  about: {
    title: 'Sobre mim',
    paragraphs: [
      'Me chamo Nicolas e atuo como Software Developer em Passos, Minas Gerais.',
      'Crio projetos para a Web e gosto bastante de experimentar novas tecnologias, buscando sempre aprender habilidades novas e me manter atualizado.',
      'Graduado no curso de Sistemas de Informação na UEMG.',
      'Adquiri o gosto por tecnologia através do Linux, lidando e resolvendo problemas no meu computador pessoal por pura curiosidade.',
      'Portanto, sou muito conectado ao mundo Open Source!',
    ],
    uemgUrl: 'https://www.uemg.br/',
  },

  socialLinks: [
    {
      name: 'GITHUB_',
      href: 'https://github.com/nicolas-oliveira',
      Icon: FaGithub,
      delay: '2s',
      time: '6s',
    },
    {
      name: 'LINKEDIN_',
      href: 'https://www.linkedin.com/in/nicolasom/',
      Icon: FaLinkedin,
      delay: '18s',
      time: '5s',
    },
    {
      name: 'EMAIL_',
      href: 'mailto:nicolas.oliveira.ug@gmail.com',
      Icon: FaMailBulk,
      delay: '8s',
      time: '7s',
    },
  ],

  ignoredRepositories: ['portfolio', 'nicolas-oliveira'],
};
