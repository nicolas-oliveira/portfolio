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
        <h2>Olá, me chamo</h2>
        <h1>
          <span>Nicolas Oliveira.</span>
          <br />
          Gosto de transformar <br /> ideias em realidade.
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
