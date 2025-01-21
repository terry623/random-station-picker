import { Items, readDataAndCalculateTraffic } from "@/utils";
import fs from "fs";
import Papa from "papaparse";
import path from "path";
import { useState } from "react";

const DEFAULT_VALUE = "？？？";
const DELAY = 3000;

const Spinner = () => (
  <div
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]" />
  </div>
);

export default function Home({ data }: { data: Items }) {
  const [selectedStation, setSelectedStation] = useState(DEFAULT_VALUE);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-dvw h-dvh font-bold">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="p-4">{selectedStation}</div>
        <button
          className="bg-sky-500 text-white py-2 px-4 rounded h-10 w-44"
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
          {isLoading ? <Spinner /> : "隨機抽冷門捷運站！"}
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
