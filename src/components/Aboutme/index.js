import React from 'react';
import { AboutText, Center, TextSelf } from './styles';
import { FaArrowDown } from 'react-icons/fa';
export default function Aboutme() {
  return (
    <AboutText>
      <Center>
        <img src="https://github.com/nicolas-oliveira.png" />
      </Center>
      <TextSelf>
        <h1>Sobre mim</h1>
        <p>
          Olá! Sou Nicolas e recentemente estudo e atuo como Software Developer
          em Passos, Minas Gerais.
        </p>
        <p>
          Atualmente gosto de criar coisas na Web e experimentar de tudo um
          pouco. Buscando sempre coisas novas e me atualizar sempre.
        </p>
        <p>
          Estou graduando atualmente no curso de{' '}
          <a>Sistemas de Informações na UEMG</a>
        </p>
        <p>
          Adquiri o gosto por tecnologia através do Linux, que por pura
          curiosidade, comecei a lidar e resolver problemas no meu computador
          pessoal sem perceber. Portanto sou muito conectado no mundo Open
          Source!
        </p>
      </TextSelf>
      <Center>
        <span>Veja o que construi</span>
        <span>
          <FaArrowDown />
        </span>
      </Center>
    </AboutText>
  );
}
