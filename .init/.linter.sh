#!/bin/bash
cd /home/kavia/workspace/code-generation/hallmarking-center-portal-301460-301471/hallmarking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

