import React from 'react';
import { CyberBoxContainer, Glitch } from './styles';
/* eslint react/prop-types: 0 */
export default function CyberBox({ name, href, Icon, delay, time }) {
  return (
    <CyberBoxContainer href={href}>
      <Icon size={20} />
      <span>{name}</span>

      <Glitch delay={delay} time={time}>
        <Icon size={20} />
        <span>{name}</span>
      </Glitch>
    </CyberBoxContainer>
  );
}
