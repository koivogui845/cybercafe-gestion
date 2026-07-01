//cat /home/claude/cybercafe-app/src/components/Login.jsx
//Sortie//

import { useState } from 'react'
import { useApp }   from '../context/AppContext'
import { S, C }     from '../styles/theme'

export default function Login() {
  const { state, actions } = useApp()
  const [usr, setUsr] = useState('')
  const [pwd, setPwd] = useState('')

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:`radial-gradient(circle at 20% 30%, rgba(199,154,63,0.12), transparent 40%), ${C.paper}` }}>
      <div style={{ ...S.card, width:360, padding:'38px 36px' }}>
        <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:3, color:C.terracotta, fontWeight:700 }}>Cybercafé</div>
        <h1 style={{ margin:'4px 0 2px', fontSize:26, fontFamily:'Georgia, serif' }}>Gestion Caisse</h1>
        <p style={{ margin:'0 0 22px', color:C.inkMuted, fontSize:13 }}>Connectez-vous pour accéder à votre espace.</p>
        <label style={S.label}>Identifiant</label>
        <input style={S.input} value={usr} onChange={e=>setUsr(e.target.value)} onKeyDown={e=>e.key==='Enter'&&actions.login(usr,pwd)} autoComplete="username"/>
        <label style={S.label}>Mot de passe</label>
        <input style={S.input} type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&actions.login(usr,pwd)} autoComplete="current-password"/>
        {state.loginError && <div style={{ color:C.red, fontSize:13, marginTop:10 }}>{state.loginError}</div>}
        <button onClick={()=>actions.login(usr,pwd)} style={S.btnPrimary}>Se connecter</button>
        <div style={{ marginTop:18, fontSize:12, color:'#9a8c78', textAlign:'center', lineHeight:1.7 }}>
          Comptes démo : boss/boss123 · admin/admin123 · caisse/caisse123
        </div>
      </div>
    </div>
  )
}
