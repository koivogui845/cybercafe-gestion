import { S, C } from '../styles/theme'
import { fmt, totals } from '../utils/format'

export default function TotalsRow({ list, label = '' }) {
  const t = totals(list)

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
      <div style={S.totalBoxIn}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: C.green, opacity: 0.85, marginBottom: 5 }}>
          Entrées {label}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Georgia, serif', color: C.green }}>
          +{fmt(t.in)}
        </div>
      </div>

      <div style={S.totalBoxOut}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: C.red, opacity: 0.85, marginBottom: 5 }}>
          Sorties {label}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Georgia, serif', color: C.red }}>
          -{fmt(t.out)}
        </div>
      </div>

      <div style={S.totalBoxNet}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: C.indigo, opacity: 0.85, marginBottom: 5 }}>
          Solde net {label}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Georgia, serif', color: t.net >= 0 ? C.indigo : C.red }}>
          {fmt(t.net)}
        </div>
      </div>
    </div>
  )
}
