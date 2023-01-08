var displayModalCard = $('.modal-body');
var userLat = "";
var userLong = "";
var restaurantCards ="";

// function getting API data
function displayRestaurants() {
    var settings = {
        "async": false,
        "crossDomain": true,
        "url": `https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=${userLat}&longitude=${userLong}&limit=30&currency=USD&distance=2&open_now=false&lunit=km&lang=en_US`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "c3a1d70af0mshce05733c28a55f1p1750bdjsna4353cd463ff",
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (restaurantsData) {

        displayModalCard.html('');

        // storing a variable to the number of restaurants appended
        var restaurantResults = displayModalCard[0].children.length;


        // loop does not break until number of restaurant cards produced reaches 10
        for (var i=0; restaurantResults < 11; i++) {


            // current number of cards
            restaurantResults = displayModalCard[0].children.length;

            var data = restaurantsData.data[i];

            var cuisine = data.cuisine;

            // if that restaurants contain a photo property and more than 3 cuisine tags it will be appended

            if (data.hasOwnProperty("photo") && cuisine.length > 3) {
                var image = data.photo.images.medium.url;
                restaurantCards = displayModalCard.append(`
                <div class="card" style="width: 18rem">
                        <img class="card-image" src="${image}"/>
                        <div class="card-body">
                        <h5 class="card-title">${data.name}</h5>
                        <h5 class="card-text">${cuisine[0].name}, ${cuisine[1].name}, ${cuisine[2].name}</h5>
                        <h5 class="card-text">${data.address}</h5>
                        <a href="${data.web_url}" class="btn btn-primary" target='_blank'>Trip Advisor page</a>
                        </div>
                    </div>
                `);
             };
        };
    });
    
    launchModal();


};

// function to trigger modal containing local restaurants

function launchModal() {

    $('#restaurantsModal').modal({
        backdrop: true,
        keyboard: true,
        focus: true,
        show: true
      });

    $('#restaurantsModal').modal('toggle');
};

//store location data to a variable and call displayRestaurants

function success(position) {
    var userGeoLocation = position.coords;
    userLat = userGeoLocation.latitude;
    userLong = userGeoLocation.longitude;

    displayRestaurants();
};

// function declarations to get location
function getLocation() {
    
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(success);

    } else {
        alert("I'm sorry, geolocation is not supported by this browser.");
    };

};

function init(){

    $('.btn-store').on('click', getLocation); 

};

init();