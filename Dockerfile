FROM node:4.1.2
COPY . /carbono-auth-server
WORKDIR /carbono-auth-server
RUN npm install

EXPOSE 7999

CMD ["/bin/sh", "-c", "node ."]
