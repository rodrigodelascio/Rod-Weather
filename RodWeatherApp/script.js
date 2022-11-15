const search = document.getElementById("search");
const userInput = document.getElementById("userInput");
const backgroundImg = document.getElementsByTagName("body")
const cityWeather = document.getElementById("cityWeather")
const tempDisp = document.getElementById("tempDisp")
const iconDisp = document.getElementById("iconDisp")
const descriptionDisp = document.getElementById("descriptionDisp")
const humidDisp = document.getElementById("humidDisp")
const windDisp = document.getElementById("windDisp")

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
        const { temp, humidity } = data.main
        const { speed } = data.wind

        const tempInt = Math.floor(temp)

        cityWeather.textContent = `Weather in ${name}`
        tempDisp.textContent = `${tempInt}° C`
        descriptionDisp.textContent = `${description}`
        humidDisp.textContent = `Humidity: ${humidity}%`
        windDisp.textContent = `Wind speed: ${speed} km/h`
        iconDisp.src = `http://openweathermap.org/img/wn/${icon}.png`
    }
}

let requestImg = () => {

    let userSearch = String(userInput.value)

    let urlImg = `https://api.unsplash.com/search/photos?client_id=${clientID}&query=${userSearch}`

    fetch(urlImg)

        .then(response => {
            return response.json()
        })

        .then(data => {
            console.log(data)
        })
    
        // backgroundImg.style.backgroundImage = `url(${data.results[0].urls.raw})`;

}