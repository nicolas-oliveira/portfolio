import React from 'react';
import GlobalStyle from './styles/global';

import Header from './components/Header/index';
import CyberBox from './components/CyberBox/index';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaHatWizard,
  FaBoxOpen,
} from 'react-icons/fa';

function App() {
  return (
    <>
      <Header />

      <div className="GroupCyberBox">
        <CyberBox
          href="/portifolio"
          Icon={FaBoxOpen}
          name="PORTIFOLIO_"
          delay="3s"
          time="6s"
        />

        <CyberBox
          href="https://github.com/nicolas-oliveira"
          Icon={FaGithub}
          name="GITHUB_"
          delay="2s"
          time="6s"
        />

        <CyberBox
          href="https://bruxo.hashnode.dev"
          Icon={FaHatWizard}
          name="BRUXOJS_"
          delay="12s"
          time="7s"
        />

        <CyberBox
          href="https://www.linkedin.com/in/nicolasom/"
          Icon={FaLinkedin}
          name="LINKEDIN_"
          delay="18s"
          time="5s"
        />

        <CyberBox
          href="https://twitter.com/NickCageNick1"
          Icon={FaTwitter}
          name="TWITTER_"
          delay="8s"
          time="7s"
        />
      </div>
      <GlobalStyle />
    </>
  );
}

export default App;
