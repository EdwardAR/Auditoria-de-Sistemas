export function formatDate(value, includeTime = false) {
  if (!value) return '—'
  const date = new Date(value.includes?.('T') ? value : `${value}T12:00:00`)
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date)
}

export function formatMonth(value) {
  if (!value) return ''
  const date = new Date(`${value.slice(0, 7)}-02T12:00:00`)
  return new Intl.DateTimeFormat('es-PE', { month: 'short', year: '2-digit' }).format(date)
}

export function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export function classNames(...values) {
  return values.filter(Boolean).join(' ')
}
