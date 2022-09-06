package main

import (
	"context"
	"fmt"
	"time"

	"github.com/docker/docker/api/types"
	"go.mongodb.org/mongo-driver/bson"
)

func (svc ApiService) Start(sandboxId string) error {
	fmt.Println("starting", sandboxId)
	ctx := context.Background()

	if err := svc.DockerClient.ContainerStart(ctx, sandboxId, types.ContainerStartOptions{}); err != nil {
		fmt.Println(err)
		return err
	}

	if err := svc.DockerClient.NetworkConnect(ctx, "406acb428351", sandboxId, nil); err != nil {
		fmt.Println(err)
		return err
	}

	svc.SandboxesCollection().UpdateOne(
		ctx,
		bson.D{{"sandboxId", sandboxId}},
		bson.D{{"$set", bson.D{{"status", "STARTED"}}}},
	)

	return nil
}

func (svc ApiService) Stop(sandboxId string) error {
	ctx := context.Background()
	timeout := 5 * time.Second

	if err := svc.DockerClient.ContainerStop(ctx, sandboxId, &timeout); err != nil {
		return err
	}

	svc.SandboxesCollection().UpdateOne(
		ctx,
		bson.D{{"sandboxId", sandboxId}},
		bson.D{{"$set", bson.D{{"status", "STOPPED"}}}},
	)

	return nil
}
