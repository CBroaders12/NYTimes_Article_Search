// set baseURL and key for access
const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = '6IU77XWIwfaaqb0prYd7UFpQneJ3SYYu';
let url;

// SEARCH FORM
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date')
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

// RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

// RESULTS SECTION
const section = document.querySelector('section');

//Hide nav bar before we search for anything
nav.style.display = 'none';

//Default values for pagination and display
let pageNumber = 0;
//let displayNav = false; // Never used

//Add Event Listeners for search and page shifting
searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

//Define functions for event listeners
function fetchResults(e) {
  e.preventDefault();
  url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}`;
  //console.log('URL:', url);

  //add optional dates
  if (startDate.value !== '') {
    // console.log(startDate.value);
    url += `&begin_date=${startDate.value}`;
  }

  if (endDate.value !== '') {
    url += `&end_date=${endDate.value}`
  }

  //console.log(url);

  fetch(url)
    .then(result => {
      return result.json();
    })
    .then(json => {
      displayResults(json);
    });
};

function displayResults(json) {
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }

  let articles = json.response.docs;

  if (articles.length === 0) {
    console.log('No results');
  } else {
    for (let i = 0; i < articles.length; i++) {
      let article = document.createElement('article');
      let heading = document.createElement('h2');
      let link = document.createElement('a');
      let img = document.createElement('img');
      let para = document.createElement('p');
      let clearfix = document.createElement('div');

      let current = articles[i];
      // console.log('Current:', current);

      link.href = current.web_url;
      link.textContent = current.headline.main;
      link.target = "blank";

      para.textContent = 'Keywords: ';

      for (let j = 0; j < current.keywords.length; j++) {
        let span = document.createElement('span');
        span.textContent += current.keywords[j].value + ' ';
        para.appendChild(span);
      }

      if (current.multimedia.length > 0) {
        img.src = 'https://www.nytimes.com/' + current.multimedia[0].url;
        img.alt = current.headline.main;
      }

      // clearfix.setAttribute('class', 'clearfix');
      clearfix.classList.add('clearfix') //better way to do this because it won't override preexisting class names

      heading.appendChild(link);
      article.appendChild(heading);
      article.appendChild(img);
      article.appendChild(para);
      article.appendChild(clearfix);
      section.appendChild(article);
    }
  }

  if (articles.length === 10) {
    if (pageNumber > 0) {
      previousBtn.style.display = 'block';
    } else {
      previousBtn.style.display = 'none'
    }
    nextBtn.style.display = 'block';
    nav.style.display = 'block';
  } else if (articles.length < 10) {
    nextBtn.style.display = 'none';
  }

};

function nextPage(e) {
  pageNumber++;
  fetchResults(e)
  //console.log("Page number:", pageNumber);
};

function previousPage(e) {
  if (pageNumber > 0) {
    pageNumber--;
  } else {
    return;
  }
  fetchResults(e);
  //console.log("Page:", pageNumber);
};