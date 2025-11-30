
export type EventId = '333' | '444' | '222' | '333oh' | 'pyram';
export type RecordType = 'single' | 'average';
export type TimerType = 'stackmat' | 'keyboard';

export interface CubingEvent {
  id: EventId;
  name: string;
}

export interface PlayerRecord {
  rank: number;
  name: string;
  result: string;
  method: string;
  eventId: EventId;
  type: RecordType;
  timerType: TimerType;
}

export const EVENTS: CubingEvent[] = [
  { id: '333', name: '3x3x3' },
  { id: '222', name: '2x2x2' },
  { id: '444', name: '4x4x4' },
  { id: '333oh', name: '3x3x3 OH' },
  { id: 'pyram', name: 'Pyraminx' },
];

// Mock Data - In a real app, this could be fetched from an API
export const RECORDS: PlayerRecord[] = [
  // 3x3 Single - Stackmat
  { rank: 1, name: 'vv', result: '3.13', method: 'CFOP', eventId: '333', type: 'single', timerType: 'stackmat' },
  { rank: 2, name: '万顷茫然', result: '3.13', method: 'CFOP', eventId: '333', type: 'single', timerType: 'stackmat' },
  
  // 3x3 Single - Keyboard
  { rank: 1, name: 'Keyboard Warrior', result: '2.95', method: 'CFOP', eventId: '333', type: 'single', timerType: 'keyboard' },
  { rank: 2, name: 'Spacebar User', result: '3.05', method: 'Roux', eventId: '333', type: 'single', timerType: 'keyboard' },

  // 3x3 Average - Stackmat
  { rank: 1, name: 'Yiheng Wang', result: '4.25', method: 'CFOP', eventId: '333', type: 'average', timerType: 'stackmat' },
  { rank: 2, name: 'Tymon Kolasiński', result: '4.86', method: 'CFOP', eventId: '333', type: 'average', timerType: 'stackmat' },
  { rank: 3, name: 'Max Park', result: '5.02', method: 'CFOP', eventId: '333', type: 'average', timerType: 'stackmat' },

  // 3x3 Average - Keyboard
  { rank: 1, name: 'Virtual Cuber', result: '4.10', method: 'CFOP', eventId: '333', type: 'average', timerType: 'keyboard' },

  // 2x2 Single - Stackmat
  { rank: 1, name: 'Teodor Zajder', result: '0.43', method: 'CLL', eventId: '222', type: 'single', timerType: 'stackmat' },
  { rank: 2, name: 'Guanbo Wang', result: '0.47', method: 'EG', eventId: '222', type: 'single', timerType: 'stackmat' },
  
  // 2x2 Average - Stackmat
  { rank: 1, name: 'Yiheng Wang', result: '0.78', method: 'EG', eventId: '222', type: 'average', timerType: 'stackmat' },
  { rank: 2, name: 'Zayn Khanadi', result: '1.01', method: 'CLL', eventId: '222', type: 'average', timerType: 'stackmat' },

  // 4x4 Single - Stackmat
  { rank: 1, name: 'Max Park', result: '15.71', method: 'Yau', eventId: '444', type: 'single', timerType: 'stackmat' },
  
  // 4x4 Single - Keyboard
  { rank: 1, name: 'Simulated 4x4', result: '14.50', method: 'Yau', eventId: '444', type: 'single', timerType: 'keyboard' },

  // 4x4 Average - Stackmat
  { rank: 1, name: 'Max Park', result: '19.38', method: 'Yau', eventId: '444', type: 'average', timerType: 'stackmat' },
  { rank: 2, name: 'Sebastian Weyer', result: '21.45', method: 'Yau', eventId: '444', type: 'average', timerType: 'stackmat' },

  // 3x3 OH Single - Stackmat
  { rank: 1, name: 'Dhruva Bhatia', result: '5.73', method: 'CFOP', eventId: '333oh', type: 'single', timerType: 'stackmat' },
  
  // 3x3 OH Average - Stackmat
  { rank: 1, name: 'Sean Patrick Villanueva', result: '8.09', method: 'Roux', eventId: '333oh', type: 'average', timerType: 'stackmat' },
];
