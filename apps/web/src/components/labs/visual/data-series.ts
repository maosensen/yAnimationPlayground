export type DataSegment = "all" | "core" | "edge";
export type DataRange = "7d" | "30d" | "90d";

export type SignalDatum = {
  id: string;
  label: string;
  all: number;
  core: number;
  edge: number;
  retention: number;
  latency: number;
};

export const signalData: SignalDatum[] = [
  {
    id: "p01",
    label: "01",
    all: 38,
    core: 44,
    edge: 27,
    retention: 62,
    latency: 88,
  },
  {
    id: "p02",
    label: "02",
    all: 42,
    core: 47,
    edge: 31,
    retention: 64,
    latency: 84,
  },
  {
    id: "p03",
    label: "03",
    all: 40,
    core: 49,
    edge: 29,
    retention: 65,
    latency: 82,
  },
  {
    id: "p04",
    label: "04",
    all: 47,
    core: 53,
    edge: 34,
    retention: 67,
    latency: 79,
  },
  {
    id: "p05",
    label: "05",
    all: 45,
    core: 55,
    edge: 33,
    retention: 68,
    latency: 76,
  },
  {
    id: "p06",
    label: "06",
    all: 53,
    core: 59,
    edge: 39,
    retention: 71,
    latency: 73,
  },
  {
    id: "p07",
    label: "07",
    all: 58,
    core: 63,
    edge: 43,
    retention: 72,
    latency: 70,
  },
  {
    id: "p08",
    label: "08",
    all: 55,
    core: 65,
    edge: 41,
    retention: 74,
    latency: 68,
  },
  {
    id: "p09",
    label: "09",
    all: 61,
    core: 68,
    edge: 46,
    retention: 76,
    latency: 64,
  },
  {
    id: "p10",
    label: "10",
    all: 66,
    core: 72,
    edge: 49,
    retention: 77,
    latency: 61,
  },
  {
    id: "p11",
    label: "11",
    all: 64,
    core: 74,
    edge: 48,
    retention: 79,
    latency: 58,
  },
  {
    id: "p12",
    label: "12",
    all: 71,
    core: 78,
    edge: 54,
    retention: 81,
    latency: 55,
  },
  {
    id: "p13",
    label: "13",
    all: 74,
    core: 81,
    edge: 58,
    retention: 83,
    latency: 52,
  },
  {
    id: "p14",
    label: "14",
    all: 72,
    core: 82,
    edge: 57,
    retention: 84,
    latency: 50,
  },
  {
    id: "p15",
    label: "15",
    all: 79,
    core: 86,
    edge: 63,
    retention: 86,
    latency: 47,
  },
  {
    id: "p16",
    label: "16",
    all: 82,
    core: 89,
    edge: 66,
    retention: 88,
    latency: 44,
  },
  {
    id: "p17",
    label: "17",
    all: 86,
    core: 92,
    edge: 70,
    retention: 90,
    latency: 41,
  },
  {
    id: "p18",
    label: "18",
    all: 91,
    core: 96,
    edge: 75,
    retention: 92,
    latency: 38,
  },
];

export const rangePointCounts: Record<DataRange, number> = {
  "7d": 8,
  "30d": 12,
  "90d": 18,
};

export const segmentLabels: Record<DataSegment, string> = {
  all: "全部信号",
  core: "核心用户",
  edge: "边缘用户",
};

export const rangeLabels: Record<DataRange, string> = {
  "7d": "7 天",
  "30d": "30 天",
  "90d": "90 天",
};
