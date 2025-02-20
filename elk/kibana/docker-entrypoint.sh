#!/bin/bash
set -e

curl -k -X POST "https://elasticsearch:9200/_security/user/kibana_system/_password" \
  -H "Content-Type: application/json" \
  -u elastic:elastic \
  -d '{"password": "kibana"}'

exec /usr/local/bin/kibana-docker "$@"