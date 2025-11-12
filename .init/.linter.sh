#!/bin/bash
cd /home/kavia/workspace/code-generation/to-do-list-manager-222919-222928/frontend_reactjs
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

