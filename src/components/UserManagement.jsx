import { useApp }  from '../context/AppContext'
import { S, C }    from '../styles/theme'
import { ROLES }   from '../utils/categories'

export default function UserManagement() {
  const { state, actions } = useApp()
  const f = state.newUser
  const del = async id => {
    if (window.confirm('Supprimer ce compte ?')) {
      try { await actions.removeUser(id) } catch(e) { alert(e.message) }
    }
  }
  return (
    <div>
      <div style={S.card}>
        <div style={S.sectionTitle}>Ajouter un compte</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:12 }}>
          <div><label style={S.label}>Nom complet</label><input style={S.input} value={f.name} onChange={e=>actions.patchNewUser({name:e.target.value})} placeholder="Ex: Aïcha Koné"/></div>
          <div><label style={S.label}>Identifiant</label><input style={S.input} value={f.username} onChange={e=>actions.patchNewUser({username:e.target.value})} placeholder="Ex: aicha"/></div>
          <div><label style={S.label}>Mot de passe</label><input style={S.input} value={f.password} onChange={e=>actions.patchNewUser({password:e.target.value})} placeholder="Mot de passe"/></div>
          <div><label style={S.label}>Rôle</label>
            <select style={S.select} value={f.role} onChange={e=>actions.patchNewUser({role:e.target.value})}>
              <option value="caissiere">Caissière</option><option value="admin">Admin</option><option value="boss">Boss</option>
            </select>
          </div>
        </div>
        {state.userError && <div style={{ color:C.red, fontSize:13, marginTop:10 }}>{state.userError}</div>}
        <button onClick={()=>actions.submitNewUser()} style={S.btnAdd}>+ Créer le compte</button>
      </div>
      <div style={S.card}>
        <div style={S.sectionTitle}>Comptes existants ({state.users.length})</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {state.users.map(u=>(
            <div key={u.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:C.paperDim, borderRadius:8 }}>
              <div><span style={{ fontWeight:600 }}>{u.name}</span><span style={{ color:C.inkMuted }}> ({u.username})</span><span style={S.tagRole(u.role)}>{ROLES[u.role]}</span></div>
              <button style={S.btnDanger} onClick={()=>del(u.id)}>Supprimer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
