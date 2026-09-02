"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronRight, Coffee, Dices, Info, Mail, Search, Sparkles } from "lucide-react";
import {
  buildPoints,
  daysBetween,
  normalizeNumber,
  PRIZE_TYPES,
  type HistoryData,
  type PrizeType,
  type ResultPoint,
} from "@/lib/history";

const PRIZE_LABELS: Record<PrizeType, string> = {
  "1": "1st prize",
  "2": "2nd prize",
  "3": "3rd prize",
  C: "Consolation",
  S: "Special",
};
const PRIZE_COLORS: Record<PrizeType, string> = {
  "1": "#b8860b",
  "2": "#64748b",
  "3": "#a85d20",
  C: "#7c3aed",
  S: "#07835d",
};
const SHAPES = ["Circle", "Square", "Diamond"];
const DAY_MS = 86_400_000;

type InputSource = "manual" | "slider" | "lucky" | "empty";

function getSessionId() {
  const key = "4d-results-session-id";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(key, value);
  }
  return value;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function randomUniqueNumbers() {
  const values = new Set<string>();
  while (values.size < 3) values.add(Math.floor(Math.random() * 10_000).toString().padStart(4, "0"));
  return [...values];
}

function Marker({ x, y, shape, color, prize, selected }: { x: number; y: number; shape: number; color: string; prize: PrizeType; selected: boolean }) {
  const common = { fill: color, stroke: selected ? "#111827" : "#ffffff", strokeWidth: selected ? 3 : 2 };
  return <g aria-hidden="true">
    {shape === 1 ? <rect x={x - 10} y={y - 10} width="20" height="20" rx="3" {...common} />
      : shape === 2 ? <path d={`M ${x} ${y - 13} L ${x + 13} ${y} L ${x} ${y + 13} L ${x - 13} ${y} Z`} {...common} />
      : <circle cx={x} cy={y} r="11" {...common} />}
    <text x={x} y={y} className="marker-code" textAnchor="middle" dominantBaseline="central">{prize}</text>
  </g>;
}

