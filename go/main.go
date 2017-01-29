package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/vadd/phtgui/stream"
)

func decode() {
	t0 := time.Now()
	file, err := os.Open("/traces/phtrace.phtrace")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	for e := range stream.Iterate(bufio.NewReader(file)) {
		_ = e
	}

	t1 := time.Now()
	fmt.Printf("The call took %v to run.\n", t1.Sub(t0))
}

func main() {
	http.Handle("/static/",
		http.StripPrefix("/static/",
			http.FileServer(http.Dir("./public")),
		),
	)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t, err := template.ParseFiles("index.gohtml")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = t.Execute(w, nil)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	http.HandleFunc("/api/v1/traces", func(w http.ResponseWriter, r *http.Request) {
		matches, _ := filepath.Glob("/traces/*.phtrace")
		data := make([]map[string]interface{}, 0, len(matches))
		for _, match := range matches {
			m := map[string]interface{}{}
			m["id"] = filepath.Base(match)
			m["name"] = m["id"]
			m["wt"] = -1
			m["timestamp"] = "2017-01-21 15:15:15:0.0001"
			data = append(data, m)
		}
		json.NewEncoder(w).Encode(data)
	})

	http.HandleFunc("/ololo", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Decoding events")
		decode()
		fmt.Fprintln(w, "Done!")
	})

	http.ListenAndServe(":8080", nil)
}
