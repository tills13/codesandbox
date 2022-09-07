package main

import (
	"context"
	"fmt"
	"time"

	"github.com/docker/docker/api/types"
	"go.mongodb.org/mongo-driver/bson"
)

func (svc ApiService) Start(ctx context.Context, sandboxId string) error {
	fmt.Println("starting", sandboxId)

	if err := svc.DockerClient.ContainerStart(ctx, sandboxId, types.ContainerStartOptions{}); err != nil {
		fmt.Println(err)
		return err
	}

	if err := svc.DockerClient.NetworkConnect(ctx, "codesandbox_default", sandboxId, nil); err != nil {
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

func (svc ApiService) Stop(ctx context.Context, sandboxId string) error {
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
