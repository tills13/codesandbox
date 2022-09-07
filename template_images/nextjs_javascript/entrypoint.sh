#!/bin/bash
set -ex

code-server \
    --auth none \
    --disable-telemetry \
    --disable-update-check \
    --bind-addr 0.0.0.0:8080 \
    /app &

exec "$@"