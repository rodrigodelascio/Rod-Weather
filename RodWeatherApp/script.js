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
let geoKey = config.geoDBKey;

function debounce(func, timeout = 1000){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

search.addEventListener("click", () => {
    requestWeather();
    requestImg();
})

userInput.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter')
        return false

    else
        requestWeather();
        requestImg();
})

userInput.addEventListener('keyup', function (event) {
    
    if (event.key == ("AltLeft" || "AltRight" || "CapsLock" || "ContextMenu" || "ControlLeft" || "ControlRight" || "MetaLeft" || "MetaRight" || "ShiftLeft" || "Space" || "Tab"))
        return false
        
    else
        requestCityList();
})

let requestWeather = () => {

    let city = userInput.value

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

    let userSearch = userInput.value
    
    if (userSearch.includes(",")) 
    userSearch = userSearch.slice(0, -4)

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

let requestCityList = () => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': geoKey,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };
    
    let searchURL = `?limit=5&offset=0&namePrefix=${userInput.value}&sort=-population`

    fetch('https://wft-geo-db.p.rapidapi.com/v1/geo/cities'+searchURL, options)
    
    .then(response => {
        return response.json()
    })

    .then(data => {
        dispCity(data)
    })

    let dispCity = (data) => {
        // const { city, countryCode } = data.data[0]
        // const { href } = data.links[0];

        removeDrop();

        let cityNames = []

        cityNames = data.data.map((myCity) => {
            return myCity.city + ", " + myCity.countryCode;
        })

        console.log(cityNames)

        createDrop(cityNames);
    }

    let createDrop = (list) => {
        const listEl = document.createElement("ul");
        listEl.className = "autocompleteList";
        listEl.id = "autocompleteList";

        list.forEach((oneCity) => {
            const listItem = document.createElement("li");
            const cityButton = document.createElement("button");

            cityButton.innerHTML = oneCity;
            cityButton.addEventListener("click", onButtonClick)
            listItem.appendChild(cityButton);

            listEl.appendChild(listItem);
        })

        const autocomp = document.getElementById("autocomp");
        autocomp.appendChild(listEl);

        if (userInput.value.trim().length === 0)
            listEl.style.display = "none"
    }

    let removeDrop = () => {
        const listEl = document.getElementById("autocompleteList");
        if (listEl)
            listEl.remove();
    }

    function onButtonClick(e) {
        const buttonEl = e.target;
        userInput.value = buttonEl.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        removeDrop();
    }
}
