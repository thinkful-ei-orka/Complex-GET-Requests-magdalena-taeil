const apiKey = 'gZfxctKtMuCpiANQvrdPrBGt8OTltWhpPtadLbYu';

function getParks(states, numResults) {
  console.log(states);
  console.log(numResults);

  // https://developer.nps.gov/api/v1/parks?stateCode=IL,NY&limit=10&api_key=gZfxctKtMuCpiANQvrdPrBGt8OTltWhpPtadLbYu
  let baseUrl = 'https://developer.nps.gov/api/v1/parks';
  let queryString = '?stateCode=';
  states.forEach((state, i) => {
    queryString += state;
    if (i === states.length - 1) {
      // do nothing
    } else {
      queryString += ',';
    }
  });
  queryString += `&limit=${numResults}`;
  queryString += `&api_key=${apiKey}`;
  let url = baseUrl + queryString;

  $('#results').html('<p>Searching...</p>');
  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(responseJson => {
      displayResults(responseJson);
    })
    .catch(error => console.log('Something went wrong.'));
}

function displayResults(json) {
  console.log(json);

  let html = '';
  json.data.forEach(function(park) {
    let physicalAddress = park.addresses.filter((address) => address.type === 'Physical');
    let addressHtml = `
      <address>
        <div>${physicalAddress[0].line1}</div>
        <div>${physicalAddress[0].line2}</div>
        <div>${physicalAddress[0].line3}</div>
        <div>${physicalAddress[0].city}, ${physicalAddress[0].stateCode} ${physicalAddress[0].postalCode}</div>
      </address>`;
    let parkHtml = `
      <div>
        <h2><a href="${park.url}" target="_blank">${park.fullName}</a></h2>
        <p>${park.description}</p>
        ${addressHtml}
      </div>`;
    html += parkHtml;
  });
  $('#results').html(html);
}

function handleSubmit() {
  $('#searchForm').submit(function(event) {
    event.preventDefault();

    let states = $('#states').val();
    let numResults = parseInt($('#numResults').val());

    if (states.length === 0 || numResults < 1 || numResults > 50 ||  isNaN(numResults)) {
      $('#results').html('<p>Please select at least one state and a number of results in between 1 and 50.');
    } else {
      getParks(states, numResults);
    }
  });
}

$(document).ready(function() {
  handleSubmit();
});
