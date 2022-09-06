package main

import (
	"io"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
)

func copySingleFile(src, dst string) {
	source, _ := os.Open(src)
	defer source.Close()
	destination, _ := os.Create(dst)
	defer destination.Close()
	io.Copy(destination, source)
}

func copyDir(srcDir, dstDir string) {
	files, _ := ioutil.ReadDir(srcDir)

	for _, file := range files {
		srcFilePath := filepath.Join(srcDir, file.Name())
		dstFilePath := filepath.Join(dstDir, file.Name())

		sourceFileStat, _ := os.Stat(srcFilePath)

		if sourceFileStat.Mode().IsDir() {
			if !dirExists(dstFilePath) {
				os.Mkdir(dstFilePath, fs.ModePerm)
			}

			copyDir(srcFilePath, dstFilePath)
		} else {
			copySingleFile(srcFilePath, dstFilePath)
		}
	}
}

func dirExists(dirName string) bool {
	if fs, err := os.Stat(dirName); err == nil && fs.IsDir() {
		return true
	}

	return false
}
