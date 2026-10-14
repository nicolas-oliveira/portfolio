import React from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import CyberButton from '../CyberButton';
import { GroupButtonsStyle } from './styles';
import { profileData } from '../../data/profile';

export default function GroupButtons() {
  return (
    <GroupButtonsStyle>
      <CyberButton
        to="/portfolio"
        Icon={FaBoxOpen}
        name="PORTFOLIO_"
        delay="3s"
        time="6s"
      />

      {profileData.socialLinks.map(({ href, Icon, name, delay, time }, index) => (
        <CyberButton
          key={index}
          href={href}
          Icon={Icon}
          name={name}
          delay={delay}
          time={time}
        />
      ))}
    </GroupButtonsStyle>
  );
}
