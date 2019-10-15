FROM grafana/grafana:master

USER root

COPY cert/ca.pem /usr/local/share/ca-certificates/internal-root-ca.crt
COPY app-kube /var/lib/grafana/plugins/kube-app
COPY app-worldping /var/lib/grafana/plugins/ping-app
COPY dist /var/lib/grafana/plugins/davi

COPY provisioning /etc/grafana/provisioning

RUN update-ca-certificates
