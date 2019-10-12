#!/usr/bin/env bash
export HOME=/export
export NODE_ENV=production
export NODE_CONFIG_DIR=../config
pm2 start config.json
echo "start OK"
