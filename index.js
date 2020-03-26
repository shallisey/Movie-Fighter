const fetchData = async searchTerm => {
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
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async event => {
  const movies = await fetchData(event.target.value);

  if (!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = '';
  dropdown.classList.add('is-active');
  for (let movie of movies) {
    const option = document.createElement('a');
    //Checks for a movie poster
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.classList.add('dropdown-item');
    option.innerHTML = `
    <img  src="${imgSrc}" />
    ${movie.Title}
    `;
    option.addEventListener('click', () => {
      //close dropdown
      dropdown.classList.remove('is-active');
      //update input.value to title of movie
      input.value = movie.Title;
      onMovieSelect(movie);
    });

    resultsWrapper.appendChild(option);
  }
};

input.addEventListener('input', debounce(onInput, 750));

document.addEventListener('click', event => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove('is-active');
    input.value = '';
  }
});

const onMovieSelect = async movieSelected => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: 'd9667e43',
      i: movieSelected.imdbID
    }
  });
  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
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
</div>;
</article>
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.Awards}
    <p class='subtitle'>Awards</p>
  </p>
</article>;
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.BoxOffice}
    <p class='subtitle'>Box Office</p>
  </p>
</article>;
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.Metascore}
    <p class='subtitle'>Metascore</p>
  </p>
</article>;
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.imdbRating}
    <p class='subtitle'>IMDbRating</p>
  </p>
</article>;
<article class='notification is-danger'>
  <p class='title'>
    ${movieDetail.imdbVotes}
    <p class='subtitle'>IMDb Votes</p>
  </p>
</article>;

  `;
};
