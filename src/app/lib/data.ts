
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

export type DailyMetric = {
  day: string;
  date: string;
  earnings: number;
  trips: number;
  onlineHours: number;
  tips: number;
};

export type WeeklyEarnings = {
  weekOf: string;
  totalEarnings: number;
  dailyMetrics: DailyMetric[];
};

export const earningsData: WeeklyEarnings[] = [
  {
    weekOf: 'Jul 22 - Jul 28, 2024',
    totalEarnings: 1750.0,
    dailyMetrics: [
      { day: 'Mon', date: 'Jul 22', earnings: 210, trips: 15, onlineHours: 8, tips: 25 },
      { day: 'Tue', date: 'Jul 23', earnings: 240, trips: 18, onlineHours: 8.5, tips: 30 },
      { day: 'Wed', date: 'Jul 24', earnings: 260, trips: 20, onlineHours: 9, tips: 35 },
      { day: 'Thu', date: 'Jul 25', earnings: 230, trips: 17, onlineHours: 8, tips: 28 },
      { day: 'Fri', date: 'Jul 26', earnings: 350, trips: 25, onlineHours: 10, tips: 45 },
      { day: 'Sat', date: 'Jul 27', earnings: 400, trips: 30, onlineHours: 11, tips: 50 },
      { day: 'Sun', date: 'Jul 28', earnings: 60, trips: 5, onlineHours: 2, tips: 10 },
    ],
  },
  {
    weekOf: 'Jul 15 - Jul 21, 2024',
    totalEarnings: 1680.5,
    dailyMetrics: [
      { day: 'Mon', date: 'Jul 15', earnings: 200, trips: 14, onlineHours: 7.5, tips: 22 },
      { day: 'Tue', date: 'Jul 16', earnings: 230, trips: 17, onlineHours: 8, tips: 28 },
      { day: 'Wed', date: 'Jul 17', earnings: 250, trips: 19, onlineHours: 8.5, tips: 33 },
      { day: 'Thu', date: 'Jul 18', earnings: 220, trips: 16, onlineHours: 7.8, tips: 25 },
      { day: 'Fri', date: 'Jul 19', earnings: 330, trips: 24, onlineHours: 9.5, tips: 42 },
      { day: 'Sat', date: 'Jul 20', earnings: 380, trips: 28, onlineHours: 10.5, tips: 48 },
      { day: 'Sun', date: 'Jul 21', earnings: 70.5, trips: 6, onlineHours: 2.5, tips: 12 },
    ],
  },
  {
    weekOf: 'Jul 8 - Jul 14, 2024',
    totalEarnings: 1590.0,
    dailyMetrics: [
        { day: "Mon", date: "Jul 8", earnings: 190, trips: 13, onlineHours: 7, tips: 20 },
        { day: "Tue", date: "Jul 9", earnings: 220, trips: 16, onlineHours: 7.5, tips: 26 },
        { day: "Wed", date: "Jul 10", earnings: 240, trips: 18, onlineHours: 8, tips: 31 },
        { day: "Thu", date: "Jul 11", earnings: 210, trips: 15, onlineHours: 7.2, tips: 23 },
        { day: "Fri", date: "Jul 12", earnings: 310, trips: 22, onlineHours: 9, tips: 40 },
        { day: "Sat", date: "Jul 13", earnings: 360, trips: 26, onlineHours: 10, tips: 45 },
        { day: "Sun", date: "Jul 14", earnings: 60, trips: 4, onlineHours: 2, tips: 8 },
    ],
  }
];


export const incentiveData: Incentive = {
  title: 'Weekend Quest',
  description: 'Complete 60 trips for a $100 bonus',
  current: 45,
  goal: 60,
  unit: 'trips',
  daysLeft: 2,
};

export type Incentive = {
  title: string;
  description: string;
  current: number;
  goal: number;
  unit: string;
  daysLeft: number;
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
