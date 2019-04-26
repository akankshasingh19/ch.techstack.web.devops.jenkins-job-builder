#!/bin/bash

TRY_COUNT=30
TRY_INTERVAL=1

COUNTER=0
while [  $COUNTER -lt $TRY_COUNT ]; do
    let COUNTER=COUNTER+1

    echo "$COUNTER. try\n"

    RESPONSE=$(curl --silent --head $HOST | grep "HTTP/1.1 200" || :)

    if [ -n "$RESPONSE" ]; then
        printf "$RESPONSE"
        exit 0
    fi

    sleep $TRY_INTERVAL
done

exit 1
