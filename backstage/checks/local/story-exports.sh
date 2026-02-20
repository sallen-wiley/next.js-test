#!/bin/bash
# story-exports.sh - Verify all .stories.tsx files have default export

MISSING=$(find src/ -name "*.stories.tsx" -exec grep -L "export default" {} \; 2>/dev/null | wc -l | tr -d ' ')

if [ "$MISSING" -eq 0 ]; then
  echo "✅ All story files have exports"
  exit 0
else
  echo "❌ $MISSING story file(s) missing default export"
  find src/ -name "*.stories.tsx" -exec grep -L "export default" {} \; 2>/dev/null
  exit 1
fi
