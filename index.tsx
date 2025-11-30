
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { EVENTS, RECORDS, EventId, RecordType, TimerType } from './data';
import './styles.css';

type ViewMode = 'leaderboard' | 'gr';

const App = () => {
  const [view, setView] = useState<ViewMode>('leaderboard');
  const [activeEvent, setActiveEvent] = useState<EventId>('333');
  const [resultType, setResultType] = useState<RecordType>('single');
  const [timerType, setTimerType] = useState<TimerType>('stackmat');

  // Filter for Leaderboard View
  const leaderboardRecords = useMemo(() => {
    return RECORDS.filter(
      (r) => r.eventId === activeEvent && r.type === resultType && r.timerType === timerType
    ).sort((a, b) => a.rank - b.rank);
  }, [activeEvent, resultType, timerType]);

  // Data for Group Records View
  const groupRecords = useMemo(() => {
    return EVENTS.map(evt => {
      // Find the rank 1 record for this event/type/timer
      const record = RECORDS.find(
        r => r.eventId === evt.id && r.type === resultType && r.timerType === timerType && r.rank === 1
      );
      return { event: evt, record };
    });
  }, [resultType, timerType]);

  const activeEventName = EVENTS.find(e => e.id === activeEvent)?.name;

  const toggleView = () => {
    setView(prev => prev === 'leaderboard' ? 'gr' : 'leaderboard');
  };

  return (
    <div className="container">
      {/* View Switcher Button (Top Left) */}
      <button 
        className="view-switch-btn" 
        onClick={toggleView}
        aria-label="Toggle View"
      >
        {view === 'leaderboard' ? 'GR' : '榜'}
      </button>

      <header>
        <h1>{view === 'leaderboard' ? "🐟️'s Leaderboard" : "🐟️'s Group Records"}</h1>
        <div className="subtitle">Practice Best</div>
      </header>

      {view === 'leaderboard' && (
        <>
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
        </>
      )}

      <div className="filters-row">
        {/* Single vs Average Toggle */}
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <button
              className={`toggle-btn ${resultType === 'single' ? 'selected' : ''}`}
              onClick={() => setResultType('single')}
            >
              单次
            </button>
            <button
              className={`toggle-btn ${resultType === 'average' ? 'selected' : ''}`}
              onClick={() => setResultType('average')}
            >
              平均
            </button>
          </div>
        </div>

        {/* Stackmat vs Keyboard Toggle */}
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <button
              className={`toggle-btn ${timerType === 'stackmat' ? 'selected' : ''}`}
              onClick={() => setTimerType('stackmat')}
            >
              拍
            </button>
            <button
              className={`toggle-btn ${timerType === 'keyboard' ? 'selected' : ''}`}
              onClick={() => setTimerType('keyboard')}
            >
              点
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="leaderboard-card">
        
        {view === 'leaderboard' ? (
          /* LEADERBOARD TABLE */
          <>
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
                    <div className="col-rank">{record.rank}</div>
                    <div className="col-name">{record.name}</div>
                    <div className="col-method">{record.method}</div>
                    <div className="col-result">{record.result}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  No {timerType === 'stackmat' ? 'Stackmat' : 'Keyboard'} records found for {activeEventName} ({resultType === 'single' ? 'Single' : 'Average'}).
                </div>
              )}
            </div>
          </>
        ) : (
          /* GROUP RECORDS TABLE */
          <>
            <div className="table-header">
              <div className="col-event">Event</div>
              <div className="col-name">Competitor</div>
              <div className="col-method">Method</div>
              <div className="col-result">Result</div>
            </div>

            <div className="table-body">
              {groupRecords.map(({ event, record }) => (
                <div className="table-row" key={event.id}>
                  <div className="col-event">{event.name}</div>
                  <div className="col-name">
                    {record ? record.name : <span className="text-muted">-</span>}
                  </div>
                  <div className="col-method">
                    {record ? record.method : '-'}
                  </div>
                  <div className="col-result">
                    {record ? record.result : '-'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
