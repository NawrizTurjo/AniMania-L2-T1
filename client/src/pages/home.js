import React from 'react';

const AnimeListItem = ({ title, description }) => (
  <li className="anime-list-item">
    <h6>{title}</h6>
    <p>{description}</p>
  </li>
);

export default function Home() {
  return (
    <div className="Home-div container-fluid">
      <h4 className="text-center mt-3">Unlock the Magic of Animation - where stories unfold, emotions ignite, and worlds come alive</h4>
      <img src="./images/AniMania.png" alt="AniMania Logo" className="logo img-fluid" />
      <div className="row">
        <section className="col-md-6 upper-part">
          <div className="card-container">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card bg-light p-3 mt-3">
                <h6>{`Card ${index + 1} Title`}</h6>
                <p>{`This is the description for Card ${index + 1}`}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="col-md-6 right-half">
          <div className="anime-list-container">
            <ul className="anime-list">
              {[...Array(17)].map((_, index) => (
                <AnimeListItem key={index} title={`Anime ${index + 1}`} description="Description of the anime" />
              ))}
            </ul>
          </div>
        </section>
        <section className="col-md-6 watched-anime-part" style={{ float: 'left' }}>
          <div className="watch-history-container">
            <ul className="anime-list">
              {[...Array(10)].map((_, index) => (
                <AnimeListItem key={index} title={`Watched Anime ${index + 1}`} description="Watched this recently" />
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
