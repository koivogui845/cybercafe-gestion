import { useState }      from 'react'
import { useApp }        from '../context/AppContext'
import { S, C }          from '../styles/theme'
import TotalsRow         from './TotalsRow'
import TransactionTable  from './TransactionTable'
import CalendarView      from './CalendarView'
import { filterTx }      from '../utils/format'
import { exportRapport } from '../utils/export'

const PERIODS = {
  today: "Aujourd'hui",
  week:  'Cette semaine',
  month: 'Ce mois-ci',
  all:   "Tout l'historique",
}

const VIEWS = {
  stats:     '📊 Statistiques',
  calendar:  '📅 Calendrier',
}

export default function BossDashboard() {
  const { state, actions } = useApp()
  const [activeView, setActiveView] = useState('stats')
  const list  = filterTx(state.transactions, state.filterDate)

  const telecharger = () => {
    if (list.length === 0) { alert('Aucune opération à exporter pour cette période.'); return }
    exportRapport(list, state.filterDate)
  }

  return (
    <div>
      {/* Onglets de navigation */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {Object.entries(VIEWS).map(([k, v]) => (
          <button key={k} onClick={() => setActiveView(k)} style={{
            padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', border: '1px solid',
            background:  activeView === k ? C.indigo : 'transparent',
            borderColor: activeView === k ? C.indigo : C.line,
            color:       activeView === k ? '#fff'   : C.inkMuted,
          }}>
            {v}
          </button>
        ))}
      </div>

      {/* Vue Statistiques */}
      {activeView === 'stats' && (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, flexWrap:'wrap', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontSize:12, color:C.inkMuted }}>Période :</span>
              {Object.entries(PERIODS).map(([k,v]) => (
                <button key={k} onClick={() => actions.setFilter(k)} style={{
                  padding:'6px 14px', borderRadius:20, fontSize:13, cursor:'pointer', border:'1px solid',
                  background:  state.filterDate === k ? C.indigo : 'transparent',
                  borderColor: state.filterDate === k ? C.indigo : C.line,
                  color:       state.filterDate === k ? '#fff'   : C.inkMuted,
                }}>
                  {v}
                </button>
              ))}
            </div>
            <button onClick={telecharger} style={{ background:C.green, color:'#fff', border:'none', padding:'8px 18px', borderRadius:7, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              ⬇ Télécharger Excel
            </button>
          </div>
          <TotalsRow list={list} label={`— ${PERIODS[state.filterDate]}`} />
          <div style={S.card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={S.sectionTitle}>Détail — {PERIODS[state.filterDate]}</div>
              <span style={{ fontSize:12, color:C.inkMuted }}>{list.length} opération(s)</span>
            </div>
            <TransactionTable list={list} canDelete={false} />
          </div>
        </div>
      )}

      {/* Vue Calendrier */}
      {activeView === 'calendar' && <CalendarView />}
    </div>
  )
}