package main

type Result struct {
	Success bool        `json:"success"`
	Result  interface{} `json:"result"`
}

type ErrorResult struct {
	Success bool   `json:"success"`
	Error   string `json:"string"`
}

func makeResult(result interface{}) Result {
	return Result{Result: result, Success: true}
}

func makeErrorResult(err error) ErrorResult {
	return ErrorResult{Error: err.Error(), Success: false}
}
