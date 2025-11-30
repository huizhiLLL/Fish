
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { EVENTS, RECORDS, EventId, RecordType } from './data';
import './styles.css';

// Helper to parse WCA result strings (e.g. "1:05.22", "3.13", "DNF") to a number for sorting
const parseResult = (result: string): number => {
  if (!result) return Infinity;
  const upper = result.toUpperCase();
  if (upper === 'DNF' || upper === 'DNS') return Infinity;
  
  const parts = result.split(':');
  if (parts.length === 2) {
    // mm:ss.qq
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  // ss.qq
  return parseFloat(result);
};

// Helper to format time for display (e.g. 142.099 -> 2:22.099)
const formatTimeDisplay = (result: string): string => {
  if (!result) return '';
  const upper = result.toUpperCase();
  if (upper === 'DNF' || upper === 'DNS') return upper;
  
  // If already formatted with colon, return as is
  if (result.includes(':')) return result;

  const val = parseFloat(result);
  if (isNaN(val)) return result;

  if (val >= 60) {
    const minutes = Math.floor(val / 60);
    const remainder = val % 60;
    
    // Determine precision from original string
    const parts = result.split('.');
    const precision = parts.length > 1 ? parts[1].length : 2;
    
    let secondsStr = remainder.toFixed(precision);
    
    // Add leading zero to seconds if less than 10 (e.g. 2:05.22)
    if (remainder < 10) {
      secondsStr = '0' + secondsStr;
    }
    
    return `${minutes}:${secondsStr}`;
  }
  
  return result;
};

const App = () => {
  const [activeEvent, setActiveEvent] = useState<EventId>('333');
  const [resultType, setResultType] = useState<RecordType>('single');

  // Filter for Leaderboard View and Sort dynamically by Result
  const leaderboardRecords = useMemo(() => {
    return RECORDS
      .filter((r) => r.eventId === activeEvent && r.type === resultType)
      .sort((a, b) => parseResult(a.result) - parseResult(b.result));
  }, [activeEvent, resultType]);

  const activeEventName = EVENTS.find(e => e.id === activeEvent)?.name;

  const getResultTypeLabel = (type: RecordType) => {
    switch (type) {
      case 'single': return 'Single';
      case 'average': return 'Average';
      case 'ao12': return 'AO12';
      default: return type;
    }
  };

  return (
    <div className="container">
      {/* GitHub Link (Top Right) */}
      <a 
        href="https://github.com/huizhiLLL/Fish" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="github-link"
        aria-label="GitHub Repository"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>

      <header>
        <h1>🐟️'s Leaderboard</h1>
        <div className="subtitle">Practice Best</div>
      </header>

      {/* Event Selection Tabs */}
      <div className="tabs-container">
        {EVENTS.map((evt) => (
          <button
            key={evt.id}
            className={`tab-button ${activeEvent === evt.id ? 'active' : ''}`}
            onClick={() => setActiveEvent(evt.id)}
            aria-label={`Select event ${evt.name}`}
          >
            {evt.name}
          </button>
        ))}
      </div>

      <div className="filters-row">
        {/* Result Type Toggle */}
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

      {/* Content Area */}
      <div className="leaderboard-card">
        <div className="table-header">
          <div className="col-rank">#</div>
          <div className="col-name">Competitor</div>
          <div className="col-method">Method</div>
          <div className="col-result">Result</div>
        </div>

        <div className="table-body">
          {leaderboardRecords.length > 0 ? (
            leaderboardRecords.map((record, index) => (
              <div className="table-row" key={`${record.eventId}-${record.type}-${index}`}>
                <div className="col-rank">{index + 1}</div>
                <div className="col-name">{record.name}</div>
                <div className="col-method">{record.method}</div>
                <div className="col-result">{formatTimeDisplay(record.result)}</div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              No records found for {activeEventName} ({getResultTypeLabel(resultType)}).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
