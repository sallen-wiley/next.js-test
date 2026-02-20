#!/bin/bash
# story-references.sh - Check for hardcoded story IDs (manual review if found)

FOUND=$(grep -r "story.*id.*['\"]" src/ --include="*.tsx" --include="*.ts" 2>/dev/null)

if [ -z "$FOUND" ]; then
  echo "✅ No hardcoded story IDs found"
  exit 0
else
  echo "⚠️  Hardcoded story references found (manual review needed):"
  echo "$FOUND"
  echo ""
  echo "ℹ️  This is not necessarily an error - verify references are valid"
  exit 0  # Pass (manual review, not auto-fail)
fi
