FROM golang:1

COPY *.go src/github.com/vadd/phtgui/
RUN go install github.com/vadd/phtgui

COPY *.gohtml ./
COPY public public

EXPOSE 8080
CMD ["phtgui"]
