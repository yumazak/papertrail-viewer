"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import React, { useState, ChangeEvent } from "react";
import Papa, { ParseResult } from "papaparse";
import { LogEntry, PaperTrailLogData } from "@/lib/types/papertrail";
import { MultiLineChart } from "@/components/tabContents/MultiLineChart";
import { DataTable } from "@/components/tabContents/DataTable";
import { BarChartContent } from "@/components/tabContents/BarChartContent";

function simplifyUrlPath(url: string): string {
  const simplifiedUrl = url.replace(/\?.*$/, "").replace(/\/U[\da-fA-F]+$/, "");

  return simplifiedUrl;
}

export default function Home() {
  const [paperTrailLogData, setPaperTrailLogData] = useState<LogEntry[]>([]);
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
        let aggregatedData: Record<string, LogEntry> = {};
        const uuidRegex =
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

        rows
          .filter((row) => row.length === 10)
          .forEach((row: string[]) => {
            if (!row) return;
            const idMatch = row[9].match(uuidRegex);
            const nameMatch = row[9].match(/Started (GET|POST) "(.*?)"/);
            const responseTimeMatch = row[9].match(/in (\d+)ms/);
            console.log(responseTimeMatch);
            if (!idMatch) return;

            if (!aggregatedData[idMatch[0]]) {
              aggregatedData[idMatch[0]] = {
                name: "",
                key: "",
                date: row[1],
                service: 0,
              };
            }
            if (nameMatch) {
              aggregatedData[idMatch[0]].name = nameMatch[2];
              aggregatedData[idMatch[0]].key = `${
                nameMatch[1]
              }: ${simplifyUrlPath(nameMatch[2])}`;
            }

            if (responseTimeMatch) {
              aggregatedData[idMatch[0]].service = parseFloat(
                responseTimeMatch[1]
              );
            }
          });

        setPaperTrailLogData(
          Object.values(aggregatedData).filter((v) => v.service !== 0)
        );
        console.log(aggregatedData);
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
