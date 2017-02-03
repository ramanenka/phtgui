package trace

import (
	"os"
	"bufio"
	"log"
	"github.com/vadd/phtgui/stream"
)

type Trace struct {
	Filename string
	RequestEvent Event
	Strings map[uint32]string
	StreamEventCount uint64
}

func NewTrace(filename string) *Trace {
	return &Trace{
		Filename: filename,
		Strings: make(map[uint32]string),
	}
}

func (t *Trace) LoadTree() {
	f, err := os.Open(t.Filename)
	if err != nil {
		panic(err)
	}

	stack := NewEventStack()

	for s := range stream.Iterate(bufio.NewReader(f)) {
		t.StreamEventCount++
		switch s := s.(type) {
		case stream.EventRequestBegin:
			var e EventRequest
			e.TscBegin = s.TscBegin
			t.RequestEvent = &e
			stack.push(&e)
			_ = s

		case stream.EventCompileFileBegin:
			var e EventCompileFile
			e.TscBegin = s.TscBegin
			e.FilenameID = s.FilenameID

			stack.probe().AddChild(&e)
			stack.push(&e)

		case stream.EventCallBegin:
			var e EventCall
			e.TscBegin = s.TscBegin
			e.FilenameID = s.FilenameID
			e.FunctionNameID = s.FunctionNameID
			e.ClassNameID = s.ClassNameID
			e.LineStart = s.LineStart

			stack.probe().AddChild(&e)
			stack.push(&e)

		case stream.EventICallBegin:
			var e EventICall
			e.TscBegin = s.TscBegin
			e.FunctionNameID = s.FunctionNameID
			e.ClassNameID = s.ClassNameID

			stack.probe().AddChild(&e)
			stack.push(&e)

		case stream.EventEnd:
			e := stack.pop()
			e.SetTscEnd(s.TscEnd)

		case stream.EventRequestEnd:
			for !stack.isEmpty() {
				e := stack.pop()
				e.SetTscEnd(s.TscEnd)
			}

		case stream.EventDataString:
			t.Strings[s.Id] = s.Value

		default:
			log.Fatalf("Unknown type %T", s)
		}
	}
}
