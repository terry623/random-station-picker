const fs = require("fs");
const csv = require("csv-parser");

function readCSVAndCalculateTraffic(filePath) {
  const stationTraffic = {};

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const station = row["捷運站別"];
      if (!station) return;

      if (!stationTraffic[station]) {
        stationTraffic[station] = 0;
      }

      const inCount = Number.parseInt(row["進站人次"]);
      const outCount = Number.parseInt(row["出站人次"]);
      stationTraffic[station] += inCount + outCount;
    })
    .on("end", () => {
      sortTrafficAndPickRandom(stationTraffic);
    });
}

function sortTrafficByAsc(stations) {
  return Object.entries(stations).sort((a, b) => a[1] - b[1]);
}

function pickRandomStationFromTop50Percent(sortedStations) {
  const halfLength = Math.ceil(sortedStations.length / 2);
  const top50PercentStations = sortedStations.slice(0, halfLength);

  const randomIndex = Math.floor(Math.random() * top50PercentStations.length);
  return top50PercentStations[randomIndex];
}

function sortTrafficAndPickRandom(stations) {
  const sortedStations = sortTrafficByAsc(stations);

  console.log("排序後的站點流量:");
  console.table(
    sortedStations.map((data) => [data[0], data[1].toLocaleString()])
  );

  const randomStation = pickRandomStationFromTop50Percent(sortedStations);
  console.log(`從人流低的前 50% 站中隨機抽取一站: ${randomStation[0]}`);
}

// 資料來源：https://data.taipei/dataset/detail?id=178ebf06-0451-4ac1-bbba-c255ca1fdac6
readCSVAndCalculateTraffic("data.csv");
