var apiKey = '1ee6a1621d9b078aa202e762c6fd9595';
var appId = '7b54d8ab';
var searchRecipe = $('.search');
var displayCard = $('.card-container');
var headerCard = $('.main-header');
var searchHistory = $('.search-history')


function noFood(){
    headerCard.html('<p>Please enter a food or ingredient to search</p>');

}

function displayRecipe(recipeData){
    displayCard.html('');
    var food = searchRecipe.val().trim();

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
    `)

    }

    
}

function getRecipe(event){
    var food = searchRecipe.val().trim();

    if(food){
        $.get(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${apiKey}&q=${food}`)
        .then(function(recipeData){
            displayRecipe(recipeData);



            var dataHistory = recipeData.hits[0].recipe;
    
            localStorage.setItem(food, JSON.stringify(dataHistory));
            var storedSearch = localStorage.getItem(food);

            if(storedSearch){
               searchHistory.append(`
                  <button class='btn-search btn-history'>${food}</button>
            
               `)

               $('.btn-history').on('click', searchBtn); 


               function searchBtn(){
                  var valueHistory = $(this)[0].innerText;
                  var inputHistory = $('.search').val();
                  inputHistory = valueHistory;
            
                
                }

            }
 
        })

    } else {
        noFood();
    }

    


}
    


function init(){
    $('.btn-search').on('click', getRecipe); 
}
init();




