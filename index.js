const fetchData = async searchTerm => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: 'd9667e43',
      i: 'tt4154796',
      s: searchTerm
    }
  });
  return response.data.Search;
};

const input = document.querySelector('input');

const onInput = async event => {
  const movies = await fetchData(event.target.value);
  for (let movie of movies) {
    const div = document.createElement('div');
    // console.log(movie.Title);
  }
};

input.addEventListener('input', debounce(onInput, 750));
