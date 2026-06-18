
export const mockCurrent = {
  temp_c:            22,
  feels_like_c:      21,
  humidity:          74,
  wind_kph:          14,
  wind_direction:    210,
  precipitation_mm:  0.4,
  condition:         'Partly cloudy',
  weather_code:      2,
};

export const mockLocation = {
  lat:      -1.2921,
  lon:       36.8219,
  timezone: 'Africa/Nairobi',
};

export const mockDaily = [
  { date: '2026-06-17', weather_code: 2,  condition: 'Partly cloudy',   temp_max: 24, temp_min: 14, precipitation_mm: 0.2, precipitation_probability: 12, sunrise: '2026-06-17T06:24:00', sunset: '2026-06-17T18:41:00' },
  { date: '2026-06-18', weather_code: 1,  condition: 'Mainly clear',    temp_max: 25, temp_min: 15, precipitation_mm: 0.0, precipitation_probability: 8,  sunrise: '2026-06-18T06:24:00', sunset: '2026-06-18T18:41:00' },
  { date: '2026-06-19', weather_code: 61, condition: 'Slight rain',     temp_max: 22, temp_min: 14, precipitation_mm: 4.1, precipitation_probability: 45, sunrise: '2026-06-19T06:25:00', sunset: '2026-06-19T18:41:00' },
  { date: '2026-06-20', weather_code: 63, condition: 'Moderate rain',   temp_max: 19, temp_min: 13, precipitation_mm: 12.4,precipitation_probability: 80, sunrise: '2026-06-20T06:25:00', sunset: '2026-06-20T18:41:00' },
  { date: '2026-06-21', weather_code: 63, condition: 'Moderate rain',   temp_max: 18, temp_min: 13, precipitation_mm: 9.8, precipitation_probability: 75, sunrise: '2026-06-21T06:25:00', sunset: '2026-06-21T18:42:00' },
  { date: '2026-06-22', weather_code: 2,  condition: 'Partly cloudy',   temp_max: 21, temp_min: 14, precipitation_mm: 1.2, precipitation_probability: 30, sunrise: '2026-06-22T06:25:00', sunset: '2026-06-22T18:42:00' },
  { date: '2026-06-23', weather_code: 0,  condition: 'Clear sky',       temp_max: 26, temp_min: 15, precipitation_mm: 0.0, precipitation_probability: 5,  sunrise: '2026-06-23T06:26:00', sunset: '2026-06-23T18:42:00' },
];

export const mockWeather = {
  location: mockLocation,
  current:  mockCurrent,
  daily:    mockDaily,
};

export const mockInsights = {
  location: mockLocation,
  current:  mockCurrent,
  daily:    mockDaily,
  summary:
    'Conditions are suitable for field work today — mild temperatures and low wind make spraying safe. ' +
    'Expect moderate rainfall Thursday through Saturday with up to 18mm accumulation; delay any new planting ' +
    'until Sunday when soil drainage improves. Consider harvesting mature crops before Thursday to avoid losses.',
};

export const mockWebhooks = [
  {
    id:        '1',
    url:       'https://myapp.co/webhook/weather',
    lat:       -1.2921,
    lon:       36.8219,
    location:  'Nairobi',
    triggers:  ['rain', 'extreme_wind', 'drought'],
    createdAt: '2026-06-15T10:00:00Z',
  },
  {
    id:        '2',
    url:       'https://sms-relay.co/hook/farmers',
    lat:       0.3476,
    lon:       32.5825,
    location:  'Kampala',
    triggers:  ['rain', 'frost'],
    createdAt: '2026-06-16T08:30:00Z',
  },
];

export const mockFiredAlerts = [
  {
    id:       '1',
    location: 'Nairobi',
    triggers: ['rain'],
    message:
      'Heavy rainfall detected (18mm). Delay planting and secure any loose structures — ' +
      'conditions expected to persist through Friday.',
  },
  {
    id:       '2',
    location: 'Kampala',
    triggers: ['frost'],
    message:
      'Frost risk overnight. Protect sensitive seedlings and cover any exposed ' +
      'irrigation pipes before sunset.',
  },
];

export const mockLocations = [
  { label: 'Nairobi',       lat: -1.2921, lon:  36.8219, timezone: 'Africa/Nairobi'       },
  { label: 'Kisumu',        lat: -0.0917, lon:  34.7679, timezone: 'Africa/Nairobi'       },
  { label: 'Mombasa',       lat: -4.0435, lon:  39.6682, timezone: 'Africa/Nairobi'       },
  { label: 'Kampala',       lat:  0.3476, lon:  32.5825, timezone: 'Africa/Kampala'       },
  { label: 'Dar es Salaam', lat: -6.7924, lon:  39.2083, timezone: 'Africa/Dar_es_Salaam' },
  { label: 'Kigali',        lat: -1.9441, lon:  30.0619, timezone: 'Africa/Kigali'        },
  { label: 'Addis Ababa',   lat:  9.0320, lon:  38.7469, timezone: 'Africa/Addis_Ababa'   },
];