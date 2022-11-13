const search = document.getElementById("search");
const userInput = document.getElementById("userInput");
const backgroundImg = document.getElementsByTagName("body")
const cityWeather = document.getElementsByClassName("cityWeather")

let apiKey = config.apiWeatherKey;
let clientID = config.clientUnsplash;

search.addEventListener("click", () => {
    requestWeather();
    requestImg();
})

userInput.addEventListener('keydown', function (event) {
    if (event.key != 'Enter')
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
            displayWeather(data)
        })

    let displayWeather = (data) => {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        console.log(name, icon, description, temp, humidity, speed)

        
    }
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