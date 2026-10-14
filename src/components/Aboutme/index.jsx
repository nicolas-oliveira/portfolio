import React from 'react';
import { AboutText, Center, TextSelf } from './styles';
import { IoIosArrowDown } from 'react-icons/io';
import { profileData } from '../../data/profile';

export default function Aboutme() {
  const { name, avatarUrl, about } = profileData;

  return (
    <>
      <AboutText>
        <Center>
          <img src={avatarUrl} alt={`Foto de perfil de ${name}`} />
        </Center>
        <TextSelf>
          <h1>{about.title}</h1>
          {about.paragraphs.map((paragraph, index) => {
            if (paragraph.includes('UEMG')) {
              return (
                <p key={index}>
                  Graduado no curso de{' '}
                  <a
                    href={about.uemgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sistemas de Informação na UEMG
                  </a>
                  .
                </p>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </TextSelf>
        <Center>
          <span>Continue lendo</span>
          <span>
            <IoIosArrowDown aria-hidden="true" />
          </span>
        </Center>
      </AboutText>
      <h3>Alguns projetos que já criei:</h3>
    </>
  );
}
