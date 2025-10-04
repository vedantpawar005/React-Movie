import React from 'react';

const Search = (props) => {
    const {searchTerm,setSearchTerm}=props;
  return (
    <div className='search'>
      <div>
        <img src='https://raw.githubusercontent.com/SawSimonLinn/jsm_movie_app/f08b4a52bd995111e964fc94f3dd3d015d24d085/src/assets/search.svg'
        alt='search'
        />
        <input
        type='text'
        placeholder='Search movies'
        value={searchTerm}
        onChange={(e)=>{setSearchTerm(e.target.value)}}
        />
        

      </div>
    </div>
  );
};

export default Search;