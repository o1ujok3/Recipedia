var apiKey = '1ee6a1621d9b078aa202e762c6fd9595';
var appId = '7b54d8ab';
var searchRecipe = $('.search');
var displayCard = $('.card-container');
var headerCard = $('.main-header');
var searchHistory = $('.search-history');


function noFood(){
    // updated from html to append so user can still use search bar
    headerCard.children('p').removeClass('hidden-alert');

}

function displayRecipe(recipeData){
    displayCard.html('');

    // commented it out below because food is not referenced again so can just call it.
    //var food = searchRecipe.val().trim();

    searchRecipe.val().trim();

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
               <p class="card-text">Total Time: ${data.totalTime}mins</p>
               <a href="${data.url}" class="btn btn-primary" target='_blank'>Link to the recipe page</a>
            </div>
        </div>
    `);

    };

    // scrolls to results
    $('html, body').animate({
        scrollTop: $(displayCard).offset().top
    }, "slow");


    
};

function getRecipe(event_or_text){
    var isString = typeof event_or_text === 'string';
    var food = isString ? event_or_text : searchRecipe.val().trim();

    console.log('test');

    if(food){
        $.get(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${apiKey}&q=${food}`)
        .then(function(recipeData){
            displayRecipe(recipeData);



            //dataHistory = recipeData.hits[0].recipe;

            var dataHistory = JSON.parse(localStorage.getItem('search-history')) || {};

            dataHistory[food] = food;

            localStorage.setItem('search-history', JSON.stringify(dataHistory));

            outputSearchHistory();

           // var storedSearch = localStorage.getItem(food);

            // if(storedSearch){
            //    searchHistory.append(`
            //       <button class='btn-search btn-history'>${food}</button>
            
            //    `);

            // //    function searchBtn(){
            // //       var valueHistory = $(this)[0].innerText;
            // //     //  var inputHistory = $('.search').val();
            // //     //  inputHistory = valueHistory;
            // //      $('.search').val(valueHistory);
            // //     };

            //     // $('.btn-history').on('click', searchBtn); 

            // };


 
        });

        var hasHiddenClass = headerCard.children('p').hasClass('hidden-alert');

        if(!hasHiddenClass) {
            headerCard.children('p').addClass('hidden-alert');
        }

    } else {
        noFood();
    };

    // clears search bar only have data retrieved
    searchRecipe.val('');

   
};

function searchBtn(){
    var valueHistory = $(this)[0].innerText;
  //  var inputHistory = $('.search').val();
  //  inputHistory = valueHistory;
   $('.search').val(valueHistory);

   getRecipe(valueHistory);
};

function getSearchHistory () {
    return JSON.parse(localStorage.getItem('search-history')) || {};
}

function outputSearchHistory () {
    var storedSearch = getSearchHistory();

    searchHistory.empty();

    for (prop in storedSearch) {
        //<button class='btn-search btn-history'>${prop}<span class='del-his-btn'>X</span></button>
        searchHistory.append(`
        <button class='btn-search btn-history'>${prop}</button>
  
     `);
    }

}

// function delHistoryItem (event)  {

//     event.stopPropagation();

//     var el = event.target;
    
//     console.log(el);

//     var item = $(this).parent().text().slice(0, -1);

//     console.log(item);

//     var history = getSearchHistory();

//     delete history[item];

//     console.log(history);

//     localStorage.setItem('search-history', JSON.stringify(history));


// }   

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

    // $('body').on('click', '.del-his-btn', delHistoryItem);
};

init();




