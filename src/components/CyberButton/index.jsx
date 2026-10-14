import React from 'react';
import PropTypes from 'prop-types';
import {
  StyledAnchor,
  StyledLink,
  StyledButton,
  RepeatedContainerGlitch,
} from './styles';

export default function CyberButton({
  name = '',
  href,
  to,
  onClick,
  Icon,
  delay = '0s',
  time = '0s',
}) {
  const content = (
    <>
      {Icon && <Icon size={20} aria-hidden="true" />}
      <span>{name}</span>

      <RepeatedContainerGlitch delay={delay} time={time} aria-hidden="true">
        {Icon && <Icon size={20} />}
        <span>{name}</span>
      </RepeatedContainerGlitch>
    </>
  );

  if (to) {
    return <StyledLink to={to}>{content}</StyledLink>;
  }

  if (href) {
    return (
      <StyledAnchor href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </StyledAnchor>
    );
  }

  return (
    <StyledButton type="button" onClick={onClick}>
      {content}
    </StyledButton>
  );
}

CyberButton.propTypes = {
  name: PropTypes.string.isRequired,
  href: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
  Icon: PropTypes.elementType,
  delay: PropTypes.string,
  time: PropTypes.string,
};
