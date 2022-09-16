const { default: axios } = require("axios");
const express = require("express");
const app = express();

const ANDY = {
  YEARS: 1,
  MONTHS: 7,
  WEEKS: 0,
  DAYS: 5,
  HOURS: 1,
  MINUTES: 0,
  SECONDS: 0,
};

const LEONA = {
  YEARS: 0,
  MONTHS: 5,
  WEEKS: 0,
  DAYS: 9,
  HOURS: 0,
  MINUTES: 0,
  SECONDS: 0,
};

const THRESHOLD = {
  MONTHS: 12,
  WEEKS: 4,
  DAYS: 7,
  HOURS: 24,
  MINUTES: 60,
  SECONDS: 60,
};

function handleTime(time = "", originalTimer) {
  const fulltime = time.split(",");
  const adaptedTime =fulltime.reduce((acc, time) => {
    const [value, key] = time.trim().split(' ');
    const lastPosition = key.length - 1
    if(key.charAt(lastPosition) !== 's') {
      return {
        ...acc,
        [`${key}s`]: value
      }
    }
    return {
      ...acc,
      [key]: value
    }
  }, {})
  const finalTimer = Object.entries(originalTimer).reduce((acc, [key, value]) => {
    const time = Number(adaptedTime[key.toLowerCase()] || 0) + Number(value);
    if(acc) {
      return `${acc}, ${key.toLocaleLowerCase()}: ${time}`
    }
    return `Followage: ${key.toLocaleLowerCase()}: ${time}`
  }, "")
  return finalTimer;
}

app.get("/ping", function (_, res) {
  res.send("pong");
});

app.get("/", async function (_, res) {
  try {
    const { data } = await axios.get(
      "https://decapi.me/twitch/followage/misthy/andyy_sz?precision=10"
    );
    const time = handleTime(data, ANDY);
    res.send(time);
  } catch (err) {
    console.error(err);
    res.send("Não foi possivel calcular o tempo de Andyy_sz");
  }
});

app.get("/leona", async function (_, res) {
  try {
    const { data } = await axios.get(
      "https://decapi.me/twitch/followage/misthy/pequenaleona?precision=10"
    );
    console.log(data)
    const time = handleTime(data, LEONA);
    res.send(time);
  } catch (err) {
    console.error(err);
    res.send("Não foi possivel calcular o tempo de pequenaleona");
  }
});

app.set("port", process.env.PORT || 5000);

app.listen(app.get("port"));
