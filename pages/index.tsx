import { Items, readDataAndCalculateTraffic } from "@/utils";
import fs from "fs";
import Papa from "papaparse";
import path from "path";
import { useState } from "react";

const DEFAULT_VALUE = "？？？";
const DELAY = 3000;

export default function Home({ data }: { data: Items }) {
  const [selectedStation, setSelectedStation] = useState(DEFAULT_VALUE);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-dvw h-dvh font-bold">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="p-4">{selectedStation}</div>
        <button
          className="bg-sky-500 text-white py-2 px-4 rounded"
          onClick={() => {
            if (isLoading) return;

            setIsLoading(true);
            setSelectedStation(DEFAULT_VALUE);

            setTimeout(() => {
              const result = readDataAndCalculateTraffic(data);
              setSelectedStation(result);
              setIsLoading(false);
            }, DELAY);
          }}
        >
          {isLoading ? "Loading..." : "隨機挑選冷門捷運站！"}
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), "public", "data.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsedData = Papa.parse(fileContent, { header: true }).data;

  return { props: { data: parsedData } };
}
