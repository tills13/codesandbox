FROM golang:1.19

WORKDIR /app

RUN go install github.com/cespare/reflex@latest

COPY go.mod go.sum ./

RUN go mod download

CMD [ "go", "run", "."]