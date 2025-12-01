'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  CubingEvent,
  EventId,
  LeaderboardPayload,
  LeaderboardRecord,
  RecordType,
} from '@/lib/types';

const parseResult = (result: string): number => {
  if (!result) return Number.POSITIVE_INFINITY;
  const upper = result.toUpperCase();
  if (upper === 'DNF' || upper === 'DNS') return Number.POSITIVE_INFINITY;

  const parts = result.split(':');
  if (parts.length === 2) {
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(result);
};

const formatTimeDisplay = (result: string): string => {
  if (!result) return '';
  const upper = result.toUpperCase();
  if (upper === 'DNF' || upper === 'DNS') return upper;
  if (result.includes(':')) return result;

  const val = parseFloat(result);
  if (Number.isNaN(val)) return result;

  if (val >= 60) {
    const minutes = Math.floor(val / 60);
    const remainder = val % 60;
    const parts = result.split('.');
    const precision = parts.length > 1 ? parts[1].length : 2;
    let secondsStr = remainder.toFixed(precision);

    if (remainder < 10) {
      secondsStr = '0' + secondsStr;
    }

    return `${minutes}:${secondsStr}`;
  }

  return result;
};

export default function HomePage() {
  const [events, setEvents] = useState<CubingEvent[]>([]);
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventId>('333');
  const [resultType, setResultType] = useState<RecordType>('single');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchLeaderboard() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch('/api/records');
        if (!response.ok) {
          throw new Error('无法获取排行榜数据');
        }

        const payload = (await response.json()) as LeaderboardPayload;
        if (!isMounted) return;

        setEvents(payload.events);
        setRecords(payload.records);
        setActiveEvent((prev) => {
          if (prev && payload.events.some((evt) => evt.id === prev)) {
            return prev;
          }
          return payload.events[0]?.id ?? prev ?? '333';
        });
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setErrorMessage('加载数据失败，请稍后重试。');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const leaderboardRecords = useMemo(() => {
    return records
      .filter((record) => record.eventId === activeEvent && record.type === resultType)
      .sort((a, b) => parseResult(a.result) - parseResult(b.result));
  }, [records, activeEvent, resultType]);

  const activeEventName = events.find((event) => event.id === activeEvent)?.name;

  const getResultTypeLabel = (type: RecordType) => {
    if (type === 'single') return 'Single';
    if (type === 'average') return 'Average';
    if (type === 'ao12') return 'AO12';
    return type;
  };

  return (
    <div className="container">
      <a
        href="https://github.com/huizhiLLL/Fish"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        aria-label="GitHub Repository"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </a>

      <header>
        <h1>🐟️&apos;s Leaderboard</h1>
        <div className="subtitle">Practice Best</div>
      </header>

      <div className="tabs-container">
        {events.map((event) => (
          <button
            key={event.id}
            className={`tab-button ${activeEvent === event.id ? 'active' : ''}`}
            onClick={() => setActiveEvent(event.id)}
            aria-label={`Select event ${event.name}`}
          >
            {event.name}
          </button>
        ))}
      </div>

      <div className="filters-row">
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <button
              className={`toggle-btn ${resultType === 'single' ? 'selected' : ''}`}
              onClick={() => setResultType('single')}
            >
              Single
            </button>
            <button
              className={`toggle-btn ${resultType === 'average' ? 'selected' : ''}`}
              onClick={() => setResultType('average')}
            >
              Ao5
            </button>
            <button
              className={`toggle-btn ${resultType === 'ao12' ? 'selected' : ''}`}
              onClick={() => setResultType('ao12')}
            >
              AO12
            </button>
          </div>
        </div>
      </div>

      <div className="leaderboard-card">
        <div className="table-header">
          <div className="col-rank">#</div>
          <div className="col-name">Competitor</div>
          <div className="col-method">Method</div>
          <div className="col-result">Result</div>
        </div>

        <div className="table-body">
          {isLoading && <div className="empty-state">加载中...</div>}
          {!isLoading && errorMessage && <div className="empty-state">{errorMessage}</div>}
          {!isLoading && !errorMessage && leaderboardRecords.length === 0 && (
            <div className="empty-state">
              当前没有 {activeEventName} - {getResultTypeLabel(resultType)} 的成绩。
            </div>
          )}
          {!isLoading &&
            !errorMessage &&
            leaderboardRecords.map((record, index) => (
              <div className="table-row" key={`${record.eventId}-${record.type}-${record.name}-${index}`}>
                <div className="col-rank">{index + 1}</div>
                <div className="col-name">{record.name}</div>
                <div className="col-method">{record.method}</div>
                <div className="col-result">{formatTimeDisplay(record.result)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

