FROM node:18.14.2 AS builder
RUN mkdir -p /app
WORKDIR /app
ADD . .
RUN mkdir -p video-storage

RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN npm install
RUN npm run build

ARG STAGE
ENV STAGE ${STAGE}
ARG POSTGRES_HOST
ENV POSTGRES_HOST ${POSTGRES_HOST}
ARG SENTRY_DSN
ENV SENTRY_DSN ${SENTRY_DSN}
ARG SLACK_WEBHOOK
ENV SLACK_WEBHOOK ${SLACK_WEBHOOK}
ARG EMAIL_USER
ENV EMAIL_USER ${EMAIL_USER}
ARG EMAIL_PASS
ENV EMAIL_PASS ${EMAIL_PASS}
ARG JWT_SECRET
ENV JWT_SECRET ${JWT_SECRET}
ARG SWAGGER_USER
ENV SWAGGER_USER ${SWAGGER_USER}
ARG SWAGGER_PASSWORD
ENV SWAGGER_PASSWORD ${SWAGGER_PASSWORD}

CMD npm run typeorm migration:run;npm run start:prod
