#!/bin/bash
set -e

# Run Elasticsearch
/usr/local/bin/docker-entrypoint.sh "$@" &
ES_PID=$!

# Wait Elasticsearch
until curl -u "elastic:${ELASTIC_PASSWORD}" -k -s "https://localhost:9200/_cluster/health?wait_for_status=yellow&timeout=50s" | grep -q '"status":"\(yellow\|green\)"'; do
  sleep 5
done

curl -X PUT "https://localhost:9200/_cluster/settings" -u "elastic:${ELASTIC_PASSWORD}" -k -H 'Content-Type: application/json' -d'
{
  "persistent" : {
    "indices.lifecycle.poll_interval": "1m" 
  }
}
'

# Apply a policy
curl -X PUT "https://localhost:9200/_ilm/policy/my-policy" \
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
          "freeze": {},
          "allocate": {
            "number_of_replicas": 0
          }

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

curl -X PUT "https://localhost:9200/_index_template/proxy-template" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H 'Content-Type: application/json' \
  -k \
  -d'
{
  "index_patterns": ["proxy-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "my-policy",
      "index.lifecycle.rollover_alias": "proxy",
      "index.number_of_replicas": 0
    }
  }
}
'

curl -X PUT "https://localhost:9200/_index_template/backend-user-template" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H 'Content-Type: application/json' \
  -k \
  -d'
{
  "index_patterns": ["backend-user-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "my-policy",
      "index.lifecycle.rollover_alias": "backend-user",
      "index.number_of_replicas": 0
    }
  }
}
'

curl -X PUT "https://localhost:9200/_index_template/backend-ping-pong-template" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H 'Content-Type: application/json' \
  -k \
  -d'
{
  "index_patterns": ["backend-ping-pong-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "my-policy",
      "index.lifecycle.rollover_alias": "backend-ping-pong",
      "index.number_of_replicas": 0
    }
  }
}
'

curl -X PUT "https://localhost:9200/_index_template/backend-blockchain-template" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H 'Content-Type: application/json' \
  -k \
  -d'
{
  "index_patterns": ["backend-blockchain-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "my-policy",
      "index.lifecycle.rollover_alias": "backend-blockchain",
      "index.number_of_replicas": 0
    }
  }
}
'

wait $ES_PID
