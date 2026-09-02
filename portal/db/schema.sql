CREATE TABLE IF NOT EXISTS search_events (
  event_id uuid PRIMARY KEY,
  session_id uuid NOT NULL,
  numbers text[] NOT NULL,
  language varchar(5) NOT NULL DEFAULT 'en',
  searched_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT search_events_numbers_count CHECK (cardinality(numbers) BETWEEN 1 AND 3)
);

CREATE INDEX IF NOT EXISTS search_events_session_time_idx
  ON search_events (session_id, searched_at DESC);

CREATE INDEX IF NOT EXISTS search_events_retention_idx
  ON search_events (searched_at);
