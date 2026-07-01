import { useApp }  from '../context/AppContext'
import { S, C }    from '../styles/theme'
import { ROLES }   from '../utils/categories'

export default function Topbar() {
  const { state, actions } = useApp()
  const u = state.currentUser
  return (
    <div style={{ background:C.indigo, color:'#fff', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`3px solid ${C.gold}`, flexWrap:'wrap', gap:10 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
        <span style={{ fontFamily:'Georgia, serif', fontWeight:700, fontSize:20 }}>⛀ Cybercafé</span>
        <span style={{ fontSize:11, textTransform:'uppercase', letterSpacing:2, opacity:0.65 }}>Gestion Caisse</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <span style={{ fontSize:13 }}>{u.name}</span>
        <span style={{ fontSize:11, textTransform:'uppercase', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.25)', padding:'3px 12px', borderRadius:999 }}>{ROLES[u.role]}</span>
        {u.role==='admin' && <>
          <button style={S.btnNav(state.view==='dashboard')} onClick={()=>actions.setView('dashboard')}>Saisie</button>
          <button style={S.btnNav(state.view==='users')} onClick={()=>actions.setView('users')}>Comptes</button>
        </>}
        <button style={S.btnNav(false)} onClick={()=>actions.logout()}>Déconnexion</button>
      </div>
    </div>
  )
}
