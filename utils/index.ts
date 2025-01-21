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

function pickRandomStationFromTop33Percent(sortedStations: [string, number][]) {
  const targetStations = sortedStations.slice(
    0,
    Math.ceil(sortedStations.length / 3)
  );

  const randomIndex = Math.floor(Math.random() * targetStations.length);
  return targetStations[randomIndex];
}

function sortTrafficAndPickRandom(stations: Record<string, number>) {
  const sortedStations = sortTrafficByAsc(stations);

  const randomStation = pickRandomStationFromTop33Percent(sortedStations);
  return randomStation[0];
}