export function ResultsExplorer() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [inputs, setInputs] = useState(["", "", ""]);
  const [sources, setSources] = useState<InputSource[]>(["empty", "empty", "empty"]);
  const [selectedPrizes, setSelectedPrizes] = useState<Set<PrizeType>>(new Set(PRIZE_TYPES));
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedPoint, setSelectedPoint] = useState<ResultPoint | null>(null);
  const [showIntervals, setShowIntervals] = useState(true);
  const logTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLogged = useRef("");

  useEffect(() => {
    fetch("/data/magnum-history.json")
      .then((response) => {
        if (!response.ok) throw new Error("History unavailable");
        return response.json();
      })
      .then((history: HistoryData) => {
        setData(history);
        setFromDate(history.earliestResult);
        setToDate(history.updatedThrough);
      })
      .catch(() => setLoadError(true));
    return () => {
      if (logTimer.current) clearTimeout(logTimer.current);
    };
  }, []);

  const normalized = useMemo(() => inputs.map(normalizeNumber), [inputs]);
  const duplicateNumbers = normalized.filter((number): number is string => Boolean(number)).filter((number, index, all) => all.indexOf(number) !== index);
  const hasDuplicates = duplicateNumbers.length > 0;
  const selectedNumbers = useMemo(
    () => normalized.filter((number): number is string => Boolean(number)).filter((number, index, all) => all.indexOf(number) === index),
    [normalized],
  );

  const scheduleManualLog = (nextInputs: string[], nextSources: InputSource[]) => {
    if (logTimer.current) clearTimeout(logTimer.current);
    const manualNumbers = nextInputs
      .map((value, index) => (nextSources[index] === "manual" ? normalizeNumber(value) : null))
      .filter((value): value is string => Boolean(value));
    if (!manualNumbers.length || new Set(manualNumbers).size !== manualNumbers.length) return;
    const signature = manualNumbers.join(",");
    logTimer.current = setTimeout(() => {
      if (signature === lastLogged.current) return;
      lastLogged.current = signature;
      fetch("/api/searches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventId: crypto.randomUUID(),
          sessionId: getSessionId(),
          numbers: manualNumbers,
          language: "en",
        }),
        keepalive: true,
      }).catch(() => undefined);
    }, 750);
  };

  const updateManual = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, "").slice(0, 4);
    const nextInputs = inputs.map((item, itemIndex) => (itemIndex === index ? value : item));
    const nextSources = sources.map((item, itemIndex) => (itemIndex === index ? (value ? "manual" : "empty") : item));
    setInputs(nextInputs);
    setSources(nextSources);
    setSelectedPoint(null);
    if (value.length === 4) scheduleManualLog(nextInputs, nextSources);
  };

  const finishManual = (index: number) => {
    if (!inputs[index]) return;
    const padded = inputs[index].padStart(4, "0");
    const nextInputs = inputs.map((item, itemIndex) => (itemIndex === index ? padded : item));
    const nextSources = sources.map((item, itemIndex) => (itemIndex === index ? "manual" : item));
    setInputs(nextInputs);
    setSources(nextSources);
    scheduleManualLog(nextInputs, nextSources);
  };

  const handleSlider = (value: string) => {
    const nextInputs = [...inputs];
    const nextSources = [...sources];
    nextInputs[0] = Number(value).toString().padStart(4, "0");
    nextSources[0] = "slider";
    setInputs(nextInputs);
    setSources(nextSources);
    setSelectedPoint(null);
  };

  const feelLucky = () => {
    if (logTimer.current) clearTimeout(logTimer.current);
    setInputs(randomUniqueNumbers());
    setSources(["lucky", "lucky", "lucky"]);
    setSelectedPoint(null);
  };

  const togglePrize = (prize: PrizeType) => {
    setSelectedPrizes((current) => {
      const next = new Set(current);
      if (next.has(prize)) next.delete(prize);
      else next.add(prize);
      return next;
    });
    setSelectedPoint(null);
  };

  const points = useMemo(() => {
    if (!data || !fromDate || !toDate || hasDuplicates) return [];
    return buildPoints(data, selectedNumbers, selectedPrizes, fromDate, toDate);
  }, [data, selectedNumbers, selectedPrizes, fromDate, toDate, hasDuplicates]);

  const allSelectedPoints = useMemo(() => {
    if (!data || hasDuplicates) return [];
    return buildPoints(data, selectedNumbers, selectedPrizes, data.earliestResult, data.updatedThrough);
  }, [data, selectedNumbers, selectedPrizes, hasDuplicates]);

  const summaries = selectedNumbers.map((number) => {
    const numberPoints = allSelectedPoints.filter((point) => point.number === number);
    const last = numberPoints.at(-1) ?? null;
    return { number, count: numberPoints.length, last, daysAgo: last && data ? daysBetween(data.updatedThrough, last.date) : null };
  });

  const intervals = useMemo(
    () => [...points].filter((point) => point.daysSincePrevious !== null).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 18),
    [points],
  );


  const setPreset = (months: number | "all") => {
    if (!data) return;
    setToDate(data.updatedThrough);
    if (months === "all") setFromDate(data.earliestResult);
    else {
      const date = new Date(`${data.updatedThrough}T00:00:00Z`);
      date.setUTCMonth(date.getUTCMonth() - months);
      setFromDate(date.toISOString().slice(0, 10));
    }
    setSelectedPoint(null);
  };

  return (
    <main>
      <header className="site-header">
        <div className="brand"><span className="brand-mark">4D</span><span>Results</span></div>
        <a className="header-link" href="mailto:info@result4d.com.my"><Mail size={17} /> Feedback</a>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow"><Sparkles size={15} /> Magnum 4D history explorer</p>
          <h1>When did your number last win?</h1>
          <p className="hero-copy">Compare up to three numbers across more than 40 years of draw history.</p>
        </div>
        <div className="freshness"><CalendarDays size={18} /><span>Results updated through <strong>{data ? formatDate(data.updatedThrough) : "Loading…"}</strong></span></div>
      </section>

      <section className="shell controls-card" aria-labelledby="number-heading">
        <div className="section-heading">
          <div><span className="step">1</span><h2 id="number-heading">Choose your numbers</h2></div>
          <button className="lucky-button" type="button" onClick={feelLucky}><Dices size={19} /> Pick for me</button>
        </div>

        <div className="number-inputs">
          {inputs.map((value, index) => (
            <label key={index} className="number-field">
              <span>{index === 0 ? "Your number" : `Compare ${index + 1}`} {index > 0 && <em>optional</em>}</span>
              <div className="input-with-shape">
                <span className={`shape shape-${index}`} aria-label={SHAPES[index]} />
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder={index === 0 ? "e.g. 1688" : "0000"}
                  value={value}
                  onChange={(event) => updateManual(index, event.target.value)}
                  onBlur={() => finishManual(index)}
                  onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
                  aria-invalid={hasDuplicates && Boolean(normalized[index] && duplicateNumbers.includes(normalized[index]!))}
                />
              </div>
            </label>
          ))}
        </div>
        {hasDuplicates && <p className="error" role="alert">Each selected number must be unique.</p>}

        <label className="number-slider">
          <span>Or slide to choose your first number <strong>{normalized[0] ?? "0000"}</strong></span>
          <input type="range" min="0" max="9999" value={normalized[0] ? Number(normalized[0]) : 0} onChange={(event) => handleSlider(event.target.value)} />
        </label>

        <fieldset className="prize-filter">
          <legend className="sr-only">Prize types</legend>
          <div className="prize-options">
            {PRIZE_TYPES.map((prize) => (
              <label key={prize} className={selectedPrizes.has(prize) ? "active" : ""} style={{ "--prize": PRIZE_COLORS[prize] } as React.CSSProperties}>
                <input type="checkbox" checked={selectedPrizes.has(prize)} onChange={() => togglePrize(prize)} />
                <span className="color-dot" />{PRIZE_LABELS[prize]}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {loadError && <section className="shell status-card error">The history file could not be loaded. Please refresh and try again.</section>}
      {!loadError && !data && <section className="shell status-card">Loading draw history…</section>}
      {data && !selectedNumbers.length && (
        <section className="shell empty-state"><Search size={30} /><h2>Enter a number to begin</h2><p>Your timeline and last-result summary will appear here.</p></section>
      )}

      {data && selectedNumbers.length > 0 && !hasDuplicates && (
        <>
          <section className="shell chart-card" aria-labelledby="graph-heading">
            <h2 id="graph-heading" className="sr-only">Results graph</h2>
            <Timeline
              numbers={selectedNumbers}
              points={points}
              fromDate={fromDate}
              toDate={toDate}
              selectedPoint={selectedPoint}
              onSelect={setSelectedPoint}
            />
            {selectedPoint && (
              <div className="point-detail" role="status">
                <span className="detail-prize" style={{ background: PRIZE_COLORS[selectedPoint.prizeType] }}>{PRIZE_LABELS[selectedPoint.prizeType]}</span>
                <strong>{selectedPoint.number}</strong>
                <span>{formatDate(selectedPoint.date)} · Draw {selectedPoint.drawId}</span>
                <span>{selectedPoint.daysSincePrevious === null ? "First recorded appearance" : `${selectedPoint.daysSincePrevious.toLocaleString()} days since its previous appearance`}</span>
              </div>
            )}
            <div className="timeline-controls">
              <div className="timeline-control-heading"><strong>Result timeline</strong><span>{points.length.toLocaleString()} matching appearances</span></div>
              <DateControls setPreset={setPreset} />
            </div>
          </section>

          <section className="shell summary-section" aria-labelledby="summary-heading">
            <div className="section-title-row"><div><h2 id="summary-heading">Last result</h2></div><span className="muted">Across selected prize types</span></div>
            <div className="summary-grid">
              {summaries.map((summary, index) => (
                <article className="summary-card" key={summary.number}>
                  <div className="summary-number"><span className={`shape shape-${index}`} />{summary.number}</div>
                  {summary.last ? <>
                    <strong>{summary.daysAgo === 0 ? "Latest draw" : `${summary.daysAgo?.toLocaleString()} days ago`}</strong>
                    <span>{formatDate(summary.last.date)} · {PRIZE_LABELS[summary.last.prizeType]}</span>
                    <small>{summary.count.toLocaleString()} appearances in total</small>
                  </> : <><strong>No matching result</strong><span>Try another prize type.</span></>}
                </article>
              ))}
            </div>
          </section>

          <section className="shell intervals-card">
            <button type="button" className="interval-toggle" onClick={() => setShowIntervals((value) => !value)} aria-expanded={showIntervals}>
              <span><strong>Time between results</strong><small>Most recent intervals in the selected range</small></span><ChevronRight className={showIntervals ? "rotated" : ""} />
            </button>
            {showIntervals && (
              intervals.length ? <div className="interval-list">
                {intervals.map((point) => (
                  <button key={`${point.number}-${point.date}-${point.drawId}`} type="button" onClick={() => setSelectedPoint(point)}>
                    <span className="interval-number">{point.number}</span><span>{formatDate(point.date)}</span><strong>{point.daysSincePrevious?.toLocaleString()} days</strong>
                  </button>
                ))}
              </div> : <p className="muted interval-empty">No intervals are available in this date range.</p>
            )}
          </section>
        </>
      )}

      <section className="shell support-card">
        <div><Coffee size={23} /><span><strong>Enjoying 4D Results?</strong><small>Help us keep this service available to everyone.</small></span></div>
        <a href="/contribute">Contribute to keep this service free</a>
      </section>
      <footer className="shell"><span>4D Results · Historical information only</span><a href="mailto:info@result4d.com.my">Send feedback</a></footer>
    </main>
  );
}

function DateControls({ setPreset }: { setPreset: (value: number | "all") => void }) {
  return <div className="date-controls">
    <div className="presets">
      <button type="button" onClick={() => setPreset(6)}>6 months</button>
      <button type="button" onClick={() => setPreset(12)}>1 year</button>
      <button type="button" onClick={() => setPreset(24)}>2 years</button>
      <button type="button" onClick={() => setPreset(60)}>5 years</button>
      <button type="button" onClick={() => setPreset(120)}>10 years</button>
      <button type="button" onClick={() => setPreset("all")}>All</button>
    </div>
  </div>;
}

function Timeline({ numbers, points, fromDate, toDate, selectedPoint, onSelect }: { numbers: string[]; points: ResultPoint[]; fromDate: string; toDate: string; selectedPoint: ResultPoint | null; onSelect: (point: ResultPoint) => void }) {
  const width = 1000;
  const left = 86;
  const right = 28;
  const top = 34;
  const laneHeight = 90;
  const height = top + numbers.length * laneHeight + 50;
  const start = Date.parse(fromDate);
  const end = Date.parse(toDate);
  const span = Math.max(DAY_MS, end - start);
  const x = (date: string) => left + ((Date.parse(date) - start) / span) * (width - left - right);
  const ticks = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(start + (span * index) / 4).toISOString().slice(0, 10);
    return { date, x: left + ((width - left - right) * index) / 4 };
  });

  if (!points.length) return <div className="chart-empty"><Info size={20} />No matching results in this date range.</div>;
  return <div className="timeline-scroll"><svg className="timeline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Timeline of selected number results">
    {ticks.map((tick) => <g key={tick.date}><line x1={tick.x} x2={tick.x} y1={top - 8} y2={height - 38} className="grid-line" /><text x={tick.x} y={height - 13} textAnchor={tick.x === left ? "start" : tick.x > width - right - 2 ? "end" : "middle"} className="axis-text">{formatDate(tick.date)}</text></g>)}
    {numbers.map((number, index) => {
      const y = top + index * laneHeight + laneHeight / 2;
      const lanePoints = points.filter((point) => point.number === number);
      return <g key={number}><text x="12" y={y + 5} className="lane-label">{number}</text><line x1={left} x2={width - right} y1={y} y2={y} className="lane-line" />{lanePoints.length > 1 && <path d={lanePoints.map((point, pointIndex) => `${pointIndex ? "L" : "M"} ${x(point.date)} ${y}`).join(" ")} className="result-line" />}{lanePoints.map((point) => {
        const isSelected = selectedPoint?.number === point.number && selectedPoint.date === point.date && selectedPoint.drawId === point.drawId;
        return <g key={`${point.date}-${point.drawId}-${point.prizeType}`} className="point" tabIndex={0} role="button" aria-label={`${number}, ${PRIZE_LABELS[point.prizeType]}, ${formatDate(point.date)}`} onClick={() => onSelect(point)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(point); }}><Marker x={x(point.date)} y={y} shape={index} color={PRIZE_COLORS[point.prizeType]} prize={point.prizeType} selected={isSelected} /><title>{`${number} · ${PRIZE_LABELS[point.prizeType]} · ${formatDate(point.date)}${point.daysSincePrevious ? ` · ${point.daysSincePrevious} days since previous` : ""}`}</title></g>;
      })}</g>;
    })}
  </svg></div>;
}
