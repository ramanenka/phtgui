package main

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
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

type eventCompileFile struct {
	Tsc        uint64
	FilenameID uint32
	_          uint32
}

type eventCall struct {
	Tsc            uint64
	FilenameID     uint32
	FunctionNameID uint32
	ClassNameID    uint32
	LineStart      uint32
}

type eventICall struct {
	Tsc            uint64
	FunctionNameID uint32
	ClassNameID    uint32
}

type eventEnd struct {
	Tsc uint64
}

func decode() {
	t0 := time.Now()
	var eventsCount uint64
	events := make([]interface{}, 0, 1E6)

	file, err := os.Open("/traces/phtrace.phtrace")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	r := bufio.NewReader(file)
	var ev byte
	for {
		err := binary.Read(r, binary.LittleEndian, &ev)
		if err != nil {
			break
		}
		eventsCount++

		switch ev {
		case EventTypeDataString:
			var stringID uint32
			binary.Read(r, binary.LittleEndian, &stringID)
			bytesStr, _ := r.ReadBytes(0)
			str := string(bytesStr)
			_ = str
			//fmt.Println("EVENT_DATA_STRING: string id =", stringID, "string =", str)
		case EventTypeCompileFile:
			var e eventCompileFile
			binary.Read(r, binary.LittleEndian, &e)
			//fmt.Println("EVENT_COMPILE_FILE:", e)
			events = append(events, e)
		case EventTypeCall:
			var e eventCall
			binary.Read(r, binary.LittleEndian, &e)
			//fmt.Println("EVENT_CALL:", e)
			events = append(events, e)
		case EventTypeICall:
			var e eventICall
			binary.Read(r, binary.LittleEndian, &e)
			//fmt.Println("EVENT_ICALL:", e)
			events = append(events, e)
		case EventTypeEnd:
			var e eventEnd
			binary.Read(r, binary.LittleEndian, &e)
			//fmt.Println("EVENT_END:", e)
			events = append(events, e)
		default:
			log.Fatal("Unknown event type: ", ev)
		}
	}

	t1 := time.Now()
	fmt.Printf("The call took %v to run.\n", t1.Sub(t0))
	fmt.Println("Events count: ", eventsCount)
	fmt.Println("Events without strings: ", len(events))
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

	http.ListenAndServe(":8080", nil)
}
