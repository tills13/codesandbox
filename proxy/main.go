package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

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

var defaultHtmlResponseTemplate = []byte(`
	<html>
		<head>
			<style>
				body {
					background-color: none;
					font-family: monospace;
					color: white;
				}
			</style>
		</head>
		<body>
			Loading...

			<script type="text/javascript">
				setTimeout(() => { location.reload() }, 1000)
			</script>
		</body>
	</html>
`)

func writeDefaultHtmlResponse(w http.ResponseWriter) {
	w.WriteHeader(200)
	w.Write(defaultHtmlResponseTemplate)
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

		routeUrl := r.URL.Path[len("/p/"):]
		sandboxId, remainingPath, _ := strings.Cut(routeUrl, "/")

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
			writeDefaultHtmlResponse(w)
			return
		}

		rawUrl := "http://" + sandboxId + ":3000"

		if len(remainingPath) != 0 {
			rawUrl = rawUrl + "/" + remainingPath
		}

		url, _ := url.Parse(rawUrl)

		resp, err := client.Do(&http.Request{
			Method: "GET",
			URL:    url,
		})

		if err != nil {
			fmt.Println(err)
			writeDefaultHtmlResponse(w)
			return
		}

		defer resp.Body.Close()

		delHopHeaders(resp.Header)
		copyHeader(w.Header(), resp.Header)

		w.WriteHeader(resp.StatusCode)

		var buffer bytes.Buffer
		io.Copy(&buffer, resp.Body)

		proto := "http"

		if r.TLS != nil {
			proto = "https"
		}

		formattedResponse := strings.ReplaceAll(buffer.String(), `href="/`, fmt.Sprintf(`href="%s://%s/p/%s/`, proto, r.Host, sandboxId))
		formattedResponse = strings.ReplaceAll(formattedResponse, `src="/`, fmt.Sprintf(`src="%s://%s/p/%s/`, proto, r.Host, sandboxId))

		w.Write([]byte(formattedResponse))
	})

	fmt.Println("listening on :3334")
	panic(http.ListenAndServe(":3334", nil))
}
