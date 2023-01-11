var apiKey = '1ee6a1621d9b078aa202e762c6fd9595';
var appId = '7b54d8ab';
var searchRecipe = $('.search');
var displayCard = $('.card-container');
var headerCard = $('.main-header');
var searchHistory = $('.search-history');
var dataHistory = {};


function noFood(){
    // updated from html to append so user can still use search bar
    headerCard.append('<p>Please enter a food or ingredient to search</p>');

}

function displayRecipe(recipeData){
    displayCard.html('');

    // commented it out below because food is not referenced again so can just call it.
    //var food = searchRecipe.val().trim();

    searchRecipe.val().trim();

    for(var i=0; i<12; i++){
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

function getRecipe(event){
    var food = searchRecipe.val().trim();

    if(food){
        $.get(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${apiKey}&q=${food}`)
        .then(function(recipeData){
            displayRecipe(recipeData);



            //dataHistory = recipeData.hits[0].recipe;

            dataHistory = JSON.parse(localStorage.getItem('search-history'));

            dataHistory[food] = food;

    
            localStorage.setItem('search-history', JSON.stringify(dataHistory));


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
  };
    

function init(){

    var storedSearch = JSON.parse(localStorage.getItem('search-history'));

    for (prop in storedSearch) {
        searchHistory.append(`
        <button class='btn-search btn-history'>${prop}</button>
  
     `);
    }

    // event when user presses enter key
    searchRecipe.keypress(function (event) {

        var key = event.which;
         if (key == 13) {
            getRecipe();
         };
    });

    $('#btn-search').on('click', getRecipe); 

    $('.btn-history').on('click', searchBtn); 
};

init();




