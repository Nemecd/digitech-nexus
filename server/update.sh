#!/bin/bash
# update.sh - unpack a new deploy.zip on the cPanel host and restart the app.
# Upload deploy.zip into ~/digitechapp first, then run:  bash ~/update.sh
# Optional: bash ~/update.sh /path/to/app   (defaults to ~/digitechapp)

set -e

APP_DIR="${1:-$HOME/digitechapp}"
cd "$APP_DIR"

if [ ! -f deploy.zip ]; then
  echo "STOP: deploy.zip not found in $APP_DIR. Upload it there first."
  exit 1
fi

echo "== Unpacking into a temporary folder"
rm -rf .incoming
mkdir .incoming
unzip -q deploy.zip -d .incoming

# Check the zip is complete before touching the live site
if [ ! -f .incoming/server.js ]; then
  echo "STOP: server.js is missing from the zip. The zip is wrong; your live site was not changed."
  rm -rf .incoming
  exit 1
fi
if [ ! -f .incoming/.next/BUILD_ID ]; then
  echo "STOP: .next/BUILD_ID is missing from the zip. The zip is wrong; your live site was not changed."
  rm -rf .incoming
  exit 1
fi

echo "== Replacing the live files"
rm -rf .next node_modules public server.js package.json
for item in .next node_modules public server.js package.json; do
  if [ -e ".incoming/$item" ]; then
    mv ".incoming/$item" .
  fi
done

rm -rf .incoming
rm -f deploy.zip

echo "== Restarting the app"
mkdir -p tmp
touch tmp/restart.txt

echo ""
echo "Done. Files now in $APP_DIR:"
ls -A "$APP_DIR"
echo ""
echo "Hard refresh the site, then run the smoke test from the runbook."
