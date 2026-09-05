"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Check, ChevronRight, Coffee, Dices, Info, Mail, Search, Share2, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LANGUAGE_OPTIONS, type Language, type Translation } from "@/lib/i18n";
import { pickDefaultNumber } from "@/lib/defaultNumbers";
import { makeLuckyUrl, parseLuckyNumbers } from "@/lib/sharedNumbers";
import {
  buildPoints,
  daysBetween,
  normalizeNumber,
  PRIZE_TYPES,
  type HistoryData,
  type PrizeType,
  type ResultPoint,
} from "@/lib/history";

const PRIZE_COLORS: Record<PrizeType, string> = {
  "1": "#b8860b",
  "2": "#64748b",
  "3": "#a85d20",
  C: "#7c3aed",
  S: "#07835d",
};
const DAY_MS = 86_400_000;

type InputSource = "manual" | "slider" | "lucky" | "url" | "empty";

function getSessionId() {
  const key = "4d-results-session-id";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(key, value);
  }
  return value;
}

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(language, { day: "numeric", month: "short", year: "numeric" }).format(
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
  const { language, setLanguage, t } = useLanguage();
  const [data, setData] = useState<HistoryData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [inputs, setInputs] = useState(["", "", ""]);
  const [sources, setSources] = useState<InputSource[]>(["empty", "empty", "empty"]);
  const [selectedPrizes, setSelectedPrizes] = useState<Set<PrizeType>>(new Set(PRIZE_TYPES));
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedPoint, setSelectedPoint] = useState<ResultPoint | null>(null);
  const [showIntervals, setShowIntervals] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
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

  useEffect(() => {
    const luckyParameter = new URLSearchParams(window.location.search).get("lucky");
    const numbers = parseLuckyNumbers(luckyParameter);
    if (numbers.length) {
      const nextInputs = [...numbers, "", ""].slice(0, 3);
      const nextSources = nextInputs.map((number) => (number ? "url" : "empty")) as InputSource[];
      setInputs(nextInputs);
      setSources(nextSources);
      scheduleSearchLog(nextInputs, nextSources);
    } else if (luckyParameter === null) {
      setInputs([pickDefaultNumber(), "", ""]);
      setSources(["lucky", "empty", "empty"]);
    }
  // The initial URL is deliberately applied once per page load.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalized = useMemo(() => inputs.map(normalizeNumber), [inputs]);
  const duplicateNumbers = normalized.filter((number): number is string => Boolean(number)).filter((number, index, all) => all.indexOf(number) !== index);
  const hasDuplicates = duplicateNumbers.length > 0;
  const selectedNumbers = useMemo(
    () => normalized.filter((number): number is string => Boolean(number)).filter((number, index, all) => all.indexOf(number) === index),
    [normalized],
  );

  const scheduleSearchLog = (nextInputs: string[], nextSources: InputSource[]) => {
    if (logTimer.current) clearTimeout(logTimer.current);
    const loggedNumbers = nextInputs
      .map((value, index) => (["manual", "url"] as InputSource[]).includes(nextSources[index]) ? normalizeNumber(value) : null)
      .filter((value): value is string => Boolean(value));
    if (!loggedNumbers.length || new Set(loggedNumbers).size !== loggedNumbers.length) return;
    const signature = loggedNumbers.join(",");
    logTimer.current = setTimeout(() => {
      if (signature === lastLogged.current) return;
      lastLogged.current = signature;
      fetch("/api/searches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventId: crypto.randomUUID(),
          sessionId: getSessionId(),
          numbers: loggedNumbers,
          language,
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
    if (value.length === 4) scheduleSearchLog(nextInputs, nextSources);
  };

  const finishManual = (index: number) => {
    if (!inputs[index]) return;
    const padded = inputs[index].padStart(4, "0");
    const nextInputs = inputs.map((item, itemIndex) => (itemIndex === index ? padded : item));
    const nextSources = sources.map((item, itemIndex) => (itemIndex === index ? "manual" : item));
    setInputs(nextInputs);
    setSources(nextSources);
    scheduleSearchLog(nextInputs, nextSources);
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

  const shareResults = async () => {
    if (!selectedNumbers.length || hasDuplicates) return;
    const url = makeLuckyUrl(window.location.origin, window.location.pathname, selectedNumbers);
    const shareData = { title: t.shareTitle, text: t.shareText, url };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        window.setTimeout(() => setShareCopied(false), 2_500);
      }
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        await navigator.clipboard.writeText(url).catch(() => undefined);
        setShareCopied(true);
        window.setTimeout(() => setShareCopied(false), 2_500);
      }
    }
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
        <div className="header-actions"><label className="language-picker"><span className="sr-only">{t.language}</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t.language}>{LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><a className="header-link" href="mailto:info@result4d.com.my"><Mail size={17} /> {t.feedback}</a></div>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow"><Sparkles size={15} /> {t.eyebrow}</p>
          <h1>{t.headline}</h1>
          <p className="hero-copy">{t.heroCopy}</p>
        </div>
        <div className="freshness"><CalendarDays size={18} /><span>{t.updatedThrough} <strong>{data ? formatDate(data.updatedThrough, language) : t.loading}</strong></span></div>
      </section>

      <section className="shell controls-card" aria-labelledby="number-heading">
        <div className="section-heading">
          <div><span className="step">1</span><h2 id="number-heading">{t.chooseNumbers}</h2></div>
          <div className="number-actions"><button className="share-button" type="button" onClick={shareResults} disabled={!selectedNumbers.length || hasDuplicates}>{shareCopied ? <Check size={19} /> : <Share2 size={19} />} {shareCopied ? t.linkCopied : t.shareResults}</button><button className="lucky-button" type="button" onClick={feelLucky}><Dices size={19} /> {t.pickForMe}</button></div>
        </div>

        <div className="number-inputs">
          {inputs.map((value, index) => (
            <label key={index} className="number-field">
              <span>{index === 0 ? t.yourNumber : `${t.compare} ${index + 1}`} {index > 0 && <em>{t.optional}</em>}</span>
              <div className="input-with-shape">
                <span className={`shape shape-${index}`} aria-hidden="true" />
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
        {hasDuplicates && <p className="error" role="alert">{t.uniqueError}</p>}

        <label className="number-slider">
          <span>{t.slideNumber} <strong>{normalized[0] ?? "0000"}</strong></span>
          <input type="range" min="0" max="9999" value={normalized[0] ? Number(normalized[0]) : 0} onChange={(event) => handleSlider(event.target.value)} aria-label={t.slideNumber} />
        </label>

        <fieldset className="prize-filter">
          <legend className="sr-only">{t.prizeTypes}</legend>
          <div className="prize-options">
            {PRIZE_TYPES.map((prize) => (
              <label key={prize} className={selectedPrizes.has(prize) ? "active" : ""} style={{ "--prize": PRIZE_COLORS[prize] } as React.CSSProperties}>
                <input type="checkbox" checked={selectedPrizes.has(prize)} onChange={() => togglePrize(prize)} />
                <span className="color-dot" />{t.prizes[prize]}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {loadError && <section className="shell status-card error">{t.loadError}</section>}
      {!loadError && !data && <section className="shell status-card">{t.loading}</section>}
      {data && !selectedNumbers.length && (
        <section className="shell empty-state"><Search size={30} /><h2>{t.enterNumber}</h2><p>{t.emptyCopy}</p></section>
      )}

      {data && selectedNumbers.length > 0 && !hasDuplicates && (
        <>
          <section className="shell chart-card" aria-labelledby="graph-heading">
            <h2 id="graph-heading" className="sr-only">{t.resultsGraph}</h2>
            <Timeline
              numbers={selectedNumbers}
              points={points}
              fromDate={fromDate}
              toDate={toDate}
              language={language}
              t={t}
              selectedPoint={selectedPoint}
              onSelect={setSelectedPoint}
            />
            {selectedPoint && (
              <div className="point-detail" role="status">
                <span className="detail-prize" style={{ background: PRIZE_COLORS[selectedPoint.prizeType] }}>{t.prizes[selectedPoint.prizeType]}</span>
                <strong>{selectedPoint.number}</strong>
                <span>{formatDate(selectedPoint.date, language)} · {t.draw} {selectedPoint.drawId}</span>
                <span>{selectedPoint.daysSincePrevious === null ? t.firstRecorded : `${selectedPoint.daysSincePrevious.toLocaleString(language)} ${t.daysSincePrevious}`}</span>
              </div>
            )}
            <div className="timeline-controls">
              <div className="timeline-control-heading"><strong>{t.resultTimeline}</strong><span>{points.length.toLocaleString(language)} {t.matchingAppearances}</span></div>
              <DateControls setPreset={setPreset} t={t} />
            </div>
          </section>

          <section className="shell summary-section" aria-labelledby="summary-heading">
            <div className="section-title-row"><div><h2 id="summary-heading">{t.lastResult}</h2></div><span className="muted">{t.acrossPrizes}</span></div>
            <div className="summary-grid">
              {summaries.map((summary, index) => (
                <article className="summary-card" key={summary.number}>
                  <div className="summary-number"><span className={`shape shape-${index}`} />{summary.number}</div>
                  {summary.last ? <>
                    <strong>{summary.daysAgo === 0 ? t.latestDraw : `${summary.daysAgo?.toLocaleString(language)} ${t.daysAgo}`}</strong>
                    <span>{formatDate(summary.last.date, language)} · {t.prizes[summary.last.prizeType]}</span>
                    <small>{summary.count.toLocaleString(language)} {t.appearancesTotal}</small>
                  </> : <><strong>{t.noMatching}</strong><span>{t.tryPrize}</span></>}
                </article>
              ))}
            </div>
          </section>

          <section className="shell intervals-card">
            <button type="button" className="interval-toggle" onClick={() => setShowIntervals((value) => !value)} aria-expanded={showIntervals}>
              <span><strong>{t.timeBetween}</strong><small>{t.recentIntervals}</small></span><ChevronRight className={showIntervals ? "rotated" : ""} />
            </button>
            {showIntervals && (
              intervals.length ? <div className="interval-list">
                {intervals.map((point) => (
                  <button key={`${point.number}-${point.date}-${point.drawId}`} type="button" onClick={() => setSelectedPoint(point)}>
                    <span className="interval-number">{point.number}</span><span>{formatDate(point.date, language)}</span><strong>{point.daysSincePrevious?.toLocaleString(language)} {t.days}</strong>
                  </button>
                ))}
              </div> : <p className="muted interval-empty">{t.noIntervals}</p>
            )}
          </section>
        </>
      )}

      <section className="shell support-card">
        <div><Coffee size={23} /><span><strong>{t.enjoying}</strong><small>{t.supportCopy}</small></span></div>
        <a href="/contribute">{t.contribute}</a>
      </section>
      <footer className="shell"><span>4D Results · {t.historicalOnly}</span><span className="footer-links"><a href="/privacy">{t.privacyLink}</a><a href="mailto:info@result4d.com.my">{t.sendFeedback}</a></span></footer>
    </main>
  );
}

function DateControls({ setPreset, t }: { setPreset: (value: number | "all") => void; t: Translation }) {
  return <div className="date-controls">
    <div className="presets">
      <button type="button" onClick={() => setPreset(6)}>{t.sixMonths}</button>
      <button type="button" onClick={() => setPreset(12)}>{t.oneYear}</button>
      <button type="button" onClick={() => setPreset(24)}>{t.twoYears}</button>
      <button type="button" onClick={() => setPreset(60)}>{t.fiveYears}</button>
      <button type="button" onClick={() => setPreset(120)}>{t.tenYears}</button>
      <button type="button" onClick={() => setPreset("all")}>{t.all}</button>
    </div>
  </div>;
}

function Timeline({ numbers, points, fromDate, toDate, language, t, selectedPoint, onSelect }: { numbers: string[]; points: ResultPoint[]; fromDate: string; toDate: string; language: Language; t: Translation; selectedPoint: ResultPoint | null; onSelect: (point: ResultPoint) => void }) {
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

  if (!points.length) return <div className="chart-empty"><Info size={20} />{t.noGraphResults}</div>;
  return <div className="timeline-scroll"><svg className="timeline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t.graphAria}>
    {ticks.map((tick) => <g key={tick.date}><line x1={tick.x} x2={tick.x} y1={top - 8} y2={height - 38} className="grid-line" /><text x={tick.x} y={height - 13} textAnchor={tick.x === left ? "start" : tick.x > width - right - 2 ? "end" : "middle"} className="axis-text">{formatDate(tick.date, language)}</text></g>)}
    {numbers.map((number, index) => {
      const y = top + index * laneHeight + laneHeight / 2;
      const lanePoints = points.filter((point) => point.number === number);
      return <g key={number}><text x="12" y={y + 5} className="lane-label">{number}</text><line x1={left} x2={width - right} y1={y} y2={y} className="lane-line" />{lanePoints.length > 1 && <path d={lanePoints.map((point, pointIndex) => `${pointIndex ? "L" : "M"} ${x(point.date)} ${y}`).join(" ")} className="result-line" />}{lanePoints.map((point) => {
        const isSelected = selectedPoint?.number === point.number && selectedPoint.date === point.date && selectedPoint.drawId === point.drawId;
        return <g key={`${point.date}-${point.drawId}-${point.prizeType}`} className="point" tabIndex={0} role="button" aria-label={`${number}, ${t.prizes[point.prizeType]}, ${formatDate(point.date, language)}`} onClick={() => onSelect(point)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(point); }}><Marker x={x(point.date)} y={y} shape={index} color={PRIZE_COLORS[point.prizeType]} prize={point.prizeType} selected={isSelected} /><title>{`${number} · ${t.prizes[point.prizeType]} · ${formatDate(point.date, language)}${point.daysSincePrevious ? ` · ${point.daysSincePrevious} ${t.daysSincePrevious}` : ""}`}</title></g>;
      })}</g>;
    })}
  </svg></div>;
}
