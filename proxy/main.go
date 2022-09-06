package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Sandbox struct {
	Id        string
	SandboxId string `json:"sandboxId" bson:"sandboxId"`
	Status    string `json:"status" bson:"status"`
	Port      int    `bson:"port"`
	Type      string `json:"type" bson:"type"`
}

var hopHeaders = []string{
	"Connection",
	"Keep-Alive",
	"Proxy-Authenticate",
	"Proxy-Authorization",
	"Te", // canonicalized version of "TE"
	"Trailers",
	"Transfer-Encoding",
	"Upgrade",
}

func copyHeader(dst, src http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}

func delHopHeaders(header http.Header) {
	for _, h := range hopHeaders {
		header.Del(h)
	}
}

func appendHostToXForwardHeader(header http.Header, host string) {
	// If we aren't the first proxy retain prior
	// X-Forwarded-For information as a comma+space
	// separated list and fold multiple headers into one.
	if prior, ok := header["X-Forwarded-For"]; ok {
		host = strings.Join(prior, ", ") + ", " + host
	}
	header.Set("X-Forwarded-For", host)
}

func main() {
	ctx := context.Background()

	mongodbClient, err := mongo.Connect(ctx, options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:27017", os.Getenv("MONGODB_HOST"))))

	if err != nil {
		panic(err)
	}

	defer mongodbClient.Disconnect(ctx)
	collection := mongodbClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("PROJECTS_COLLECTION"))

	// amqpConn, err := amqp.Dial(fmt.Sprintf("amqp://%s:5672", os.Getenv("AMQP_HOST")))

	// if err != nil {
	// 	panic(err)
	// }

	// defer amqpConn.Close()
	// channel, err := amqpConn.Channel()

	if err != nil {
		panic(err)
	}

	http.HandleFunc("/p/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("[info]", r.Method, r.URL.Path)

		if r.Method != "GET" {
			// return
		}

		sandboxId := r.URL.Path[len("/p/"):]

		d := collection.FindOne(context.Background(), bson.D{{"sandboxId", sandboxId}})

		if d.Err() != nil {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		var sandbox Sandbox
		d.Decode(&sandbox)

		client := http.Client{}

		if sandbox.Status != "STARTED" {
			url, _ := url.Parse("http://api:3333/api/sandbox/" + sandboxId + "/start")
			client.Do(&http.Request{Method: "POST", URL: url})

			time.Sleep(5 * time.Second)
		}

		url, _ := url.Parse("http://" + sandboxId + ":3000")

		resp, err := client.Do(&http.Request{
			Method: "GET",
			URL:    url,
		})

		if err != nil {
			fmt.Println(err)
			http.Error(w, "Server Error", http.StatusInternalServerError)
			return
		}

		defer resp.Body.Close()

		delHopHeaders(resp.Header)
		copyHeader(w.Header(), resp.Header)

		w.WriteHeader(resp.StatusCode)
		io.Copy(w, resp.Body)
	})

	fmt.Println("listening on :3334")
	panic(http.ListenAndServe(":3334", nil))
}
