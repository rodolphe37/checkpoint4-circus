import React, { useState } from 'react';
import ReactPlayer from 'react-player';

import './Performance.css';

const Performance = () => {
  const [play, setPlay] = useState(false);

  return (
    <div className="container spectacle">
      <div className="row title">
        <h3 className="deep-purple-text darken-4">CRYSTAL – Le Spectacle</h3>
      </div>
      <h4>« La première prestation acrobatique sur glace.  »</h4>
      <div className="row-video">
        <ReactPlayer 
          url="https://youtu.be/zVoB9S8SVSE"
          playing={play} 
          volume={0.5}
          onClick={() => setPlay(!play)}
        />
      </div>
      <div className="row-description">
        <p>DURÉE : 2H00</p>
        <p>ÉCRITURE, MISE EN SCÈNE, SCÉNOGRAPHIE ET DIRECTION ARTISTIQUE : Shana Carroll et Sébastien Soldevila</p>
        <p>
        Bien plus qu’un spectacle sur glace, Crystal vous offre un tout nouveau genre d’expérience, créée par le Cirque du Soleil. Voyez des acrobates et des patineurs de classe mondiale s’emparer de la glace avec grâce pour y accomplir des prouesses qui défient les lois de la gravité. Une performance audacieuse et inattendue du Cirque du Soleil, qui promet son lot de sensations fortes. 
        </p>
        <p>«Dans ce spectacle mis en scène par Shana Carroll et Sébastien Soldevila, Crystal, héroïne à la personnalité marginale, vous mène au cœur d’une aventure exaltante alors qu’elle plonge dans un univers surréel issu de son imagination. Sentez l’adrénaline monter alors qu’elle plonge dans ce monde fantastique pour accomplir sa destinée et devenir une femme confiante, curieuse et créative. Crystal vous invite à suspendre la réalité et à glisser dans un monde d’où jaillit une vie colorée, avec des projections visuelles incroyables et une bande sonore qui fusionne harmonieusement la musique populaire avec la sonorisation typique du Cirque du Soleil. Crystal convient à tous les publics.. »</p>
      </div>
    </div>
  );
}

export default Performance;