const searchHistoryUL = document.getElementById('searchHistoryUL');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', function() {
    const input = searchInput.value;
    console.log(input);
})