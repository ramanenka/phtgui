FROM golang:1

COPY *.go src/github.com/vadd/phtgui/
RUN go install github.com/vadd/phtgui

EXPOSE 8080
CMD ["phtgui"]
