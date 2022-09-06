package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func (svc ApiService) Handler(w http.ResponseWriter, r *http.Request) {
	method := r.Method

	fmt.Println("[info]", method, r.URL.Path)

	w.Header().Add("access-control-allow-origin", "*")
	w.Header().Add("access-control-allow-headers", "*")

	if method == "OPTIONS" {
		w.WriteHeader(200)
		// w.Write([]byte(""))
		return
	}

	urlParts := strings.Split(r.URL.Path[13:], "/")

	if len(r.URL.Path[13:]) == 0 || len(urlParts) == 0 {
		w.WriteHeader(400)
		w.Write([]byte("Bad Request\n"))
		return
	}

	var endpoint string

	sandboxId := urlParts[0]

	if len(urlParts) == 1 {
		endpoint = "/"
	} else {
		endpoint = urlParts[1]
	}

	var statusCode int
	var result interface{}
	var err error

	if method == "GET" {
		if endpoint == "/" {
			result, err = svc.Sandbox(sandboxId)
		} else if endpoint == "console" {
			result, err = svc.Console(sandboxId)
		} else {
			statusCode = 404
			err = fmt.Errorf("Not Found")
		}
	} else if method == "POST" {
		if endpoint == "create" {
			var createConfig CreateConfig

			if bodyBytes, err := ioutil.ReadAll(r.Body); err == nil {
				if err = json.Unmarshal(bodyBytes, &createConfig); err == nil {
					result, err = svc.Create(createConfig)
				}
			}

		} else if endpoint == "start" {
			err = svc.Start(sandboxId)
		} else if endpoint == "stop" {
			err = svc.Stop(sandboxId)
		} else {
			statusCode = 404
			err = fmt.Errorf("Not Found")
		}
	} else {
		statusCode = 404
		err = fmt.Errorf("Not Found")
	}

	if err != nil {
		if statusCode == 0 {
			statusCode = 500
		}

		result = makeErrorResult(err)
	} else {
		statusCode = 200
		result = makeResult(result)
	}

	if bytes, err := json.Marshal(result); err != nil {
		w.WriteHeader(500)
	} else {
		w.WriteHeader(statusCode)
		w.Write(bytes)
	}
}
