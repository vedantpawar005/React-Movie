import React from 'react';

const MovieCard = ({
  movie,
  onClick,
}) => {
  const { title, vote_average, poster_path, release_date, original_language } = movie;
  
  const handleClick = () => {
    console.log('Movie card clicked:', movie);
    if (onClick) {
      onClick(movie);
    }
  };
  
  return (
    <div onClick={handleClick}>
      <div className='movie-card'>
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : '/no-movie.png'
          }
          alt={title}
        />

        <div className='mt-4'>
          <h3>{title}</h3>
          <div className='content'>
            <div className='rating'>
              <img src='https://raw.githubusercontent.com/SawSimonLinn/jsm_movie_app/f08b4a52bd995111e964fc94f3dd3d015d24d085/src/assets/star.svg' 
              
              alt='Star Icon' />
              <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
            </div>
            <span>•</span>
            <p className='lang'>{original_language}</p>
            <span>•</span>
            <p className='year'>
              {release_date ? release_date.split('-')[0] : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;