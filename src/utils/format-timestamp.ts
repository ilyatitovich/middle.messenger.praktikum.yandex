// Используется timestamp формат ISO 8601

export function formatTimestamp(timestamp: string): string {
  const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  const months = [
    'янв',
    'фев',
    'мар',
    'апр',
    'мая',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек'
  ]

  const date = new Date(timestamp)
  const now = new Date()

  const isToday = date.toDateString() === now.toDateString()

  function getStartOfWeek(d: Date): Date {
    const start = new Date(d)
    start.setDate(d.getDate() - d.getDay())
    start.setHours(0, 0, 0, 0)
    return start
  }

  const startOfWeek = getStartOfWeek(now)
  const startOfLastWeek = new Date(startOfWeek)
  startOfLastWeek.setDate(startOfWeek.getDate() - 7)

  if (isToday) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (date >= startOfWeek && date < now) {
    return daysOfWeek[date.getDay()]
  }

  return `${date.getDate()} ${months[date.getMonth()]}`
}
