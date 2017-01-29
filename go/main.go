package main

import (
	"bufio"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// Constants designate event type
const (
	EventTypeCall        byte = 3
	EventTypeICall       byte = 6
	EventTypeDataString  byte = 5
	EventTypeCompileFile byte = 7
	EventTypeEnd         byte = 4
)

type eventDataString struct {
	id    uint32
	value string
}

type eventCompileFileBegin struct {
	TscBegin   uint64
	FilenameID uint32
	_          uint32
}

type eventCallBegin struct {
	TscBegin       uint64
	FilenameID     uint32
	FunctionNameID uint32
	ClassNameID    uint32
	LineStart      uint32
}

type eventICallBegin struct {
	TscBegin       uint64
	FunctionNameID uint32
	ClassNameID    uint32
}

type eventEnd struct {
	TscEnd uint64
}

func walk(file *os.File) chan interface{} {
	result := make(chan interface{}, 1000)
	go func(file *os.File, ch chan interface{}) {
		// f, err := os.Create("/traces/goprof.prof")
		// if err != nil {
		// 	log.Fatal(err)
		// }
		// pprof.StartCPUProfile(f)
		// defer pprof.StopCPUProfile()
		r := bufio.NewReader(file)

		var ev byte
		for {
			err := binary.Read(r, binary.LittleEndian, &ev)
			if err != nil {
				close(ch)
				break
			}

			switch ev {
			case EventTypeDataString:
				var e eventDataString
				binary.Read(r, binary.LittleEndian, &e.id)
				bytesStr, _ := r.ReadBytes(0)
				e.value = string(bytesStr)
				ch <- &e

			case EventTypeCompileFile:
				var e eventCompileFileBegin
				binary.Read(r, binary.LittleEndian, &e)
				ch <- &e

			case EventTypeCall:
				var e eventCallBegin
				binary.Read(r, binary.LittleEndian, &e)
				ch <- &e

			case EventTypeICall:
				var e eventICallBegin
				binary.Read(r, binary.LittleEndian, &e)
				ch <- &e

			case EventTypeEnd:
				var e eventEnd
				binary.Read(r, binary.LittleEndian, &e)
				ch <- &e

			default:
				log.Fatal("Unknown event type: ", ev)
			}
		}
	}(file, result)
	return result
}

func decode() {
	t0 := time.Now()
	file, err := os.Open("/traces/phtrace.phtrace")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	for e := range walk(file) {
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
