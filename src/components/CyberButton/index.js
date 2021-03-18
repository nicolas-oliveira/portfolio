import React from 'react';
import { ContainerButton, RepeatedContainerGlitch } from './styles';
import { string, any } from 'prop-types';

CyberButton.propTypes = {
  name: string.isRequired,
  href: string,
  Icon: any.isRequired,
  delay: string.isRequired,
  time: string.isRequired,
};

function CyberButton({ name = '', href = '', Icon, delay = '0', time = '0' }) {
  return (
    <ContainerButton href={href} target="_blank">
      <Icon size={20} />
      <span>{name}</span>

      <RepeatedContainerGlitch delay={delay} time={time}>
        <Icon size={20} />
        <span>{name}</span>
      </RepeatedContainerGlitch>
    </ContainerButton>
  );
}

export default CyberButton;
