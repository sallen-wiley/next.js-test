#!/bin/bash
# storybook-build.sh - Validate all stories compile without errors

npm run build-storybook > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ All stories build successfully"
  exit 0
else
  echo "❌ Storybook build failed"
  exit 1
fi
