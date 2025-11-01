#!/usr/bin/env python3
"""Detect committed files that appear to be binary artifacts.

The script scans the repository for tracked files that do not decode as UTF-8
text. It helps keep the project source-only so PRs are not blocked by binary
assets. Returns a non-zero exit code if a binary file is detected.
"""

from __future__ import annotations

import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]


def git_tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files"],
        cwd=REPO_ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    return [REPO_ROOT / Path(line.strip()) for line in result.stdout.splitlines() if line.strip()]


def is_binary(path: Path) -> bool:
    try:
        data = path.read_bytes()
    except OSError:
        return False

    if not data:
        return False

    if b"\0" in data:
        return True

    try:
        data.decode("utf-8")
        return False
    except UnicodeDecodeError:
        return True


def main() -> int:
    binaries: list[Path] = []
    for file_path in git_tracked_files():
        if is_binary(file_path):
            binaries.append(file_path.relative_to(REPO_ROOT))

    if binaries:
        print("Binary-like files detected:\n")
        for binary in binaries:
            print(f" - {binary}")
        print("\nRemove these files or add them to .gitignore before committing.")
        return 1

    print("No binary files detected among tracked sources.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
