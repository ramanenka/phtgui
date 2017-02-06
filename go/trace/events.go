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
	GetStringIDs() []uint32
}

type EventBase struct {
	TscBegin uint64 `structs:"tsc_begin"`
	TscEnd   uint64 `structs:"tsc_end"`
	children []Event
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
	return e.children
}

func (e *EventBase) AddChild(child Event) {
	e.children = append(e.children, child)
}

func (e *EventBase) hasChildren() bool {
	return len(e.children) != 0
}

type EventRequest struct {
	EventBase `structs:",flatten"`
}

func (e *EventRequest) Clone() Event {
	var result EventRequest
	result = *e
	result.children = nil
	return &result
}

func (e *EventRequest) GetStringIDs() []uint32 {
	return []uint32{}
}

type EventCompileFile struct {
	EventBase         `structs:",flatten"`
	FilenameID uint32 `structs:"filename_id"`
}

func (e *EventCompileFile) Clone() Event {
	var result EventCompileFile
	result = *e
	result.children = nil
	return &result
}

func (e *EventCompileFile) GetStringIDs() []uint32 {
	return []uint32{e.FilenameID}
}

type EventCall struct {
	EventBase             `structs:",flatten"`
	FilenameID     uint32 `structs:"filename_id"`
	FunctionNameID uint32 `structs:"function_name_id"`
	ClassNameID    uint32 `structs:"class_name_id"`
	LineStart      uint32 `structs:"line_start"`
}

func (e *EventCall) Clone() Event {
	var result EventCall
	result = *e
	result.children = nil
	return &result
}

func (e *EventCall) GetStringIDs() []uint32 {
	return []uint32{e.FilenameID, e.FunctionNameID, e.ClassNameID}
}

type EventICall struct {
	EventBase             `structs:",flatten"`
	FunctionNameID uint32 `structs:"function_name_id"`
	ClassNameID    uint32 `structs:"class_name_id"`
}

func (e *EventICall) Clone() Event {
	var result EventICall
	result = *e
	result.children = nil
	return &result
}

func (e *EventICall) GetStringIDs() []uint32 {
	return []uint32{e.FunctionNameID, e.ClassNameID}
}
