const search = document.getElementById("search");
const userInput = document.getElementById("userInput");
const backgroundImg = document.getElementById("backPic");
const cityWeather = document.getElementById("cityWeather");
const tempDisp = document.getElementById("tempDisp");
const iconDisp = document.getElementById("iconDisp");
const descriptionDisp = document.getElementById("descriptionDisp");
const humidDisp = document.getElementById("humidDisp");
const windDisp = document.getElementById("windDisp");
const feelLike = document.getElementById("feelLike");
const geoLocRequest = document.getElementById("geoLocRequest");
const loadIcon = document.getElementById("loadIcon");
const weatherData = document.getElementById("weatherData");

const apiKey = config.apiWeatherKey;
const clientID = config.clientUnsplash;
const geoKey = config.geoDBKey;

const API = {
  weather: "https://api.openweathermap.org/data/2.5/weather",
  unsplash: "https://api.unsplash.com/search/photos",
  geoCities: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
};

loadIcon.style.display = "none";

const setLoading = (isLoading) => {
  loadIcon.style.display = isLoading ? "block" : "none";
  weatherData.style.display = isLoading ? "none" : "block";
};

const debounce = (fn, delay = 600) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

const round = (value) => Math.round(Number(value));

const sanitizeSearchTerm = (term) => {
  const trimmed = term.trim();
  const commaIndex = trimmed.indexOf(",");
  return commaIndex === -1 ? trimmed : trimmed.slice(0, commaIndex);
};

const buildWeatherUrl = ({ city, coords }) => {
  if (coords) {
    const { lat, lon } = coords;
    return `${API.weather}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  }
  return `${API.weather}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
};

const renderWeather = (data) => {
  const { name, sys, main, weather, wind } = data;
  const { icon, description } = weather[0];
  const tempInt = round(main.temp);
  const feelLikeInt = round(main.feels_like);
  const speedInt = round(wind.speed);

  cityWeather.textContent = `${name}, ${sys.country}`;
  tempDisp.textContent = `${tempInt}° C`;
  descriptionDisp.textContent = description;
  feelLike.textContent = `Feels like: ${feelLikeInt}° C`;
  humidDisp.textContent = `Humidity: ${main.humidity}%`;
  windDisp.textContent = `Wind speed: ${speedInt} km/h`;
  iconDisp.src = `https://openweathermap.org/img/wn/${icon}.png`;
  iconDisp.alt = description;
};

const updateBackground = async (term) => {
  const query = sanitizeSearchTerm(term || userInput.value);
  if (!query) return;

  const url = `${API.unsplash}?client_id=${clientID}&query=${encodeURIComponent(query)}&orientation=landscape&per_page=20`;
  const data = await fetchJson(url);
  if (!data.results || !data.results.length) return;

  const randIndex = Math.floor(Math.random() * data.results.length);
  backgroundImg.src = data.results[randIndex].urls.regular;
};

const handleWeatherRequest = async (city) => {
  const trimmedCity = city.trim();
  if (!trimmedCity) return;

  setLoading(true);
  try {
    const url = buildWeatherUrl({ city: trimmedCity });
    const data = await fetchJson(url);
    renderWeather(data);
    await updateBackground(data.name);
  } catch (err) {
    alert("City not found, try again!");
  } finally {
    setLoading(false);
  }
};

const handleWeatherByCoords = async (lat, lon) => {
  setLoading(true);
  try {
    const url = buildWeatherUrl({ coords: { lat, lon } });
    const data = await fetchJson(url);
    renderWeather(data);
    await updateBackground(data.name);
  } catch (err) {
    console.error(err);
    alert("Unable to retrieve your location weather.");
  } finally {
    setLoading(false);
  }
};

const requestCityList = async () => {
  const userSearch = userInput.value.trim();
  removeDrop();
  if (!userSearch) return;

  try {
    const searchURL = `?limit=5&offset=0&namePrefix=${encodeURIComponent(userSearch)}&types=CITY&sort=-population`;
    const data = await fetchJson(`${API.geoCities}${searchURL}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": geoKey,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    });

    const cityNames = data.data.map(
      (city) => `${city.city}, ${city.countryCode}`,
    );
    createDrop(cityNames);
  } catch (err) {
    console.error("Autocomplete failed", err);
  }
};

const fetchCity = debounce(requestCityList);

const createDrop = (list) => {
  if (!list.length) return;

  const listEl = document.createElement("ul");
  listEl.className = "autocompleteList";
  listEl.id = "autocompleteList";

  list.forEach((oneCity) => {
    const listItem = document.createElement("li");
    const cityButton = document.createElement("button");

    cityButton.textContent = oneCity;
    cityButton.addEventListener("click", onButtonClick);
    listItem.appendChild(cityButton);
    listEl.appendChild(listItem);
  });

  const autocomp = document.getElementById("autocomp");
  autocomp.appendChild(listEl);
};

const removeDrop = () => {
  const listEl = document.getElementById("autocompleteList");
  if (listEl) listEl.remove();
};

const onButtonClick = (e) => {
  const buttonEl = e.target;
  userInput.value = buttonEl.textContent
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  removeDrop();
  handleWeatherRequest(userInput.value);
};

const geoFindMe = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      handleWeatherByCoords(latitude, longitude);
    },
    () => alert("Unable to retrieve your location."),
    { timeout: 7000 },
  );
};

const onInputChange = () => {
  fetchCity();
};

search.addEventListener("click", () => handleWeatherRequest(userInput.value));
userInput.addEventListener("input", onInputChange);
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleWeatherRequest(userInput.value);
});
geoLocRequest.addEventListener("click", geoFindMe);
