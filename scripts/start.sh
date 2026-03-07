#!/bin/bash
set -e
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
