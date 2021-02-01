import React from 'react';
import { Container, Pseudocode, TextContent } from './styles';

export default function Header() {
  return (
    <Container>
      <Pseudocode>
        <code>&lt;html&gt;</code>
        <code>&nbsp;&nbsp;&lt;body&gt;</code>
      </Pseudocode>

      <TextContent>
        <h1>
          Olá,
          <br />
          sou Nicolas,
          <br /> web developer
        </h1>
        <code>Em busca de ser Full Stack Developer / Linux Lover</code>
      </TextContent>

      <Pseudocode>
        <code>&nbsp;&nbsp;&lt;/body&gt;</code>
        <code>&lt;/html&gt;</code>
      </Pseudocode>
    </Container>
  );
}
