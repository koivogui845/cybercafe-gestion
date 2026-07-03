import { useState } from 'react'
import { useApp }         from '../context/AppContext'
import { S, C }           from '../styles/theme'
import { fmt, fmtDate, totals } from '../utils/format'
import TransactionTable   from './TransactionTable'

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS   = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']

export default function CalendarView() {
  const { state } = useApp()
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  const daysInMonth  = getDaysInMonth(year, month)
  const firstDay     = getFirstDayOfMonth(year, month)

  // Groupe les transactions par jour
  function txForDay(day) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return state.transactions.filter(t => t.date.slice(0,10) === dateStr)
  }

  // Navigation mois
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y-1) }
    else setMonth(m => m-1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y+1) }
    else setMonth(m => m+1)
    setSelectedDay(null)
  }

  const selectedTxs = selectedDay ? txForDay(selectedDay) : []
  const selectedTot = totals(selectedTxs)

  // Cellules du calendrier
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {/* Header navigation */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <button onClick={prevMonth} style={{ background:C.indigo, color:'#fff', border:'none', padding:'8px 16px', borderRadius:7, cursor:'pointer', fontSize:18 }}>‹</button>
        <h2 style={{ fontFamily:'Georgia, serif', fontSize:22, color:C.indigo }}>
          {MONTHS[month]} {year}
        </h2>
        <button onClick={nextMonth} style={{ background:C.indigo, color:'#fff', border:'none', padding:'8px 16px', borderRadius:7, cursor:'pointer', fontSize:18 }}>›</button>
      </div>

      {/* Calendrier */}
      <div style={S.card}>
        {/* Jours de la semaine */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:4, marginBottom:8 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:700, color:C.inkMuted, textTransform:'uppercase', letterSpacing:1, padding:'4px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Cases du calendrier */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:4 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const txs = txForDay(day)
            const tot = totals(txs)
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear()
            const isSelected = day === selectedDay
            const hasData = txs.length > 0

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'center',
                  border: isSelected ? `2px solid ${C.indigo}` : isToday ? `2px solid ${C.gold}` : `1px solid ${C.line}`,
                  background: isSelected ? C.indigoLight : isToday ? C.goldLight : hasData ? '#fff' : C.paperDim,
                  transition: 'all 0.1s',
                  minHeight: 64,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 4,
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.indigoLight }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isToday ? C.goldLight : hasData ? '#fff' : C.paperDim }}
              >
                {/* Numéro du jour */}
                <div style={{
                  fontSize: 13, fontWeight: isToday ? 700 : 500,
                  color: isSelected ? C.indigo : isToday ? C.gold : C.ink,
                  width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  background: isToday && !isSelected ? C.gold : 'transparent',
                  color: isToday && !isSelected ? '#fff' : isSelected ? C.indigo : C.ink,
                }}>
                  {day}
                </div>

                {/* Totaux du jour */}
                {hasData && (
                  <div style={{ width: '100%' }}>
                    {tot.in > 0 && (
                      <div style={{ fontSize: 10, color: C.green, fontWeight: 600, lineHeight: 1.3 }}>
                        +{new Intl.NumberFormat('fr-FR').format(tot.in)}
                      </div>
                    )}
                    {tot.out > 0 && (
                      <div style={{ fontSize: 10, color: C.red, fontWeight: 600, lineHeight: 1.3 }}>
                        -{new Intl.NumberFormat('fr-FR').format(tot.out)}
                      </div>
                    )}
                    <div style={{ fontSize: 9, color: C.inkMuted, lineHeight: 1.3 }}>
                      {txs.length} op.
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Détail du jour sélectionné */}
      {selectedDay && (
        <div style={S.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:10 }}>
            <div style={S.sectionTitle}>
              📅 {selectedDay} {MONTHS[month]} {year}
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <span style={{ fontSize:13, color:C.green, fontWeight:600 }}>+{fmt(selectedTot.in)}</span>
              <span style={{ fontSize:13, color:C.red, fontWeight:600 }}>-{fmt(selectedTot.out)}</span>
              <span style={{ fontSize:13, color:C.indigo, fontWeight:700 }}>= {fmt(selectedTot.net)}</span>
            </div>
          </div>
          <TransactionTable list={selectedTxs} canDelete={false} />
        </div>
      )}
    </div>
  )
}