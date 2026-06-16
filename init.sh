#!/bin/bash
set -e

echo "=== Harness Initialization ==="
echo ""

echo "=== smoke test: CLI help ==="
node scripts/cli.mjs help > /dev/null

echo "=== smoke test: list skills ==="
node scripts/cli.mjs list > /dev/null

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

echo "=== validate harness score ==="
node scripts/validate-harness.mjs --target .

echo "=== npm pack dry-run ==="
npm pack --dry-run > /dev/null

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to see current feature state"
echo "2. Pick ONE unfinished feature to work on"
echo "3. Implement only that feature"
echo "4. Re-run verification before claiming done"
echo "5. Leave a clean, restartable repo for the next session"
