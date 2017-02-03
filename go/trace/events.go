package trace

type Event interface {
	GetTscBegin() uint64
	GetTscEnd() uint64
	SetTscEnd(t uint64)
	GetChildren() []Event
	AddChild(child Event)
	hasChildren() bool
	Clone() Event
	GetDuration() uint64
}

type EventBase struct {
	TscBegin uint64
	TscEnd   uint64
	Children []Event
}

func (e *EventBase) GetTscBegin() uint64 {
	return e.TscBegin
}

func (e *EventBase) GetTscEnd() uint64 {
	return e.TscEnd
}

func (e *EventBase) SetTscEnd(t uint64) {
	e.TscEnd = t
}

func (e *EventBase) GetDuration() uint64 {
	return e.GetTscEnd() - e.GetTscBegin()
}

func (e *EventBase) GetChildren() []Event {
	return e.Children
}

func (e *EventBase) AddChild(child Event) {
	e.Children = append(e.Children, child)
}

func (e *EventBase) hasChildren() bool {
	return len(e.Children) != 0
}

type EventRequest struct {
	EventBase
}

func (e *EventRequest) Clone() Event {
	var result EventRequest
	result = *e
	result.Children = nil
	return &result
}

type EventCompileFile struct {
	EventBase
	FilenameID uint32
}

func (e *EventCompileFile) Clone() Event {
	var result EventCompileFile
	result = *e
	result.Children = nil
	return &result
}

type EventCall struct {
	EventBase
	FilenameID     uint32
	FunctionNameID uint32
	ClassNameID    uint32
	LineStart      uint32
}

func (e *EventCall) Clone() Event {
	var result EventCall
	result = *e
	result.Children = nil
	return &result
}

type EventICall struct {
	EventBase
	FunctionNameID uint32
	ClassNameID    uint32
}

func (e *EventICall) Clone() Event {
	var result EventICall
	result = *e
	result.Children = nil
	return &result
}
