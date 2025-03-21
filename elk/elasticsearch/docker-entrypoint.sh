#!/bin/bash
set -e

# Run Elasticsearch
/usr/local/bin/docker-entrypoint.sh "$@" &
ES_PID=$!

# Wait Elasticsearch
until curl -u "elastic:${ELASTIC_PASSWORD}" -k -s "https://localhost:9200/_cluster/health?wait_for_status=yellow&timeout=50s" | grep -q '"status":"\(yellow\|green\)"'; do
  sleep 5
done

# Apply a policy
curl -X PUT curl -X PUT "https://localhost:9200/_ilm/policy/my_policy" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H 'Content-Type: application/json' \
  -k \
  -d'
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_age": "1m"
          }
        }
      },
      "cold": {
        "min_age": "1m",
        "actions": {
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "1m",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
'

wait $ES_PID
