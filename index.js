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
    const response = await axios.get('https://www.omdbapi.com', {
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
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  //Where to render the autocomplete to.
  root: document.querySelector('#right-autocomplete'),
  //Show what you "clicked" on
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary', 'right'));
  }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movieSelected, summaryElement, side) => {
  const response = await axios.get('https://www.omdbapi.com', {
    params: {
      apikey: 'd9667e43',
      i: movieSelected.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);
  //assigining data to the left or right side
  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  //If both sides have a movie clicked we start the comparison
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  leftSideStats = document.querySelectorAll('#left-summary .notification');
  rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (leftSideValue > rightSideValue) {
      leftStat.classList.remove('is-danger');
      rightStat.classList.remove('is-danger');
      leftStat.classList.add('is-primary');
      rightStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-danger');
      leftStat.classList.remove('is-danger');
      rightStat.classList.add('is-primary');
      leftStat.classList.add('is-warning');
    }
  });
};
//  ************ EXTRACTING VALUES AND TURNING THEM INTO NUMBERS***************
const movieTemplate = movieDetail => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  let count = 0;
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    word = parseInt(word);
    if (!isNaN(word)) {
      prev += word;
    }
    return prev;
  }, 0);

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
<article data-value=${awards} class='notification is-danger'>
  <p class='title'>
    ${movieDetail.Awards}
    <p class='subtitle'>Awards</p>
  </p>
</article>
<article data-value=${dollars} class='notification is-danger'>
  <p class='title'>
    ${movieDetail.BoxOffice}
    <p class='subtitle'>Box Office</p>
  </p>
</article>
<article data-value=${metaScore} class='notification is-danger'>
  <p class='title'>
    ${movieDetail.Metascore}
    <p class='subtitle'>Metascore</p>
  </p>
</article>
<article data-value=${imdbRating} class='notification is-danger'>
  <p class='title'>
    ${movieDetail.imdbRating}
    <p class='subtitle'>IMDbRating</p>
  </p>
</article>
<article data-value=${imdbVotes} class='notification is-danger'>
  <p class='title'>
    ${movieDetail.imdbVotes}
    <p class='subtitle'>IMDb Votes</p>
  </p>
</article>

  `;
};
