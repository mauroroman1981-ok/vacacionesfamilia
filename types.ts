export interface ArubaData {
  weather: {
    temp: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    conditionType: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  };
  januaryClimate: {
    avgTemp: string;
    waterTemp: string;
    rainDays: string;
  };
  tips: string[];
  groundingSources: Array<{
    title: string;
    uri: string;
  }>;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
