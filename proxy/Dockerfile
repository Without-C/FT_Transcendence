FROM nginx:latest

COPY default.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

RUN sed -i '/http {/i worker_shutdown_timeout 3s;' /etc/nginx/nginx.conf

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
