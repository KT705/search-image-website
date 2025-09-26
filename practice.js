const searchIn = document.getElementById('type');
const btn = document.getElementById('trigger');
const display = document.getElementById('displayImage');
const searchHistory = document.getElementById('history');

const apiKey = "6pSXqeLdXCSo59u0LNfkvnhXmXEuI0HSVlDIvMNpWro"

let searchTerm = JSON.parse(localStorage.getItem('searchTerm')) || [];

btn.addEventListener('click', () => {
    const newValue = searchIn.value.trim();
    if(newValue === ''){
       display.textContent = 'search something';
       display.style.color = '#ff0000ff';
       return;
    }

    searchAndSave(newValue);

});

async function searchAndSave(newValue) {
    // Check for duplicates before pushing to history
    if (!searchTerm.includes(newValue)) {
        searchTerm.push(newValue);
        saveImage();
        renderHistory();
    }
    
    searchImages(newValue);
}

function saveImage(){
    localStorage.setItem('searchTerm', JSON.stringify(searchTerm));
};

function renderHistory() {
    searchHistory.innerHTML = '';

    searchTerm.forEach(term => {
        const li = document.createElement('li');
        li.textContent = term;
        li.addEventListener('click', () => {
            searchIn.value = term;
            searchImages(term);
        });
        searchHistory.appendChild(li);
    });
}

async function searchImages(newValue) {
    
    display.innerHTML = '';
    display.textContent = 'Loading....';

    try{
        
        const url = `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${apiKey}`;
        const response = await fetch(url);

        if(!response.ok){
            throw new Error('error bad connection!');
        }

        const data = await response.json();

        if(data.results.length === 0){
            display.textContent = 'no image found';
            return;
        }

        data.results.forEach((images) => {
    
            const img = document.createElement('img');
            img.src = images.urls.small;
            img.alt = images.alt_description;

            display.appendChild(img);
        });

    }catch(myError){
        console.error('Fetch error', myError);
        display.textContent = 'No internet connection';
    }
}
renderHistory();



