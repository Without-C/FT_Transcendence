#!/bin/bash
set -e

# Change password for kibana_system
curl -k -X POST "https://elasticsearch:9200/_security/user/kibana_system/_password" \
  -H "Content-Type: application/json" \
  -u elastic:$ELASTIC_PASSWORD \
  -d "{\"password\": \"$ELASTICSEARCH_PASSWORD\"}"

# Run Kibana
/usr/local/bin/kibana-docker "$@" &
KIBANA_PID=$!

# Wait for Kibana
until curl -s http://localhost:5601/api/status | grep "status" | grep -qv "unavailable" ; do
  sleep 5
done

# Import a dashboard
curl -X POST "http://localhost:5601/api/saved_objects/_import?overwrite=true" \
  -H "kbn-xsrf: true" \
  -u elastic:$ELASTIC_PASSWORD \
  --form file=@/elk/kibana/dashboard-proxy.ndjson
curl -X POST "http://localhost:5601/api/saved_objects/_import?overwrite=true" \
  -H "kbn-xsrf: true" \
  -u elastic:$ELASTIC_PASSWORD \
  --form file=@/elk/kibana/dashboard-backend.ndjson

wait $KIBANA_PID