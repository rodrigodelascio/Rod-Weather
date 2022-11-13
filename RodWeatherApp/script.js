const search = document.getElementById("search");
const userInput = document.getElementById("userInput");

let apiKey = config.apiWeatherKey;
let clientID = config.clientUnsplash;

search.addEventListener("click", () => {
    requestWeather();
    requestImg();
})

userInput.addEventListener('keydown', function(event){
    if(event.key != 'Enter')
    return false

    else
    requestWeather();
    requestImg();    
})

let requestWeather = () => {

    let city = String(userInput.value)

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    fetch(url)

    .then(response => {
        return response.json()
    })

        .then(data => {
            console.log(data)
        })
}

let requestImg = () => {

    let userSearch = String(userInput.value)

    let urlImg = `https://api.unsplash.com/search/photos?client_id=${clientID}&query=${userSearch}city`

    fetch(urlImg)

    .then(response => {
          return response.json()
    })

    .then(data => {
        console.log(data)

    })
}