FROM golang:1

RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install -y nodejs
COPY package.json ./
RUN npm i

RUN go get -u github.com/gorilla/mux
COPY go src/github.com/vadd/phtgui/
RUN go install github.com/vadd/phtgui

COPY *.gohtml ./
COPY .babelrc webpack.config.js ./
COPY js js

RUN npm run build

EXPOSE 8080
CMD ["phtgui"]
