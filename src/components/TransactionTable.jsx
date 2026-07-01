import { useApp }       from '../context/AppContext'
import { S, C }         from '../styles/theme'
import { fmt, fmtDate } from '../utils/format'

export default function TransactionTable({ list, canDelete = false }) {
  const { actions } = useApp()
  const del = async id => {
    if (window.confirm('Supprimer cette opération ?')) {
      try { await actions.removeTransaction(id) } catch(e) { alert('Erreur lors de la suppression.') }
    }
  }
  if (!list.length) return <div style={{ textAlign:'center', padding:'28px 0', color:C.inkMuted, fontSize:14 }}>Aucune opération pour cette période.</div>
  return (
    <div style={{ overflowX:'auto' }}>
      <table>
        <thead><tr>
          <th style={S.th}>Date</th><th style={S.th}>Type</th><th style={S.th}>Catégorie</th>
          <th style={S.th}>Description</th><th style={S.th}>Par</th>
          <th style={{ ...S.th, textAlign:'right' }}>Montant</th>
          {canDelete && <th style={S.th}></th>}
        </tr></thead>
        <tbody>
          {list.map(t=>(
            <tr key={t.id} onMouseEnter={e=>e.currentTarget.style.background=C.paperDim} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <td style={{ ...S.td, fontSize:12, whiteSpace:'nowrap' }}>{fmtDate(t.date)}</td>
              <td style={S.td}><span style={t.kind==='in'?S.tagIn:S.tagOut}>{t.kind==='in'?'Entrée':'Sortie'}</span></td>
              <td style={S.td}>{t.category}</td>
              <td style={{ ...S.td, color:C.inkMuted }}>{t.description||'—'}</td>
              <td style={{ ...S.td, fontSize:12, color:C.inkMuted }}>{t.by}</td>
              <td style={{ ...S.td, textAlign:'right', fontWeight:600, color:t.kind==='in'?C.green:C.red }}>{t.kind==='in'?'+':'−'}{fmt(t.amount)}</td>
              {canDelete && <td style={S.td}><button style={S.btnDanger} onClick={()=>del(t.id)}>Suppr.</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
