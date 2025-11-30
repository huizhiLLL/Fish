

export type EventId = '333' | '444' | '222' | '333oh' | 'pyram' | 'clock';
export type RecordType = 'single' | 'average' | 'ao12';
export type TimerType = 'stackmat' | 'keyboard';

export interface CubingEvent {
  id: EventId;
  name: string;
}

export interface PlayerRecord {
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
  { id: 'clock', name: 'clock' },
];

// Mock Data - In a real app, this could be fetched from an API
export const RECORDS: PlayerRecord[] = [
  // 3x3 Single
  { "name": "Cuber_魔鱼先生", "result": "3.98", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "ð", "result": "4.258", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "我咧个甜菜", "result": "5.07", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "fish.", "result": "5.3", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "虹门雨下", "result": "5.606", "method": "ROUX", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "风雨兼程", "result": "5.729", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "神说要有羽毛", "result": "6.533", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "c", "result": "6.703", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "半退魔", "result": "6.93", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "万顷茫然", "result": "6.967", "method": "ROUX", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "Cyanus", "result": "8.05", "method": "ROUX", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "Visionary", "result": "8.21", "method": "ROUX", "eventId": "333", "type": "single", "timerType": "keyboard" },
  { "name": "归墟", "result": "21.69", "method": "CFOP", "eventId": "333", "type": "single", "timerType": "keyboard" },

  // 3x3 Average
  { "name": "fish.", "result": "6.57", "method": "CFOP", "eventId": "333", "type": "average", "timerType": "keyboard" },
  { "name": "虹门雨下", "result": "7.727", "method": "ROUX", "eventId": "333", "type": "average", "timerType": "keyboard" },
  { "name": "落霞姐姐~", "result": "7.76", "method": "CFOP", "eventId": "333", "type": "average", "timerType": "keyboard" },
  { "name": "ð", "result": "8.189", "method": "CFOP", "eventId": "333", "type": "average", "timerType": "keyboard" },
  { "name": "半退魔", "result": "8.78", "method": "CFOP", "eventId": "333", "type": "average", "timerType": "keyboard" },
  { "name": "万顷茫然", "result": "9.275", "method": "ROUX", "eventId": "333", "type": "average", "timerType": "keyboard" },
  { "name": "Cyanus", "result": "9.51", "method": "ROUX", "eventId": "333", "type": "average", "timerType": "keyboard" },
  { "name": "Visionary", "result": "10.495", "method": "ROUX", "eventId": "333", "type": "average", "timerType": "keyboard" },
  { "name": "归墟", "result": "25.17", "method": "CFOP", "eventId": "333", "type": "average", "timerType": "keyboard" },

  // 3x3 OH Single
  { "name": "半退魔", "result": "7.6", "method": "CFOP", "eventId": "333oh", "type": "single", "timerType": "keyboard" },
  { "name": "万顷茫然", "result": "8.09", "method": "ROUX", "eventId": "333oh", "type": "single", "timerType": "keyboard" },
  { "name": "Cyanus", "result": "8.27", "method": "ROUX", "eventId": "333oh", "type": "single", "timerType": "keyboard" },
  { "name": "Visionary", "result": "8.343", "method": "ROUX", "eventId": "333oh", "type": "single", "timerType": "keyboard" },
  { "name": "虹门雨下", "result": "10.25", "method": "ROUX", "eventId": "333oh", "type": "single", "timerType": "keyboard" },
  { "name": "锤子", "result": "16.188", "method": "ROUX", "eventId": "333oh", "type": "single", "timerType": "keyboard" },

  // 3x3 OH Average
  { "name": "Cyannus", "result": "10.1", "method": "ROUX", "eventId": "333oh", "type": "average", "timerType": "keyboard" },
  { "name": "半退魔", "result": "10.16", "method": "CFOP", "eventId": "333oh", "type": "average", "timerType": "keyboard" },
  { "name": "万顷茫然", "result": "10.536", "method": "ROUX", "eventId": "333oh", "type": "average", "timerType": "keyboard" },
  { "name": "虹门雨下", "result": "11.6", "method": "ROUX", "eventId": "333oh", "type": "average", "timerType": "keyboard" },
  { "name": "Visionary", "result": "12.78", "method": "ROUX", "eventId": "333oh", "type": "average", "timerType": "keyboard" },
  { "name": "锤子", "result": "19.403", "method": "ROUX", "eventId": "333oh", "type": "average", "timerType": "keyboard" },

  // 2x2 Single
  { "name": "我咧个甜菜", "result": "0.731", "method": "CLL", "eventId": "222", "type": "single", "timerType": "keyboard" },
  { "name": "落霞姐姐~", "result": "1.23", "method": "CLL", "eventId": "222", "type": "single", "timerType": "keyboard" },
  { "name": "Visionary", "result": "1.259", "method": "CLL", "eventId": "222", "type": "single", "timerType": "keyboard" },
  { "name": "万顷茫然", "result": "1.344", "method": "CLL", "eventId": "222", "type": "single", "timerType": "keyboard" },

  // 2x2 Average
  { "name": "落霞姐姐~", "result": "1.82", "method": "CLL", "eventId": "222", "type": "average", "timerType": "keyboard" },
  { "name": "万顷茫然", "result": "2.254", "method": "CLL", "eventId": "222", "type": "average", "timerType": "keyboard" },
  { "name": "Visionary", "result": "2.529", "method": "CLL", "eventId": "222", "type": "average", "timerType": "keyboard" },

  // 4x4 Single
  { "name": "魔鱼先生", "result": "19.3", "method": "Yau", "eventId": "444", "type": "single", "timerType": "keyboard" },
  { "name": "落霞姐姐~", "result": "32.11", "method": "Yau", "eventId": "444", "type": "single", "timerType": "keyboard" },
  { "name": "会枝", "result": "33.43", "method": "Yau", "eventId": "444", "type": "single", "timerType": "keyboard" },
  { "name": "ð", "result": "40.505", "method": "Yau", "eventId": "444", "type": "single", "timerType": "keyboard" },
  { "name": "万顷茫然", "result": "142.099", "method": "基础降阶法", "eventId": "444", "type": "single", "timerType": "keyboard" },

  // 4x4 Average
  { "name": "落霞姐姐~", "result": "36", "method": "Yau", "eventId": "444", "type": "average", "timerType": "keyboard" },
  { "name": "会枝", "result": "40.792", "method": "Yau", "eventId": "444", "type": "average", "timerType": "keyboard" },
  { "name": "ð", "result": "54.683", "method": "Yau", "eventId": "444", "type": "average", "timerType": "keyboard" },

  // Clock Single
  { "name": "佳期如梦", "result": "2.4", "method": "未知", "eventId": "clock", "type": "single", "timerType": "keyboard" },

  // Clock Average
  { "name": "佳期如梦", "result": "3.31", "method": "未知", "eventId": "clock", "type": "average", "timerType": "keyboard" }
];
