package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	amqp "github.com/rabbitmq/amqp091-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SandboxDocument struct {
	Id        string `json:"_id"`
	SandboxId string `json:"sandboxId"`
	Status    string `json:"status"`
	Type      string `json:"type"`
}

func setSandboxErrored(ctx context.Context, collection *mongo.Collection, id string, err error) {
	_, mErr := collection.UpdateOne(
		ctx,
		bson.D{{"sandboxId", id}},
		bson.D{{"$set", bson.D{{"status", "ERRORED"}, {"lastError", err.Error()}}}},
	)

	if mErr != nil {
		fmt.Println(mErr)
	}
}

func main() {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithHost("tcp://host.docker.internal:2375"))

	if err != nil {
		panic(err)
	}

	ctx := context.Background()

	mongodbClient, err := mongo.Connect(ctx, options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:27017", os.Getenv("MONGODB_HOST"))))

	if err != nil {
		panic(err)
	}

	defer mongodbClient.Disconnect(ctx)

	collection := mongodbClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("PROJECTS_COLLECTION"))

	connection, err := amqp.Dial(fmt.Sprintf("amqp://%s:5672", os.Getenv("AMQP_HOST")))

	if err != nil {
		panic(err)
	}

	defer connection.Close()
	ch, err := connection.Channel()

	if err != nil {
		panic(err)
	}

	if _, err := ch.QueueDeclare("initialize", false, true, false, false, nil); err != nil {
		panic(err)
	}

	msgs, err := ch.Consume(
		"initialize", // queue
		"",           // consumer
		true,         // auto-ack
		false,        // exclusive
		false,        // no-local
		false,        // no-wait
		nil,          // args
	)

	if err != nil {
		panic(err)
	}

	fmt.Println("waiting for messages")

	for d := range msgs {
		var sandbox SandboxDocument

		if err := json.Unmarshal(d.Body, &sandbox); err != nil {
			fmt.Println("[error] invalid Project document")
			continue
		}

		fmt.Println("initializing", sandbox.SandboxId)

		containerConfig := container.Config{
			Cmd:          []string{"npm", "start"},
			ExposedPorts: nat.PortSet{"3000": struct{}{}, "8080": struct{}{}},
			Image:        fmt.Sprintf("cs_%s", sandbox.Type),
			WorkingDir:   "/app",
			Hostname:     sandbox.SandboxId,
		}

		fmt.Println("creating container for", sandbox.SandboxId)
		res, err := cli.ContainerCreate(
			ctx,
			&containerConfig,
			&container.HostConfig{
				PortBindings: nat.PortMap{"8080/tcp": {{HostPort: "8080"}}},
			},
			nil,
			nil,
			sandbox.SandboxId,
		)

		if err != nil {
			fmt.Println("[error] ContainerCreate", err)
			setSandboxErrored(ctx, collection, sandbox.Id, err)
			continue
		}

		fmt.Println("successfully initialized", res.ID, ">", sandbox.SandboxId)
		collection.UpdateOne(
			ctx,
			bson.D{{"sandboxId", sandbox.SandboxId}},
			bson.D{{"$set", bson.D{{"status", "CREATED"}, {"containerId", res.ID}}}},
		)
	}
}
