#!/usr/bin/env bash
set -euo pipefail

# Tiny demo program: prints lines and exits
for i in {1..5}; do
  echo "task1: $i"
  sleep 1
done

echo "DONE"