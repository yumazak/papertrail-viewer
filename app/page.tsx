"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import React, { useState, ChangeEvent } from "react";
import Papa, { ParseResult } from "papaparse";
import { PaperTrailLogData } from "@/lib/types/papertrail";
import { MultiLineChart } from "@/components/tabContents/MultiLineChart";
import { DataTable } from "@/components/tabContents/DataTable";
import { BarChartContent } from "@/components/tabContents/BarChartContent";

export default function Home() {
  const [paperTrailLogData, setPaperTrailLogData] = useState<
    PaperTrailLogData[]
  >([]);
  const tabNames = ["Chart", "DataTable"];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        console.log(file);
        const isCSV = content.includes(",");
        const delimiter = file.type == "text/tab-separated-values" ? "\t" : ",";
        console.log("parsing");
        const parsedData = Papa.parse(content, { delimiter });
        const rows = parsedData.data as string[][];
        console.log(parsedData);
        const paperTrailLogData: PaperTrailLogData[] = rows
          .filter((row: string[]) => row.length == 10)
          .filter((row: string[]) => row[9].includes("at="))
          .map((row: string[]) => {
            const entries = row[9].split(" ").map((part) => {
              const [key, value] = part.split("=");
              return [key, value.replace(/"/g, "")]; // ダブルクォーテーションを削除
            });

            const data = Object.fromEntries(entries);

            const message = {
              at: data.at,
              method: data.method,
              path: data.path,
              host: data.host,
              requestId: data.request_id,
              fwd: data.fwd,
              dyno: data.dyno,
              connect: parseInt(data.connect),
              service: parseInt(data.service),
              status: parseInt(data.status),
              bytes: parseInt(data.bytes),
              protocol: data.protocol,
            };

            return {
              id: row[0],
              key: `${message.method}:${message.path}`,
              generatedAt: new Date(row[1]),
              receivedAt: new Date(row[2]),
              sourceId: row[3],
              sourceName: row[4],
              sourceIp: row[5],
              facilityName: row[6],
              severityName: row[7],
              program: row[8],
              message: message,
            };
          });
        setPaperTrailLogData(paperTrailLogData);
        console.log(paperTrailLogData);
      };
      reader.readAsText(file);
    }
  };
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">CSV, TSV File</Label>
        <Input
          id="picture"
          type="file"
          className="cursor-pointer"
          onChange={handleFileChange}
          accept=".csv,.tsv"
        />
      </div>
      <Tabs defaultValue="Chart" className="space-y-4 w-full">
        <TabsList>
          {tabNames.map((tabName) => (
            <TabsTrigger key={tabName} value={tabName}>
              {tabName}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Chart" className="space-y-4">
          <MultiLineChart data={paperTrailLogData} />
        </TabsContent>
        <TabsContent value="DataTable" className="space-y-4">
          <DataTable data={paperTrailLogData} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
