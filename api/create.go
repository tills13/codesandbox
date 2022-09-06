package main

import (
	"context"
	"encoding/json"
	"math/rand"
	"sort"
	"strings"

	"github.com/rabbitmq/amqp091-go"
)

var alphabet = strings.Split("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321", "")

func generateId() string {
	sort.Slice(alphabet, func(i, j int) bool {
		return rand.Float32() > 0.5
	})

	return strings.Join(alphabet[:10], "")
}

type CreateConfig struct {
	Type string `json:"type"`
}

func (svc ApiService) Create(config CreateConfig) (Sandbox, error) {
	sandboxId := generateId()

	sandbox := Sandbox{
		SandboxId: sandboxId,
		Status:    "CREATING",
		Type:      config.Type,
	}

	if _, err := svc.SandboxesCollection().InsertOne(context.Background(), sandbox); err != nil {
		return Sandbox{}, err
	}

	if sandboxJsonBytes, err := json.Marshal(sandbox); err != nil {
		return Sandbox{}, err
	} else {
		err = svc.AmqpChannel.Publish("", "initializeProject", false, false, amqp091.Publishing{
			ContentType: "application/json",
			Body:        sandboxJsonBytes,
		})

		if err != nil {
			return Sandbox{}, err
		}
	}

	return sandbox, nil
}
