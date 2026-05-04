export const ROUTE_START = 1650   // Gangtok, m
export const ROUTE_END   = 4310   // Nathu La, m

export const ALTIMETER_MARKS = [
  { m: 1650, label: 'Gangtok' },
  { m: 2400, label: 'Kyongnosla' },
  { m: 3753, label: 'Tsomgo Lake' },
  { m: 4060, label: 'Baba Mandir' },
  { m: 4310, label: 'Nathu La' },
]

export const WAYPOINTS = [
  {
    index: 1,
    kicker: 'Kilometre 38 · 3,753 m',
    title: 'Tsomgo Lake Basecamp',
    body: 'A glacial lake ringed by yak-bell tea stalls — the last permitted overnight halt before the pass. Sip butter tea, hire a thick army parka, and let the lungs settle before the final climb up Jelep La road.',
    stats: [
      { label: 'Elevation',  value: '3,753', unit: 'metres' },
      { label: 'Lake',       value: 'Frozen', unit: 'Dec — Apr' },
      { label: 'Yaks',       value: '12+',    unit: 'on hire' },
    ],
    coords: '27.3756° N · 88.7619° E',
    forecast: null,
  },
  {
    index: 2,
    kicker: 'Kilometre 56 · 4,310 m',
    title: 'Nathu La Summit',
    body: 'Conditions at the Indo-Tibetan border post, where Sikkim meets the Chumbi Valley. Forecast updated every 15 minutes from the ITBP ridge station — windows close fast and the pass shuts at the first whiteout.',
    stats: [
      { label: 'Temp',        value: '−6°',  unit: 'celsius' },
      { label: 'Wind',        value: '42',   unit: 'km/h NE' },
      { label: 'Visibility',  value: '0.9',  unit: 'km' },
    ],
    coords: '27.3866° N · 88.8306° E',
    forecast: [
      { t: '06', temp: -8, wx: 'snow'  },
      { t: '09', temp: -4, wx: 'cloud' },
      { t: '12', temp: -1, wx: 'sun'   },
      { t: '15', temp:  0, wx: 'sun'   },
      { t: '18', temp: -3, wx: 'cloud' },
      { t: '21', temp: -7, wx: 'snow'  },
    ],
  },
]

export const SURFACE_LABELS = [
  { threshold: 0.40, label: 'NH-310' },
  { threshold: 0.75, label: 'Jelep La rd.' },
  { threshold: 1.00, label: 'BRO snow' },
]

export function getSurface(progress) {
  if (progress < 0.40) return 'NH-310'
  if (progress < 0.75) return 'Jelep La rd.'
  return 'BRO snow'
}

export function getAltitude(progress) {
  return Math.round(ROUTE_START + (ROUTE_END - ROUTE_START) * progress)
}
