import React, { useEffect, useState } from 'react';
const providerLinks = {
  'Netflix': 'https://www.netflix.com/',
  'Amazon Prime Video': 'https://www.primevideo.com/',
  'Disney Plus': 'https://www.disneyplus.com/',
  'Hulu': 'https://www.hulu.com/',
  'Apple TV Plus': 'https://tv.apple.com/',
  'HBO Max': 'https://www.max.com/',
  'Peacock': 'https://www.peacocktv.com/',
  'Paramount Plus': 'https://www.paramountplus.com/',
};

const MovieModal = ({ movie, onClose, apiOptions }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchProviders, setWatchProviders] = useState(null);

const withApiKey = (url) => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // or import at top of file
  return url.includes('?') ? `${url}&api_key=${API_KEY}` : `${url}?api_key=${API_KEY}`;
};

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch movie details  
        const response = await fetch(withApiKey(`https://api.themoviedb.org/3/movie/${movie.id}`), apiOptions);

        const data = await response.json();
        setMovieDetails(data);

        // Fetch watch providers
        const providersResponse = await fetch(withApiKey(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`), apiOptions);

        const providersData = await providersResponse.json();
        setWatchProviders(providersData.results);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movie.id]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='modal-backdrop'
      onClick={handleBackdropClick}
    >
      <div className='modal-content'>
        <button className='modal-close' onClick={onClose}>
          ×
        </button>

        {isLoading ? (
          <div className='modal-loading'>
            <div className='spinner'></div>
            <p>Loading movie details...</p>
          </div>
        ) : (
          <>
            <div className='modal-header'>
              {movieDetails?.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path}`}
                  alt={movieDetails?.title}
                  className='modal-backdrop-img'
                />
              )}
              <div className='modal-header-overlay'>
                <h2>{movieDetails?.title}</h2>
                <div className='modal-meta'>
                  <div className='rating'>
                    <img
                      src='https://raw.githubusercontent.com/SawSimonLinn/jsm_movie_app/f08b4a52bd995111e964fc94f3dd3d015d24d085/src/assets/star.svg'
                      alt='Star Icon'
                    />
                    <p>{movieDetails?.vote_average ? movieDetails.vote_average.toFixed(1) : 'N/A'}</p>
                  </div>
                  <span>•</span>
                  <p>{movieDetails?.release_date ? movieDetails.release_date.split('-')[0] : 'N/A'}</p>
                  <span>•</span>
                  <p>{movieDetails?.runtime ? `${movieDetails.runtime} min` : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className='modal-body'>
              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <div className='modal-genres'>
                  {movieDetails.genres.map((genre) => (
                    <span key={genre.id} className='genre-tag'>
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className='modal-section'>
                <h3>Overview</h3>
                <p>{movieDetails?.overview || 'No overview available.'}</p>
              </div>

              {movieDetails?.tagline && (
                <div className='modal-section'>
                  <h3>Tagline</h3>
                  <p className='tagline'>"{movieDetails.tagline}"</p>
                </div>
              )}

              <div className='modal-info-grid'>
                {movieDetails?.status && (
                  <div className='info-item'>
                    <strong>Status:</strong> {movieDetails.status}
                  </div>
                )}
                {movieDetails?.original_language && (
                  <div className='info-item'>
                    <strong>Language:</strong> {movieDetails.original_language.toUpperCase()}
                  </div>
                )}
                {movieDetails?.budget > 0 && (
                  <div className='info-item'>
                    <strong>Budget:</strong> ${movieDetails.budget.toLocaleString()}
                  </div>
                )}
                {movieDetails?.revenue > 0 && (
                  <div className='info-item'>
                    <strong>Revenue:</strong> ${movieDetails.revenue.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Watch Providers Section */}
              {watchProviders && (
                <div className='modal-section watch-providers-section'>
                  <h3>Where to Watch</h3>
                  
                  {/* Check for US providers (you can change to your country code) */}
                  {watchProviders.US ? (
                    <div className='providers-container'>
                      {/* Streaming Services */}
                      {watchProviders.US.flatrate && watchProviders.US.flatrate.length > 0 && (
  <div className='provider-type'>
    <h4>Stream</h4>
    <div className='provider-logos'>
      {watchProviders.US.flatrate.map((provider) => {
        const link =
          providerLinks[provider.provider_name] ||
          watchProviders.US.link ||
          '#';
        return (
          <a
            key={provider.provider_id}
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className='provider-item'
            title={`Watch on ${provider.provider_name}`}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
              alt={provider.provider_name}
            />
            <span>{provider.provider_name}</span>
          </a>
        );
      })}
    </div>
  </div>
)}


                      {/* Rent */}
                      {watchProviders.US.rent && watchProviders.US.rent.length > 0 && (
  <div className='provider-type'>
    <h4>Rent</h4>
    <div className='provider-logos'>
      {watchProviders.US.rent.map((provider) => {
        const link =
          providerLinks[provider.provider_name] ||
          watchProviders.US.link ||
          '#';
        return (
          <a
            key={provider.provider_id}
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className='provider-item'
            title={`Rent from ${provider.provider_name}`}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
              alt={provider.provider_name}
            />
            <span>{provider.provider_name}</span>
          </a>
        );
      })}
    </div>
  </div>
)}



                      {/* Buy */}
                     {watchProviders.US.buy && watchProviders.US.buy.length > 0 && (
  <div className='provider-type'>
    <h4>Buy</h4>
    <div className='provider-logos'>
      {watchProviders.US.buy.map((provider) => {
        const link =
          providerLinks[provider.provider_name] ||
          watchProviders.US.link ||
          '#';
        return (
          <a
            key={provider.provider_id}
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className='provider-item'
            title={`Buy from ${provider.provider_name}`}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
              alt={provider.provider_name}
            />
            <span>{provider.provider_name}</span>
          </a>
        );
      })}
    </div>
  </div>
)}

                    </div>
                  ) : (
                    <p className='no-providers'>
                      {movieDetails?.status === 'Released' 
                        ? 'Streaming information not available for your region.' 
                        : 'Coming soon to theaters and streaming platforms.'}
                    </p>
                  )}
                  
                  {watchProviders.US?.link && (
                    <a 
                      href={watchProviders.US.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='justwatch-link'
                    >
                      View on JustWatch →
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;