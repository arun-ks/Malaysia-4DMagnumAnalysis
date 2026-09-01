import csv
import json
import tempfile
import unittest
from pathlib import Path

from tools.build_web_data import DataValidationError, build_payload, write_payload_atomic

FIELDNAMES = [
    "Number", "Meaning", "DrawDate", "DrawID", "PrizeType", "PrizeDesc", "PrizeDescZh"
]


class BuildWebDataTests(unittest.TestCase):
    def write_csv(self, directory: Path, rows: list[dict[str, str]]) -> Path:
        path = directory / "results.csv"
        with path.open("w", encoding="utf-8", newline="") as output:
            writer = csv.DictWriter(output, fieldnames=FIELDNAMES)
            writer.writeheader()
            writer.writerows(rows)
        return path

    def valid_row(self, **overrides: str) -> dict[str, str]:
        row = {
            "Number": "0007",
            "Meaning": "Unused meaning",
            "DrawDate": "02/01/2024",
            "DrawID": "002/24",
            "PrizeType": "S",
            "PrizeDesc": "SPECIAL PRIZE",
            "PrizeDescZh": "特别奖",
        }
        row.update(overrides)
        return row

    def test_builds_sorted_compact_payload_and_removes_duplicates(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            rows = [
                self.valid_row(),
                self.valid_row(DrawDate="01/01/2024", DrawID="001/24", PrizeType="1"),
                self.valid_row(),
                self.valid_row(Number="9999", DrawDate="03/01/2024", DrawID="003/24", PrizeType="C"),
            ]
            payload = build_payload(
                self.write_csv(directory, rows), generated_at="2026-09-02T00:00:00Z"
            )
            self.assertEqual(payload["sourceRowCount"], 4)
            self.assertEqual(payload["recordCount"], 3)
            self.assertEqual(payload["duplicateRowsRemoved"], 1)
            self.assertEqual(payload["uniqueNumberCount"], 2)
            self.assertEqual(payload["earliestResult"], "2024-01-01")
            self.assertEqual(payload["updatedThrough"], "2024-01-03")
            self.assertEqual(
                payload["numbers"]["0007"],
                [["2024-01-01", "001/24", "1"], ["2024-01-02", "002/24", "S"]],
            )
            self.assertNotIn("Meaning", json.dumps(payload))
            self.assertNotIn("PrizeDesc", json.dumps(payload))

    def test_rejects_invalid_source_values(self) -> None:
        invalid_rows = [
            (self.valid_row(Number="7"), "exactly four digits"),
            (self.valid_row(DrawDate="31/02/2024"), "valid date"),
            (self.valid_row(PrizeType="X"), "PrizeType"),
            (self.valid_row(DrawID=""), "DrawID is empty"),
        ]
        for row, expected_message in invalid_rows:
            with self.subTest(expected_message=expected_message):
                with tempfile.TemporaryDirectory() as temporary_directory:
                    input_path = self.write_csv(Path(temporary_directory), [row])
                    with self.assertRaisesRegex(DataValidationError, expected_message):
                        build_payload(input_path)

    def test_writes_valid_json_atomically(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            directory = Path(temporary_directory)
            input_path = self.write_csv(directory, [self.valid_row()])
            output_path = directory / "nested" / "web-data.json"
            payload = build_payload(input_path, generated_at="2026-09-02T00:00:00Z")
            byte_count = write_payload_atomic(output_path, payload)
            self.assertEqual(byte_count, output_path.stat().st_size)
            self.assertEqual(json.loads(output_path.read_text(encoding="utf-8")), payload)
            self.assertEqual(list(output_path.parent.glob("*.tmp")), [])


if __name__ == "__main__":
    unittest.main()
