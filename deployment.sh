#!/bin/bash

# setup
PROJECT=app

# check if process is already running
# and stop it, if so
FILE=$PROJECT/pid
if [ -f "$FILE" ]; then
    echo $FILE
    npm stop --prefix "$PROJECT"
fi

# sudo tar -xf archiv.tar
tar -xf archiv.tar

mkdir -p "$PROJECT" && cp package.json server.js "$PROJECT" && rm -rf package.json server.js archiv.tar

# install and start the new process
npm install --prefix "$PROJECT"
npm start --prefix "$PROJECT" &
# for pid in `ps -ef | grep node | awk '{print $2}'` ; do kill $pid ; done

# write process ID to file
echo $! > "$FILE"
sleep 1
