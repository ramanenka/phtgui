package trace

type EventStack []Event

func NewEventStack() EventStack {
	return make(EventStack, 0)
}

func (s EventStack) isEmpty() bool {
	return len(s) == 0
}

func (s EventStack) probe() Event {
	return s[len(s) - 1]
}

func (s *EventStack) push(e Event) {
	*s = append(*s, e)
}

func (s *EventStack) pop() Event {
	result := (*s).probe()
	*s = (*s)[:len(*s) - 1]
	return result
}
