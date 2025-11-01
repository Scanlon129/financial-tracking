#!/usr/bin/env python3
"""Generate synthetic transaction CSVs for local testing.

The generated files live in samples/ (ignored by Git) so that developers do not
need to commit binary spreadsheet exports.
"""

from __future__ import annotations

import csv
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from random import choice, randint, uniform

SAMPLES_DIR = Path("samples")
SAMPLES_DIR.mkdir(exist_ok=True)


@dataclass
class SampleCategory:
    name: str
    descriptions: tuple[str, ...]
    amount_range: tuple[float, float]


CATEGORIES = [
    SampleCategory("Groceries", ("Whole Foods", "Trader Joe's", "Supermarket"), (-120.0, -20.0)),
    SampleCategory("Dining", ("Restaurant", "Cafe", "Delivery"), (-80.0, -10.0)),
    SampleCategory("Transportation", ("Lyft", "Uber", "Gas Station"), (-60.0, -15.0)),
    SampleCategory("Utilities", ("Electric", "Water", "Internet"), (-200.0, -40.0)),
    SampleCategory("Entertainment", ("Streaming", "Bookstore", "Concert"), (-150.0, -15.0)),
    SampleCategory("Salary", ("Payroll", "Employer Deposit"), (1500.0, 3200.0)),
]

HEADER = ["date", "description", "amount", "account", "category"]


def generate_transactions(days: int = 60, rows: int = 200) -> list[list[str]]:
    start = date.today() - timedelta(days=days)
    data: list[list[str]] = []
    for _ in range(rows):
        day_offset = randint(0, days)
        category = choice(CATEGORIES)
        amount = round(uniform(*category.amount_range), 2)
        data.append(
            [
                (start + timedelta(days=day_offset)).isoformat(),
                choice(category.descriptions),
                f"{amount:.2f}",
                choice(["Checking", "Credit Card", "Savings"]),
                category.name,
            ]
        )
    return sorted(data, key=lambda row: row[0], reverse=True)


def write_csv(filename: str, rows: list[list[str]]) -> None:
    path = (SAMPLES_DIR / filename).resolve()
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(HEADER)
        writer.writerows(rows)
    print(f"wrote {path}")


def main() -> None:
    rows = generate_transactions()
    write_csv("transactions_sample.csv", rows)


