package main

import (
	"context"
	"os"

	"go.mongodb.org/mongo-driver/bson"
)

type Sandbox struct {
	Id        string
	SandboxId string `json:"sandboxId" bson:"sandboxId"`
	Status    string `json:"status" bson:"status"`
	Type      string `json:"type" bson:"type"`
	LastError string `json:"lastError" bson:"lastError"`
}

func (svc ApiService) Sandbox(ctx context.Context, sandboxId string) (Sandbox, error) {
	collection := svc.MongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("PROJECTS_COLLECTION"))

	d := collection.FindOne(ctx, bson.D{{"sandboxId", sandboxId}})

	if d.Err() != nil {
		return Sandbox{}, d.Err()
	}

	var sandbox Sandbox
	d.Decode(&sandbox)

	return sandbox, nil
}
