package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/vadd/phtgui/trace"
	"github.com/gorilla/mux"
	"github.com/fatih/structs"
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
			basename := filepath.Base(match)
			m["id"] = strings.TrimSuffix(basename, filepath.Ext(basename))
			m["name"] = m["id"]
			m["wt"] = -1
			m["timestamp"] = "2017-01-21 15:15:15:0.0001"
			data = append(data, m)
		}
		json.NewEncoder(w).Encode(data)
	})

	r.HandleFunc("/api/v1/traces/{traceId}/tree", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		traceId := vars["traceId"]

		t := trace.NewTrace(fmt.Sprintf("/traces/%s.phtrace", traceId))
		t.LoadTree()

		var threshold uint64 = t.RequestEvent.GetDuration() / 1000

		var walker func (source trace.Event, strings map[uint32]string) map[string]interface{}
		walker = func (source trace.Event, strings map[uint32]string) map[string]interface{} {
			var result map[string]interface{}
			if source.GetDuration() > threshold {
				result = structs.Map(source)
				result["type"] = structs.Name(source)
				result["children"] = []interface{}{}

				for _, stringID := range source.GetStringIDs() {
					strings[stringID] = t.Strings[stringID]
				}

				children := []interface{}{}
				for _, sourceChild := range source.GetChildren() {
					resultChild := walker(sourceChild, strings)
					if resultChild != nil {
						children = append(children, resultChild)
					}
				}
				result["children"] = children
			}
			return result
		}

		strings := make(map[uint32]string)
		tree := walker(t.RequestEvent, strings)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"strings": strings,
			"root": tree,
		})
	})

	http.ListenAndServe(":8080", r)
}
