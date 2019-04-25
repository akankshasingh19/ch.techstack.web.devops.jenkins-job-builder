# check if process is already running
# and kill it, if so
FILE=$PROJECT/pid
if [ -f "$FILE" ]; then
    # NODE_MODULES=node_modules
    read PID < "$FILE"
    kill "$PID"
    rm "$FILE"
    # rm "$NODE_MODULES"
fi

# start the new process
npm install --prefix "$PROJECT" && npm start --prefix "$PROJECT" > info.log

# write process ID to file
echo $! > "$FILE"
sleep 1
