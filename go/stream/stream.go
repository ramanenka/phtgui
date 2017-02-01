package stream

import (
	"bufio"
	"encoding/binary"
	"log"
)

const (
	EventTypeRequestBegin byte = 1
	EventTypeRequestEnd   byte = 2
	EventTypeCall         byte = 3
	EventTypeICall        byte = 6
	EventTypeDataString   byte = 5
	EventTypeCompileFile  byte = 7
	EventTypeEnd          byte = 4
)

type EventDataString struct {
	Id    uint32
	Value string
}

type EventRequestBegin struct {
	TscBegin uint64
}

type EventRequestEnd struct {
	TscEnd uint64
}

type EventCompileFileBegin struct {
	TscBegin   uint64
	FilenameID uint32
	_          uint32
}

type EventCallBegin struct {
	TscBegin       uint64
	FilenameID     uint32
	FunctionNameID uint32
	ClassNameID    uint32
	LineStart      uint32
}

type EventICallBegin struct {
	TscBegin       uint64
	FunctionNameID uint32
	ClassNameID    uint32
}

type EventEnd struct {
	TscEnd uint64
}

func Iterate(r *bufio.Reader) chan interface{} {
	result := make(chan interface{}, 1000)
	go func(r *bufio.Reader, ch chan interface{}) {
		var ev byte
		for {
			err := binary.Read(r, binary.LittleEndian, &ev)
			if err != nil {
				close(ch)
				break
			}

			switch ev {
			case EventTypeDataString:
				var e EventDataString
				binary.Read(r, binary.LittleEndian, &e.Id)
				bytesStr, _ := r.ReadBytes(0)
				e.Value = string(bytesStr[:len(bytesStr) - 1])
				ch <- e

			case EventTypeRequestBegin:
				var e EventRequestBegin
				binary.Read(r, binary.LittleEndian, &e)
				ch <- e

			case EventTypeRequestEnd:
				var e EventRequestEnd
				binary.Read(r, binary.LittleEndian, &e)
				ch <- e

			case EventTypeCompileFile:
				var e EventCompileFileBegin
				binary.Read(r, binary.LittleEndian, &e)
				ch <- e

			case EventTypeCall:
				var e EventCallBegin
				binary.Read(r, binary.LittleEndian, &e)
				ch <- e

			case EventTypeICall:
				var e EventICallBegin
				binary.Read(r, binary.LittleEndian, &e)
				ch <- e

			case EventTypeEnd:
				var e EventEnd
				binary.Read(r, binary.LittleEndian, &e)
				ch <- e

			default:
				log.Fatal("Unknown event type: ", ev)
			}
		}
	}(r, result)
	return result
}
