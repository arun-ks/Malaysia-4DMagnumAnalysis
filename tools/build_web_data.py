#!/usr/bin/env python3
"""Build the compact web dataset from the master Magnum CSV file."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import tempfile
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

SCHEMA_VERSION = 1
GENERATOR_VERSION = "1.0.0"
VALID_PRIZE_TYPES = frozenset({"1", "2", "3", "C", "S"})
REQUIRED_COLUMNS = frozenset({"Number", "DrawDate", "DrawID", "PrizeType"})
REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = REPOSITORY_ROOT / "winning_history_4D_Magnum.csv"
DEFAULT_OUTPUT = REPOSITORY_ROOT / "portal" / "public" / "data" / "magnum-history.json"


class DataValidationError(ValueError):
    """Raised when the source CSV contains invalid data."""


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def utc_timestamp() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _is_blank_row(row: dict[str, str | None]) -> bool:
    return not any((value or "").strip() for value in row.values())


def _required_value(row: dict[str, str | None], column: str, line_number: int) -> str:
    value = (row.get(column) or "").strip()
    if not value:
        raise DataValidationError(f"Line {line_number}: {column} is empty")
    return value


def _parse_date(value: str, line_number: int) -> str:
    try:
        parsed = datetime.strptime(value, "%d/%m/%Y")
    except ValueError as error:
        raise DataValidationError(
            f"Line {line_number}: DrawDate {value!r} must use DD/MM/YYYY and be a valid date"
        ) from error
    return parsed.date().isoformat()


def build_payload(input_path: Path, *, generated_at: str | None = None) -> dict[str, object]:
    """Validate the CSV and return a compact payload sorted by number and date."""
    if not input_path.is_file():
        raise DataValidationError(f"Input file does not exist: {input_path}")

    records_by_number: dict[str, list[tuple[str, str, str]]] = defaultdict(list)
    seen_records: set[tuple[str, str, str, str]] = set()
    source_row_count = 0
    duplicate_rows_removed = 0
    earliest_result: str | None = None
    updated_through: str | None = None

    with input_path.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        if reader.fieldnames is None:
            raise DataValidationError("The input CSV has no header row")
        missing_columns = REQUIRED_COLUMNS.difference(reader.fieldnames)
        if missing_columns:
            missing = ", ".join(sorted(missing_columns))
            raise DataValidationError(f"The input CSV is missing required columns: {missing}")

        for line_number, row in enumerate(reader, start=2):
            if _is_blank_row(row):
                continue
            source_row_count += 1
            number = _required_value(row, "Number", line_number)
            if re.fullmatch(r"\d{4}", number) is None:
                raise DataValidationError(
                    f"Line {line_number}: Number {number!r} must contain exactly four digits"
                )
            draw_date = _parse_date(_required_value(row, "DrawDate", line_number), line_number)
            draw_id = _required_value(row, "DrawID", line_number)
            prize_type = _required_value(row, "PrizeType", line_number).upper()
            if prize_type not in VALID_PRIZE_TYPES:
                allowed = ", ".join(sorted(VALID_PRIZE_TYPES))
                raise DataValidationError(
                    f"Line {line_number}: PrizeType {prize_type!r} is invalid; expected one of {allowed}"
                )

            record_key = (number, draw_date, draw_id, prize_type)
            if record_key in seen_records:
                duplicate_rows_removed += 1
                continue
            seen_records.add(record_key)
            records_by_number[number].append((draw_date, draw_id, prize_type))
            earliest_result = draw_date if earliest_result is None else min(earliest_result, draw_date)
            updated_through = draw_date if updated_through is None else max(updated_through, draw_date)

    if source_row_count == 0:
        raise DataValidationError("The input CSV contains no data rows")

    sorted_numbers = {
        number: [list(record) for record in sorted(records_by_number[number])]
        for number in sorted(records_by_number)
    }
    return {
        "schemaVersion": SCHEMA_VERSION,
        "generatorVersion": GENERATOR_VERSION,
        "generatedAt": generated_at or utc_timestamp(),
        "updatedThrough": updated_through,
        "earliestResult": earliest_result,
        "sourceRowCount": source_row_count,
        "recordCount": len(seen_records),
        "duplicateRowsRemoved": duplicate_rows_removed,
        "uniqueNumberCount": len(sorted_numbers),
        "sourceSha256": sha256_file(input_path),
        "numbers": sorted_numbers,
    }


def serialize_payload(payload: dict[str, object]) -> bytes:
    serialized = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return (serialized + "\n").encode("utf-8")


def write_payload_atomic(output_path: Path, payload: dict[str, object]) -> int:
    """Write a payload atomically and return its byte size."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    serialized = serialize_payload(payload)
    temporary_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="wb",
            dir=output_path.parent,
            prefix=f".{output_path.name}.",
            suffix=".tmp",
            delete=False,
        ) as temporary:
            temporary.write(serialized)
            temporary.flush()
            os.fsync(temporary.fileno())
            temporary_name = temporary.name
        os.replace(temporary_name, output_path)
    finally:
        if temporary_name is not None:
            Path(temporary_name).unlink(missing_ok=True)
    return len(serialized)


def existing_output_matches(output_path: Path, payload: dict[str, object]) -> bool:
    if not output_path.is_file():
        return False
    try:
        existing = json.loads(output_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return False
    return (
        existing.get("schemaVersion") == payload["schemaVersion"]
        and existing.get("generatorVersion") == payload["generatorVersion"]
        and existing.get("sourceSha256") == payload["sourceSha256"]
    )


def format_summary(payload: dict[str, object], output_bytes: int | None = None) -> Iterable[str]:
    yield f"Source rows: {payload['sourceRowCount']:,}"
    yield f"Valid unique records: {payload['recordCount']:,}"
    yield f"Duplicate rows removed: {payload['duplicateRowsRemoved']:,}"
    yield f"Numbers represented: {payload['uniqueNumberCount']:,}"
    yield f"Date range: {payload['earliestResult']} to {payload['updatedThrough']}"
    if output_bytes is not None:
        yield f"Output size: {output_bytes / 1024 / 1024:.2f} MB"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate the Magnum results CSV and generate compact web JSON."
    )
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Source CSV path")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Destination JSON path")
    parser.add_argument("--check", action="store_true", help="Validate without writing JSON")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Rewrite the JSON even when the source and generator are unchanged",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        payload = build_payload(args.input.resolve())
        if args.check:
            print("Validation successful; no output written.")
            for line in format_summary(payload, len(serialize_payload(payload))):
                print(line)
            return 0

        output_path = args.output.resolve()
        if not args.force and existing_output_matches(output_path, payload):
            print(f"Output is already current: {output_path}")
            for line in format_summary(payload, output_path.stat().st_size):
                print(line)
            return 0

        output_bytes = write_payload_atomic(output_path, payload)
        print(f"Generated: {output_path}")
        for line in format_summary(payload, output_bytes):
            print(line)
        return 0
    except (DataValidationError, OSError) as error:
        print(f"ERROR: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
