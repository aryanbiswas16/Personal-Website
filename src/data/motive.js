// A snapshot of Motive's demo seed (motive/src/data/mock.ts): real Toronto venues, with titles
// from the app's activity pools. `people` drives the crowd heat; `live` gets a pulsing ring.
export const motiveStyle = 'mapbox://styles/aryanbiswas16/cmpx615n8002t01s0h4h71e68'

// Pin colours by activity type, from the app's typeColor map.
export const typeColor = {
  hangout: '#D0D6E0',
  party: '#B2A8FF',
  sports: '#6F7CF6',
  food: '#F5C451',
  music: '#9EA4FF',
  outdoors: '#58C896',
  game: '#8D8CFF',
}

export const motives = [
  { title: 'Warehouse set', place: 'The Drake Underground', lng: -79.4247, lat: 43.6432, type: 'party', people: 34, live: true },
  { title: 'Volleyball at the park', place: 'Trinity Bellwoods Park', lng: -79.413, lat: 43.6475, type: 'sports', people: 18, live: true },
  { title: 'Night market walk', place: 'Kensington Market', lng: -79.4002, lat: 43.6547, type: 'hangout', people: 26, live: true },
  { title: 'Sunset at the pier', place: 'Harbourfront Centre', lng: -79.3832, lat: 43.6389, type: 'outdoors', people: 12, live: false },
  { title: 'Pop-up dinner', place: 'Stackt Market', lng: -79.4022, lat: 43.6409, type: 'food', people: 15, live: true },
  { title: 'Patio crawl', place: 'King West patio row', lng: -79.3982, lat: 43.6446, type: 'hangout', people: 40, live: true },
  { title: 'Late-night ramen', place: 'TIFF Lightbox', lng: -79.3907, lat: 43.6465, type: 'food', people: 9, live: false },
  { title: 'DJ set', place: 'The Great Hall', lng: -79.4256, lat: 43.6421, type: 'music', people: 22, live: false },
  { title: 'Skate session', place: 'Nathan Phillips Square', lng: -79.3835, lat: 43.6525, type: 'outdoors', people: 14, live: true },
  { title: 'Jazz basement set', place: 'The Rex', lng: -79.3888, lat: 43.6507, type: 'music', people: 28, live: true },
  { title: 'Market lunch', place: 'St. Lawrence Market', lng: -79.3716, lat: 43.6487, type: 'food', people: 17, live: false },
  { title: 'Gallery walk', place: 'Distillery District', lng: -79.3596, lat: 43.6503, type: 'hangout', people: 11, live: false },
  { title: 'Karaoke room', place: 'Yonge-Dundas Square', lng: -79.3802, lat: 43.6561, type: 'music', people: 19, live: true },
  { title: 'Pool tables', place: 'Ossington strip', lng: -79.42, lat: 43.6488, type: 'game', people: 13, live: true },
  { title: 'Run club 5k', place: 'Union Station', lng: -79.3806, lat: 43.6453, type: 'sports', people: 21, live: false },
  { title: 'Smash bracket', place: 'Graffiti Alley', lng: -79.3975, lat: 43.6483, type: 'game', people: 16, live: true },
  { title: 'Picnic', place: 'Grange Park', lng: -79.3924, lat: 43.6531, type: 'outdoors', people: 8, live: false },
  { title: 'Waterfront walk', place: 'Sugar Beach', lng: -79.363, lat: 43.644, type: 'outdoors', people: 10, live: false },
]

// The app's heading, tilted further and pulled back a little so downtown fits a project card.
export const motiveCamera = { center: [-79.3935, 43.6462], zoom: 14.15, pitch: 60, bearing: -18 }
