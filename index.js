const autoCompleteConfig = {
  //Show an individual item
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img  src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
    `;
  },

  //Changes input.value to what you selected
  inputValue(movie) {
    return movie.Title;
  },
  //How to fetch the data
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com', {
      params: {
        apikey: 'd9667e43',
        s: searchTerm
      }
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  }
};

createAutoComplete({
  ...autoCompleteConfig,
  //Where to render the autocomplete to.
  root: document.querySelector('#left-autocomplete'),
  //Show what you "clicked" on
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'));
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  //Where to render the autocomplete to.
  root: document.querySelector('#right-autocomplete'),
  //Show what you "clicked" on
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'));
  }
});

const onMovieSelect = async (movieSelected, summaryElement) => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: 'd9667e43',
      i: movieSelected.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);
};

const movieTemplate = movieDetail => {
  return `
  <article class="media">
  <figure class="media-left">
    <p class="image">
      <img src="${movieDetail.Poster}" />
    </p>
  </figure>
  <div class='media-content'>
  <div class='content'>
    <h1>
      ${movieDetail.Title}
      <h4>
        ${movieDetail.Genre}
        <p>${movieDetail.Plot}</p>
      </h4>
    </h1>
  </div>
</div>
</article>
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.Awards}
    <p class='subtitle'>Awards</p>
  </p>
</article>
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.BoxOffice}
    <p class='subtitle'>Box Office</p>
  </p>
</article>
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.Metascore}
    <p class='subtitle'>Metascore</p>
  </p>
</article>
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.imdbRating}
    <p class='subtitle'>IMDbRating</p>
  </p>
</article>
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.imdbVotes}
    <p class='subtitle'>IMDb Votes</p>
  </p>
</article>

  `;
};
