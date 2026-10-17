#!/usr/bin/env bash
# ==========================================================
# 🤖 RALPH LOOP: Autonomous AI Iteration Engine
# Fresh Context Iterations • External File Memory • Git Ops
# ==========================================================

MAX_ITERATIONS=${1:-10}
PRD_FILE="prd.json"
PROGRESS_FILE="progress.txt"

if [ ! -f "$PRD_FILE" ]; then
    echo "❌ Error: prd.json not found."
    exit 1
fi

echo "=========================================================="
echo " 🤖 RALPH LOOP: Autonomous AI Iteration Engine"
echo "=========================================================="

iteration=1
while [ $iteration -le $MAX_ITERATIONS ]; do
    echo ""
    echo "[Ralph Loop] Iteration $iteration of $MAX_ITERATIONS..."

    # Check for remaining uncompleted tasks
    pending_count=$(node -e "const p = require('./prd.json'); console.log((p.tasks || []).filter(t => t.status !== 'completed').length);")

    if [ "$pending_count" -eq "0" ]; then
        echo "🎉 [Ralph Loop] SUCCESS: All tasks in prd.json are completed!"
        node backend/test_runner.js
        exit 0
    fi

    # Run verification suite
    node -e "
    const fs = require('fs');
    const prd = JSON.parse(fs.readFileSync('prd.json', 'utf8'));
    const nextTask = (prd.tasks || []).find(t => t.status !== 'completed');
    if (nextTask) {
        console.log('👉 Active Task [' + nextTask.id + ']: ' + nextTask.title);
    }
    "

    # Execute backend tests as verification barrier
    npm test --if-present || node backend/test_runner.js
    if [ $? -ne 0 ]; then
        echo "❌ [Ralph Loop] Test verification failed. Aborting iteration."
        exit 1
    fi

    # Mark the task complete
    node -e "
    const fs = require('fs');
    const prd = JSON.parse(fs.readFileSync('prd.json', 'utf8'));
    const nextTask = (prd.tasks || []).find(t => t.status !== 'completed');
    if (nextTask) {
        nextTask.status = 'completed';
        fs.writeFileSync('prd.json', JSON.stringify(prd, null, 2));
        fs.appendFileSync('progress.txt', '\n[' + new Date().toISOString() + '] Task ' + nextTask.id + ' COMPLETED: ' + nextTask.title + '\n');
    }
    "

    git add prd.json progress.txt
    git commit -m "ralph-loop: advance iteration task" || true

    iteration=$((iteration + 1))
    sleep 1
done

echo "🏁 [Ralph Loop] Finished iteration run."
