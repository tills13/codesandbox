package main

import (
	"context"
	"encoding/json"
	"fmt"
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

func (svc ApiService) Create(ctx context.Context, config CreateConfig) (Sandbox, error) {
	sandboxId := generateId()

	sandbox := Sandbox{
		SandboxId: sandboxId,
		Status:    "CREATING",
		Type:      config.Type,
	}

	if _, err := svc.SandboxesCollection().InsertOne(ctx, sandbox); err != nil {
		fmt.Println(err)

		return Sandbox{}, err
	}

	if sandboxJsonBytes, err := json.Marshal(sandbox); err != nil {
		fmt.Println(err)

		return Sandbox{}, err
	} else {
		q, err := svc.AmqpChannel.QueueDeclare("initialize", false, true, false, false, nil)

		if err != nil {
			panic(err)
		}

		err = svc.AmqpChannel.PublishWithContext(ctx, "", q.Name, false, false, amqp091.Publishing{
			ContentType: "application/json",
			Body:        sandboxJsonBytes,
		})

		if err != nil {
			fmt.Println(err)
			return Sandbox{}, err
		}
	}

	return sandbox, nil
}
