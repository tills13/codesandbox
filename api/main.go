package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/docker/docker/client"
	amqp "github.com/rabbitmq/amqp091-go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ApiHandlers interface {
	Create(cfg CreateConfig) (Sandbox, error)
	Console(sandboxId string) (ConsoleResponse, error)
	Handler(w http.ResponseWriter, r *http.Request)
	Sandbox(sandboxId string) (Sandbox, error)
	Start(sandboxId string) error
	Stop(sandboxId string) error
}

type ApiService struct {
	DockerClient *client.Client
	MongoClient  *mongo.Client
	AmqpChannel  *amqp.Channel
}

func (svc ApiService) SandboxesCollection() *mongo.Collection {
	return svc.MongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("PROJECTS_COLLECTION"))
}

func NewApiService(dockerClient *client.Client, mongoClient *mongo.Client, amqpChannel *amqp.Channel) ApiService {
	return ApiService{
		DockerClient: dockerClient,
		MongoClient:  mongoClient,
		AmqpChannel:  amqpChannel,
	}
}

func main() {
	ctx := context.Background()

	dockerCli, err := client.NewClientWithOpts(client.FromEnv, client.WithHost("tcp://host.docker.internal:2375"))

	if err != nil {
		panic(err)
	}

	mongodbClient, err := mongo.Connect(ctx, options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:27017", os.Getenv("MONGODB_HOST"))))

	if err != nil {
		panic(err)
	}

	defer mongodbClient.Disconnect(ctx)

	amqpConn, err := amqp.Dial(fmt.Sprintf("amqp://%s:5672", os.Getenv("AMQP_HOST")))

	if err != nil {
		panic(err)
	}

	defer amqpConn.Close()
	channel, err := amqpConn.Channel()

	if err != nil {
		panic(err)
	}

	var apiService ApiHandlers = NewApiService(dockerCli, mongodbClient, channel)

	http.HandleFunc("/api/sandbox/", apiService.Handler)
	fmt.Println("listening on :3333")
	panic(http.ListenAndServe(":3333", nil))
}
