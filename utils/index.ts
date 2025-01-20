export type Items = {
  捷運站別: string;
  出站人次: string;
  進站人次: string;
  統計期: string;
}[];

export function readDataAndCalculateTraffic(items: Items) {
  const stationTraffic: Record<string, number> = {};

  items.forEach((item) => {
    const station = item["捷運站別"];
    if (!station) return;

    if (!stationTraffic[station]) {
      stationTraffic[station] = 0;
    }

    const inCount = Number.parseInt(item["進站人次"], 10) || 0;
    const outCount = Number.parseInt(item["出站人次"], 10) || 0;
    stationTraffic[station] += inCount + outCount;
  });

  return sortTrafficAndPickRandom(stationTraffic);
}

function sortTrafficByAsc(stations: Record<string, number>) {
  return Object.entries(stations).sort((a, b) => a[1] - b[1]);
}

function pickRandomStationFromTop50Percent(sortedStations: [string, number][]) {
  const halfLength = Math.ceil(sortedStations.length / 2);
  const top50PercentStations = sortedStations.slice(0, halfLength);

  const randomIndex = Math.floor(Math.random() * top50PercentStations.length);
  return top50PercentStations[randomIndex];
}

function sortTrafficAndPickRandom(stations: Record<string, number>) {
  const sortedStations = sortTrafficByAsc(stations);

  const randomStation = pickRandomStationFromTop50Percent(sortedStations);
  return randomStation[0];
}
