#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo "=== Harness Initialization ==="
echo ""

# --- Static / lint ---
echo "=== lint: SKILL.md line counts (max 500) ==="
violations=0
while IFS= read -r -d '' file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt 500 ]; then
    echo "FAIL $file ($lines lines)"
    violations=$((violations + 1))
  fi
done < <(find skills -name SKILL.md -print0)
if [ "$violations" -gt 0 ]; then
  echo "SKILL.md files exceed 500 lines"
  exit 1
fi
echo "All SKILL.md files within limit"

# --- Smoke: CLI ---
echo "=== smoke: CLI help ==="
node scripts/cli.mjs help > /dev/null

echo "=== smoke: list skills ==="
node scripts/cli.mjs list > /dev/null

# --- Integration: install + create harness ---
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "=== integration: install skills to temp dir ==="
node scripts/cli.mjs install --yes --force --ide cursor --dest "$TMP/skills"
test -f "$TMP/skills/harness-scaffold/SKILL.md"
test -f "$TMP/skills/harness-verification/SKILL.md"

echo "=== integration: multi-IDE project install ==="
mkdir -p "$TMP/project" && cd "$TMP/project"
node "$ROOT/scripts/cli.mjs" install --yes --force --ide all --project
test -f .cursor/skills/harness-scaffold/SKILL.md
test -f .claude/skills/harness-scaffold/SKILL.md
test -f .agents/skills/harness-scaffold/SKILL.md
cd "$ROOT"

echo "=== integration: create and validate harness in temp dir ==="
node scripts/cli.mjs create --target "$TMP/harness-project"
node scripts/cli.mjs validate --target "$TMP/harness-project" --min-score 70

# --- Self: this repo must pass audit ---
echo "=== validate: this repo harness (min 70) ==="
node scripts/validate-harness.mjs --target . --min-score 70

# --- Package smoke ---
echo "=== smoke: npm pack dry-run ==="
npm pack --dry-run > /dev/null

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to see current feature state"
echo "2. Pick ONE unfinished feature to work on"
echo "3. Implement only that feature"
echo "4. Re-run ./init.sh before claiming done"
echo "5. Record evidence in feature_list.json or progress.md"
