package main

import (
	"bytes"
	"context"
	"sort"
	"strings"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/pkg/stdcopy"
)

type ConsoleResponse struct {
	Entries []ConsoleLogEntry `json:"entries"`
}

func NewConsoleResponse(entries []ConsoleLogEntry) ConsoleResponse {
	r := ConsoleResponse{}

	if len(entries) != 0 {
		r.Entries = entries
	} else {
		r.Entries = make([]ConsoleLogEntry, 0)
	}

	return r
}

type ConsoleLogEntry struct {
	Message   string `json:"message"`
	Stream    string `json:"stream"`
	Timestamp string `json:"timestamp"`
}

func parseLines(rawInput string, stream string) []ConsoleLogEntry {
	lines := strings.Split(rawInput, "\n")

	var logEntries []ConsoleLogEntry

	for _, line := range lines {
		timestamp, message, found := strings.Cut(line, " ")

		if !found {
			continue
		}

		logEntries = append(logEntries, ConsoleLogEntry{
			Timestamp: timestamp,
			Stream:    stream,
			Message:   message,
		})
	}

	return logEntries
}

func combineStreams(s1 []ConsoleLogEntry, s2 []ConsoleLogEntry) []ConsoleLogEntry {
	combinedStreams := append(s1, s2...)

	sort.SliceStable(combinedStreams, func(i, j int) bool {
		return strings.Compare(combinedStreams[i].Timestamp, combinedStreams[j].Timestamp) < 0
	})

	return combinedStreams
}

func (svc ApiService) Console(ctx context.Context, sandboxId string) (ConsoleResponse, error) {
	reader, err := svc.DockerClient.ContainerLogs(ctx, sandboxId, types.ContainerLogsOptions{
		ShowStdout: true,
		Timestamps: true,
		ShowStderr: true,
	})

	if err != nil {
		return ConsoleResponse{}, err
	}

	stdout := new(bytes.Buffer)
	stderr := new(bytes.Buffer)

	stdcopy.StdCopy(stdout, stderr, reader)

	stdoutEntries := parseLines(stdout.String(), "stdout")
	stderrEntries := parseLines(stderr.String(), "stderr")

	return NewConsoleResponse(combineStreams(stderrEntries, stdoutEntries)), nil
}
