export const METHODS = ['GET', 'POST', 'PUT', 'DELETE']

export const METHOD_CONFIG = {
  GET: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    ring: 'ring-emerald-500/30',
    dot: 'bg-emerald-400',
    hex: '#22c55e',
  },
  POST: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    ring: 'ring-blue-500/30',
    dot: 'bg-blue-400',
    hex: '#3b82f6',
  },
  PUT: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    ring: 'ring-amber-500/30',
    dot: 'bg-amber-400',
    hex: '#f59e0b',
  },
  DELETE: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    ring: 'ring-red-500/30',
    dot: 'bg-red-400',
    hex: '#ef4444',
  },
}

export const STATUS_CODES = {
  200: { label: 'OK', result: 'PASS' },
  201: { label: 'Created', result: 'PASS' },
  204: { label: 'No Content', result: 'PASS' },
  206: { label: 'Partial Content', result: 'PASS' },
  301: { label: 'Moved Permanently', result: 'PASS' },
  302: { label: 'Found', result: 'PASS' },
  304: { label: 'Not Modified', result: 'PASS' },
  400: { label: 'Bad Request', result: 'FAIL' },
  401: { label: 'Unauthorized', result: 'FAIL' },
  403: { label: 'Forbidden', result: 'FAIL' },
  404: { label: 'Not Found', result: 'FAIL' },
  405: { label: 'Method Not Allowed', result: 'FAIL' },
  408: { label: 'Request Timeout', result: 'FAIL' },
  409: { label: 'Conflict', result: 'FAIL' },
  422: { label: 'Unprocessable Entity', result: 'FAIL' },
  429: { label: 'Too Many Requests', result: 'FAIL' },
  500: { label: 'Internal Server Error', result: 'FAIL' },
  501: { label: 'Not Implemented', result: 'FAIL' },
  502: { label: 'Bad Gateway', result: 'FAIL' },
  503: { label: 'Service Unavailable', result: 'FAIL' },
  504: { label: 'Gateway Timeout', result: 'FAIL' },
}

export const PASS_STATUS_CODES = new Set([200, 201, 204, 206, 301, 302, 304])

export const STORAGE_KEY = 'api_docs_v1'

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'collections', label: 'API Collections' },
  { id: 'add', label: 'Add API' },
  { id: 'history', label: 'History' },
  { id: 'export', label: 'Export Excel' },
  { id: 'settings', label: 'Settings' },
]
