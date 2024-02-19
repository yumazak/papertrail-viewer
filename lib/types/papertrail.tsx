export type PaperTrailLogData = {
  id: string;
  key: string;
  generatedAt: Date;
  receivedAt: Date;
  sourceId: string;
  sourceName: string;
  sourceIp: string;
  facilityName: string;
  severityName: string;
  program: string;
  message: PaperTrailLogDataMessage;
};

export interface LogEntry {
  name: string;
  key: string;
  date: string;
  service: number;
}

export type PaperTrailLogDataMessage = {
  at: string;
  method: string;
  path: string;
  host: string;
  requestId: string;
  fwd: string;
  dyno: string;
  connect: number;
  service: number;
  status: number;
  bytes: number;
  protocol: string;
};
