package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"
	"time"

	"github.com/vadd/phtgui/trace"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
  r.PathPrefix("/static/").Handler(
		http.StripPrefix("/static/", http.FileServer(http.Dir("./public"))),
	)

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
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

	r.HandleFunc("/api/v1/traces", func(w http.ResponseWriter, r *http.Request) {
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

	r.HandleFunc("/api/v1/traces/{traceId}/tree", func(w http.ResponseWriter, r *http.Request) {
		t := trace.NewTrace("/traces/phtrace.phtrace")
		t.LoadTree()

		var threshold uint64 = t.RequestEvent.GetDuration() / 100

		var walker func (source trace.Event) trace.Event
		walker = func (source trace.Event) trace.Event {
			var dest trace.Event
			if source.GetDuration() > threshold {
				dest = source.Clone()
				for _, sourceChild := range source.GetChildren() {
					destChild := walker(sourceChild)
					if destChild != nil {
						dest.AddChild(destChild)
					}
				}
			}
			return dest
		}
		dest := walker(t.RequestEvent)

		t0 := time.Now()
		json.NewEncoder(w).Encode(dest)
		t1 := time.Now()
		fmt.Printf("JSON encode took %v to run.\n", t1.Sub(t0))
	})

	http.ListenAndServe(":8080", r)
}
