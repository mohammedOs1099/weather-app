"use strict";

let toDayName = document.querySelector("#to_day_name");
let toDayNum = document.querySelector("#to_day_num");
let toDayMOnth = document.querySelector("#to-day-month");
let toDayLocation = document.querySelector("#to_day_location");
let toDayTemp = document.querySelector("#to_day_temp");
let toDayText = document.querySelector("#to_day_text");
let toDaySpead = document.querySelector("#to_day_wind_spead");
let toDayIcon = document.querySelector("#to-day_icon");
let toDayhumidity = document.querySelector("#to-day_humidity");
let WindDirection = document.querySelector("#to_day_wind_direction");
let search = document.querySelector("#search");
// next day data
let nextDayImg = document.querySelectorAll(".next-day-img");
let nextDayMaxTemp = document.querySelectorAll("#next-day-max-temp");
let nextDayMinTemp = document.querySelectorAll("#next-day-min-temp");
let nextDayText = document.querySelectorAll(".next-day-text");
let nextDayName = document.querySelectorAll(".next-day-name");

//  get dats from Api
async function getWitherData(city) {
  try {
    let resData = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=3b660e136f8c465f846133653242505&q=${city}&days=7`,
    );
    let data = await resData?.json();
    return data;
  } catch (error) {
    return null;
  }
}

// display today data
function toDayDisplayData(data) {
  let newData = new Date(data.current.last_updated);
  toDayName.innerHTML = newData.toLocaleDateString("en-us", {
    weekday: "long",
  });
  toDayNum.innerHTML = newData.getDate();
  toDayMOnth.innerHTML = newData.toLocaleDateString("en-us", { month: "long" });

  toDayLocation.innerHTML = data.location.name;
  toDayTemp.innerHTML = data.current.temp_c;
  toDayIcon?.setAttribute("src", data?.current?.condition?.icon);
  toDayText.innerHTML = data.current.condition.text;
  toDayhumidity.innerHTML = data.current.humidity + "%";
  toDaySpead.innerHTML = data.current.wind_kph + "km/h";
  WindDirection.innerHTML = data.current.wind_dir;
}
// display next day data
function getNextDayData(data) {
  let foreCastDay = data?.forecast?.forecastday;

  for (let i = 0; i < foreCastDay.length - 1; i++) {
    if (foreCastDay[i + 1]) {
      nextDayImg[i]?.setAttribute(
        "src",
        foreCastDay[i + 1]?.day?.condition?.icon,
      );
      nextDayMaxTemp[i].innerHTML = foreCastDay[i + 1]?.day?.maxtemp_c;
      nextDayMinTemp[i].innerHTML = foreCastDay[i + 1]?.day?.mintemp_c;
      nextDayText[i].innerHTML = foreCastDay[i + 1].day?.condition?.text;
      nextDayName[i].innerHTML = new Date(
        foreCastDay[i + 1]?.date,
      ).toLocaleDateString("en-us", { weekday: "long" });
    }
  }
}

// search
const debounce = (func, time) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, time);
  };
};

search.addEventListener(
  "keyup",
  debounce(function (eve) {
    if (eve.target.value != "") {
      try {
        startApp(eve.target.value);
      } catch (error) {
        return null;
      }
    } else {
      startApp();
    }
  }, 1000),
);
// start App
async function startApp(city = "Alexandria") {
  let data = await getWitherData(city);
  if (data && !data.error) {
    try {
      toDayDisplayData(data);
      getNextDayData(data);
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
}
startApp();
