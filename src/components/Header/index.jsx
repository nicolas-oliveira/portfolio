import React from 'react';
import { Container, Pseudocode, TextContent } from './styles';
import { profileData } from '../../data/profile';

export default function Header() {
  const { name, greeting, headline, subheadline } = profileData;

  return (
    <Container>
      <Pseudocode>
        <code>&lt;html&gt;</code>
        <code>&nbsp;&nbsp;&lt;body&gt;</code>
      </Pseudocode>

      <TextContent>
        <h2>{greeting}</h2>
        <h1>
          <span>{name}.</span>
          <br />
          {headline}
        </h1>

        <code>{subheadline}</code>
      </TextContent>

      <Pseudocode>
        <code>&nbsp;&nbsp;&lt;/body&gt;</code>
        <code>&lt;/html&gt;</code>
      </Pseudocode>
    </Container>
  );
}
