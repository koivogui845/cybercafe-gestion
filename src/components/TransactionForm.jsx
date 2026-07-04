import { useApp }   from '../context/AppContext'
import { S }        from '../styles/theme'

export default function TransactionForm() {
  const { state, actions } = useApp()
  const f = state.txForm

  const allCats = [...(state.categories.in || []), ...(state.categories.out || [])]
    .filter((v, i, a) => a.indexOf(v) === i)

  const add = async () => {
    try { await actions.submitTransaction() }
    catch(e) { alert(e.message || "Erreur lors de l'ajout.") }
  }

  return (
    <div style={S.card}>
      <div style={S.sectionTitle}>Nouvelle opération</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:12 }}>
        <div>
          <label style={S.label}>Type</label>
          <select
            style={S.select}
            value={f.kind}
            onChange={e => actions.patchTxForm({ kind: e.target.value })}
          >
            <option value="in">Entrée (recette)</option>
            <option value="out">Sortie (dépense)</option>
          </select>
        </div>
        <div>
          <label style={S.label}>Catégorie</label>
          <select
            style={S.select}
            value={f.category}
            onChange={e => actions.patchTxForm({ category: e.target.value })}
          >
            {allCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Montant (FCFA)</label>
          <input
            style={S.input}
            type="number" min="0" placeholder="0"
            value={f.amount}
            onChange={e => actions.patchTxForm({ amount: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
        </div>
        <div>
          <label style={S.label}>Description</label>
          <input
            style={S.input}
            placeholder="Détail (optionnel)"
            value={f.description}
            onChange={e => actions.patchTxForm({ description: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
        </div>
      </div>
      <button
        onClick={add}
        disabled={state.txLoading}
        style={{ ...S.btnAdd, opacity: state.txLoading ? 0.6 : 1 }}
      >
        {state.txLoading ? 'Enregistrement…' : "+ Ajouter l'opération"}
      </button>
    </div>
  )
}