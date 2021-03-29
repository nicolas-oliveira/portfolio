import React from 'react';
import { Link } from 'react-router-dom';

import CyberButton from '../CyberButton/index';
import { GroupButtonsStyle } from './styles';

import {
  FaGithub,
  FaLinkedin,
  FaMailBulk,
  FaHatWizard,
  FaBoxOpen,
} from 'react-icons/fa';

export default function GroupButtons() {
  const buttonsProps = [
    {
      href: 'https://github.com/nicolas-oliveira',
      Icon: FaGithub,
      name: 'GITHUB_',
      delay: '2s',
      time: '6s',
    },
    {
      href: 'https://bruxo.hashnode.dev',
      Icon: FaHatWizard,
      name: 'BRUXOJS_',
      delay: '12s',
      time: '7s',
    },
    {
      href: 'https://www.linkedin.com/in/nicolasom/',
      Icon: FaLinkedin,
      name: 'LINKEDIN_',
      delay: '18s',
      time: '5s',
    },
    {
      href: 'mailto:nicolas.oliveira.ug@gmail.com',
      Icon: FaMailBulk,
      name: 'EMAIL_',
      delay: '8s',
      time: '7s',
    },
  ];

  return (
    <GroupButtonsStyle>
      <Link to="/portfolio">
        <CyberButton Icon={FaBoxOpen} name="PORTFOLIO_" delay="3s" time="6s" />
      </Link>

      {buttonsProps.map(({ href, Icon, name, delay, time }, index) => {
        return (
          <CyberButton
            key={index}
            href={href}
            Icon={Icon}
            name={name}
            delay={delay}
            time={time}
          />
        );
      })}
    </GroupButtonsStyle>
  );
}
