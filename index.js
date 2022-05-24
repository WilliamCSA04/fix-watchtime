const { default: axios } = require("axios");
const express = require("express");
const app = express();

const ORIGINAL = {
  YEARS: 1,
  MONTHS: 7,
  WEEKS: 0,
  DAYS: 5,
  HOURS: 1,
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

function handleTime(time = "") {
  const fulltime = time.split(",");
  const timeObj = fulltime.reduce((acc, t) => {
    const [value, key] = t.trim().split(" ");
    const numberedValue = Number(value);
    const keyUpperCase = key.toUpperCase();
    if (keyUpperCase.charAt(keyUpperCase.length - 1) === "S") {
      acc[keyUpperCase] = numberedValue;
    }
    acc[`${keyUpperCase}S`] = numberedValue;
    return acc;
  }, {});
  const { data } = Object.entries(ORIGINAL).reduceRight(
    (acc, [key, value]) => {
      let timeValue = timeObj[key];
      if (acc.overflow && timeValue) {
        timeValue += acc.overflow;
      } else if (!timeValue) {
        timeValue = 0;
      }
      const partialValue = value + timeValue;
      const thresholdValue = THRESHOLD[key];
      const overlimit = partialValue >= thresholdValue;
      let finalValue = 0;
      if (overlimit) {
        finalValue = thresholdValue - 1;
        acc.overflow = partialValue - finalValue;
      } else {
        finalValue = partialValue;
      }
      acc.data.unshift(`${finalValue} ${key.toLocaleLowerCase()}`);

      return acc;
    },
    { overflow: 0, data: [] }
  );
  return data.join(", ");
}

app.get("/ping", function (_, res) {
  res.send("pong");
});

app.get("/", async function (_, res) {
  try {
    const { data } = await axios.get(
      "https://decapi.me/twitch/followage/misthy/andyy_sz?precision=10"
    );
    const time = handleTime(data);
    res.send(time);
  } catch (err) {
    console.error(err);
    res.send("Não foi possivel calcular o tempo de Anddyy_sz");
  }
});

app.set("port", process.env.PORT || 5000);

app.listen(app.get("port"));
