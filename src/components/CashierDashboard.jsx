import { useApp }          from '../context/AppContext'
import { S }               from '../styles/theme'
import TotalsRow           from './TotalsRow'
import TransactionForm     from './TransactionForm'
import TransactionTable    from './TransactionTable'
import { todayStr }        from '../utils/format'

export default function CashierDashboard() {
  const { state } = useApp()

  const todayTxs = state.transactions.filter(t => t.date.slice(0, 10) === todayStr())

  return (
    <div>
      <TotalsRow list={todayTxs} label="du jour" />
      <TransactionForm />
      <div style={S.card}>
        <div style={S.sectionTitle}>Opérations d'aujourd'hui</div>
        <TransactionTable list={todayTxs} canDelete={true} />
      </div>
    </div>
  )
}
