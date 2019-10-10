FROM grafana/grafana

USER root

COPY cert/ca.pem /usr/local/share/ca-certificates/internal-root-ca.crt

RUN update-ca-certificates
