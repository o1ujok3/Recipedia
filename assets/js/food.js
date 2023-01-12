var apiKey = '1ee6a1621d9b078aa202e762c6fd9595';
var appId = '7b54d8ab';
var searchRecipe = $('.search');
var displayCard = $('.card-container');
var headerCard = $('.main-header');
var searchHistory = $('.search-history');


function hasHiddenClass () {
    return headerCard.children('p').hasClass('hidden-alert');

}

// function to alert user to search for food
function noFood() {
    
    if(hasHiddenClass()) {
        headerCard.children('p').removeClass('hidden-alert');
    };

};

// function to display api results based on user's search
function displayRecipe(recipeData){

    displayCard.html('');

    for(var i=0; i< recipeData.hits.length; i++){
        var data = recipeData.hits[i].recipe;
        var image = data.images.REGULAR.url;
        
    displayCard.append(`
       <div class="card" style="width: 18rem">
            <img src="${image}"/>
            <div class="card-body">
               <h5 class="card-title">${data.label}</h5>
               <p class="card-text">calories: ${Math.round(data.calories)}</p>
               <p class="card-text">Number of servings: ${data.yield}</p>
               <p class="card-text">Total Time: ${data.totalTime} mins</p>
               <a href="${data.url}" class="btn btn-primary" target='_blank'>Link to the recipe page</a>
            </div>
        </div>
    `);

    };

    $('html, body').animate({
        scrollTop: $(displayCard).offset().top
    }, "slow");
    
};

// function to pass in food item and request data from API
function getRecipe(event_or_text) {

    var isString = typeof event_or_text === 'string';

    var food = isString ? event_or_text : searchRecipe.val().trim();

    if(food){
        $.get(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${apiKey}&q=${food}`)
        .then(function(recipeData){

            var hitsLength = recipeData.hits.length;

            if (hitsLength > 0) {

                displayRecipe(recipeData);

                if (!isString) {

                    var dataHistory = getSearchHistory();

                    dataHistory[food] = food;
        
                    setSearchHistory(dataHistory);
        
                    outputSearchHistory();

                };

            } else {
                noFood();
            };
 
        });

        
        if(!hasHiddenClass()) {
            headerCard.children('p').addClass('hidden-alert');
        };

    } else {
        noFood();
    };

    searchRecipe.val('');

};


// function to get text value from button clicked by user
function searchBtn(event){

    var isSpan = event.target.nodeName === 'SPAN';

    if(!isSpan) {
        
        var valueHistory = $(this)[0].innerText.slice(0, -1);

        getRecipe(valueHistory);
    }

};

// function to set search history in local storage
function setSearchHistory (event) {
    localStorage.setItem('search-history', JSON.stringify(event));
};


// function to get search history from local storage
function getSearchHistory () {
    return JSON.parse(localStorage.getItem('search-history')) || {};
};

// function to output food items previously searched into clickable buttons
function outputSearchHistory () {

    var storedSearch = getSearchHistory();
    
    searchHistory.empty();

    for (prop in storedSearch) {
        searchHistory.append(`
        <button class='btn-search btn-history'>${prop}<span class='del-his-btn'>X</span></button>
     `);
    };

};

// function to delete items from local storage
function delHistoryItem (event)  {

    event.stopPropagation();

    var item = $(this).parent().text().slice(0, -1);

    var history = getSearchHistory();

    delete history[item];

    setSearchHistory(history);

    outputSearchHistory();

};   

function init(){
    
    outputSearchHistory();

    // event when user presses enter key
    searchRecipe.keypress(function (event) {

        var key = event.which;
         if (key == 13) {
            getRecipe();
         };
    });

    $('#btn-search').on('click', getRecipe); 

    $('.search-history').on('click', '.btn-history', searchBtn); 

    $('body').on('click', '.del-his-btn', delHistoryItem);
};

init();




