export type WeeklySummary = {
  earnings: number;
  trips: number;
  tips: number;
  kms: number;
  onlineMinutes: number;
};

export const weeklySummaryData: WeeklySummary = {
  earnings: 1250.75,
  trips: 102,
  tips: 145.5,
  kms: 842,
  onlineMinutes: 2880, // 48 hours
};

export type DailyHighlight = {
  day: string;
  earnings: number;
};

export const dailyHighlightsData: DailyHighlight[] = [
  { day: 'Mon', earnings: 150 },
  { day: 'Tue', earnings: 180 },
  { day: 'Wed', earnings: 220 },
  { day: 'Thu', earnings: 190 },
  { day: 'Fri', earnings: 300 },
  { day: 'Sat', earnings: 350 },
  { day: 'Sun', earnings: 260 },
];

export type Incentive = {
  title: string;
  description: string;
  current: number;
  goal: number;
  unit: string;
  daysLeft: number;
};

export const incentiveData: Incentive = {
  title: 'Weekend Quest',
  description: 'Complete 60 trips for a $100 bonus',
  current: 45,
  goal: 60,
  unit: 'trips',
  daysLeft: 2,
};

export type DriverStatus = {
  continuousDrivingHours: number;
};

export const driverStatusData: DriverStatus = {
  continuousDrivingHours: 4.75,
};

export type Settings = {
  currency: string;
  location: string;
};
