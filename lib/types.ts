export type EventId = '333' | '444' | '222' | '333oh' | 'pyram' | 'clock';
export type RecordType = 'single' | 'average' | 'ao12';

export interface CubingEvent {
  id: EventId;
  name: string;
}

export interface LeaderboardRecord {
  name: string;
  result: string;
  method: string;
  eventId: EventId;
  type: RecordType;
}

export interface LeaderboardPayload {
  events: CubingEvent[];
  records: LeaderboardRecord[];
}

