const search = document.getElementById("search");
const userInput = document.getElementById("userInput");
const backgroundImg = document.getElementById("backPic")
const cityWeather = document.getElementById("cityWeather")
const tempDisp = document.getElementById("tempDisp")
const iconDisp = document.getElementById("iconDisp")
const descriptionDisp = document.getElementById("descriptionDisp")
const humidDisp = document.getElementById("humidDisp")
const windDisp = document.getElementById("windDisp")
const feelLike = document.getElementById("feelLike")

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

        .catch(error => console.log(error))

    let displayWeather = (data) => {
        const { name } = data
        const { icon, description } = data.weather[0]
        const { temp, humidity, feels_like } = data.main
        const { speed } = data.wind
        const { country } = data.sys

        const tempInt = Math.floor(temp)
        const feelLikeInt = Math.floor(feels_like)

        cityWeather.textContent = `Weather in ${name}, ${country}`
        tempDisp.textContent = `${tempInt}° C`
        descriptionDisp.textContent = `${description}`
        feelLike.textContent = `Feels like: ${feelLikeInt}° C`
        humidDisp.textContent = `Humidity: ${humidity}%`
        windDisp.textContent = `Wind speed: ${speed} km/h`
        iconDisp.src = `http://openweathermap.org/img/wn/${icon}.png`
    }
}

let requestImg = () => {

    let userSearch = String(userInput.value)

    let urlImg = `https://api.unsplash.com/search/photos?client_id=${clientID}&query=${userSearch}&orientation=landscape`

    fetch(urlImg)

        .then(response => {
            return response.json()
        })

        .then(data => {
            displayImg(data)
        })

    let randNumber = Math.floor(Math.random() * 10);

    let displayImg = (data) => {
        const { raw } = data.results[randNumber].urls

        backgroundImg.src = `${raw}`;
    }
}