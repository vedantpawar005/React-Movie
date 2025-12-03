import { useEffect, useState } from "react";
import Search from "./componets/Search";
import MovieCard from "./componets/MovieCard";
import Spinner from "./componets/Spinner";
import MovieModal from "./componets/MovieModel";
const API_BASE_URL= 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: { accept: 'application/json' },
};


const withApiKey = (url) => {
  return url.includes('?') ? `${url}&api_key=${API_KEY}` : `${url}?api_key=${API_KEY}`;
};
function App()
{

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
const [selectedMovie, setSelectedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);

   useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  
const fetchMovies=async()=>
 
  {
     setIsLoading(true);
     setErrorMessage('');
    try
    {
      const endpoint=withApiKey(`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`);
      const response=await fetch(endpoint,API_OPTIONS);
      
      if(!response.ok)
        {
          throw new Error("Failed to fetch movies");
        }
        const data=await response.json();
        if(data.response=='False')
          {
            setErrorMessage(data.Error||'Failed to fetch movies');
            setMovieList([]);
            return;
          }
          setMovieList(data.results||[]);
    }
    catch(error)
    {
      setErrorMessage("Error while fetching the movies")
    }
    finally
    {
      setIsLoading(false);
    }
  }

 const fetchTrendingMovies = async () => {
    try {
      const endpoint = withApiKey(`${API_BASE_URL}/trending/movie/week`);
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch trending movies");
      }
      const data = await response.json();
      setTrendingMovies(data.results?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error while fetching trending movies:", error);
    }
  };

const searchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = withApiKey(`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`);
      const response = await fetch(endpoint, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error("Failed to search movies");
      }
      const data = await response.json();
      
      if (data.results && data.results.length === 0) {
        setErrorMessage('No movies found');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      setErrorMessage("Error while searching movies");
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
    fetchMovies();
    fetchTrendingMovies();
  }, []);

 useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchMovies(debouncedSearchTerm);
    } else {
      fetchMovies();
    }
  }, [debouncedSearchTerm])
  return(
    <main>
      <div className="pattern"/>
    <div className="wrapper">
      <header>
        <img src='https://raw.githubusercontent.com/SawSimonLinn/jsm_movie_app/refs/heads/main/src/assets/hero.png'
        
         alt="Hero-Banner"/>
        <h1>Find <span className="text-gradient">Movie</span> You'll Enjoy Without the Hassel</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        </Search>
        </header>
        {!searchTerm && trendingMovies.length > 0 && (
        <section className="trending">
            <h2>Trending This Week</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        : '/no-movie.png'
                    }
                    alt={movie.title}
                    onClick={() => setSelectedMovie(movie)}
                  />
                </li>
              ))}
            </ul>
          </section> )}
      <section className="all-movies">
        <h2>All Movies</h2>
        {isLoading?(<Spinner></Spinner>):
        errorMessage?(<p className="text-red-500">{errorMessage}</p>):
        (
        <ul>
          {movieList.map((movie)=>(
            <MovieCard key={movie.id} movie={movie}
            onClick={(selectedMovie)=>setSelectedMovie(selectedMovie)}></MovieCard>))}
        </ul>)}
      </section>
      {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            apiOptions={API_OPTIONS}
          />
        )}
         </div>
        </main>
  );
}
export default App;