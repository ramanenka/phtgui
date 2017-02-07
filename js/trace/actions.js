export const TRACE_OPEN = 'TRACE_OPEN'
export function openTrace(traceId) {
  return {
    type: TRACE_OPEN,
    traceId
  }
}

export const TRACE_CLOSE = 'TRACE_CLOSE'
export function closeTrace() {
  return {
    type: TRACE_CLOSE
  }
}
