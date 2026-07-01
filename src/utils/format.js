export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function fmt(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export function fmtDate(d) {
  return new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function filterTx(txs, filter) {
  const now = new Date()
  switch (filter) {
    case 'today':
      return txs.filter(t => t.date.slice(0, 10) === todayStr())
    case 'week': {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      start.setHours(0, 0, 0, 0)
      return txs.filter(t => new Date(t.date) >= start)
    }
    case 'month':
      return txs.filter(t => {
        const d = new Date(t.date)
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      })
    default:
      return txs
  }
}

export function totals(list) {
  const inT  = list.filter(t => t.kind === 'in').reduce((s, t) => s + t.amount, 0)
  const outT = list.filter(t => t.kind === 'out').reduce((s, t) => s + t.amount, 0)
  return { in: inT, out: outT, net: inT - outT }
}
