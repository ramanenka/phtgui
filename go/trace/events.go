package trace

type Event interface {
	SetTscEnd(t uint64)
	addChild(child Event)
	hasChildren() bool
}

type EventBase struct {
	TscBegin uint64
	TscEnd   uint64
	Children []Event
}

func (e *EventBase) SetTscEnd(t uint64) {
	e.TscEnd = t
}

func (e *EventBase) addChild(child Event) {
	e.Children = append(e.Children, child)
}

func (e *EventBase) hasChildren() bool {
	return len(e.Children) != 0
}

type EventRequest struct {
	EventBase
}

type EventCompileFile struct {
	EventBase
	FilenameID uint32
}

type EventCall struct {
	EventBase
	FilenameID     uint32
	FunctionNameID uint32
	ClassNameID    uint32
	LineStart      uint32
}

type EventICall struct {
	EventBase
	FunctionNameID uint32
	ClassNameID    uint32
}
