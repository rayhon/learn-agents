#!/usr/bin/env bash
set -euo pipefail

# --- edit these only ---
WORKDIR="/Users/raymond/projects/learn/learn-bash-scripting/01-tmux"
CMD1="./tasks/task_001.sh"
CMD2="./tasks/task_002.sh"
# -----------------------

S1=agent1; LOG1="$WORKDIR/tasks/log/${S1}.log"; TOK1="${S1}_done"
S2=agent2; LOG2="$WORKDIR/tasks/log/${S2}.log"; TOK2="${S2}_done"

# fresh sessions
tmux kill-session -t "$S1" 2>/dev/null || true
tmux kill-session -t "$S2" 2>/dev/null || true

# clear logs (folder must already exist)
: > "$LOG1"
: > "$LOG2"

# launch both; stream to log; on completion, SIGNAL with a token
# macOS 'script' form: script -q /dev/null bash -c "<cmd>"
tmux new-session -d -s "$S1" -n window1 -c "$WORKDIR" \
  "script -q /dev/null bash -c \"$CMD1\" 2>&1 | tee -a \"$LOG1\"; tmux wait-for -S \"$TOK1\""
tmux set-window-option -t "$S1:0" remain-on-exit on >/dev/null 2>&1 || true

tmux new-session -d -s "$S2" -n window1 -c "$WORKDIR" \
  "script -q /dev/null bash -c \"$CMD2\" 2>&1 | tee -a \"$LOG2\"; tmux wait-for -S \"$TOK2\""
tmux set-window-option -t "$S2:0" remain-on-exit on >/dev/null 2>&1 || true

# stream both logs to this terminal (portable prefixes)
tail -n 0 -F "$LOG1" 2>/dev/null | while IFS= read -r line; do echo "agent1 | $line"; done & T1=$!
tail -n 0 -F "$LOG2" 2>/dev/null | while IFS= read -r line; do echo "agent2 | $line"; done & T2=$!

# tidy tails on exit/ctrl+c
trap 'kill "$T1" "$T2" 2>/dev/null || true; wait "$T1" "$T2" 2>/dev/null || true' EXIT INT TERM

# wait until BOTH sessions signal done (no races, no server errors)
tmux wait-for "$TOK1"
tmux wait-for "$TOK2"

# stop streaming and summarize
kill "$T1" "$T2" 2>/dev/null || true
wait "$T1" "$T2" 2>/dev/null || true

echo
echo "--- finished ---"
echo "agent1 log: $LOG1"
echo "agent2 log: $LOG2"
echo "attach:     tmux attach -t $S1    # or: tmux attach -t $S2  (detach: prefix + d)"
