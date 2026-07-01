import { AppProvider, useApp } from './context/AppContext'
import { C }                    from './styles/theme'
import Login                    from './components/Login'
import Topbar                   from './components/Topbar'
import CashierDashboard         from './components/CashierDashboard'
import BossDashboard            from './components/BossDashboard'
import UserManagement           from './components/UserManagement'

function Loading() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', flexDirection:'column', gap:12 }}>
      <div style={{ width:32, height:32, border:`3px solid ${C.line}`, borderTopColor:C.terracotta, borderRadius:'50%', animation:'spin 0.8s linear infinite' }}></div>
      <p style={{ color:'#9a8c78', fontSize:14 }}>Connexion à la base de données…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function ErrorScreen({ msg }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div style={{ background:'#fff', border:'1px solid rgba(168,57,47,0.3)', borderRadius:10, padding:'32px 36px', maxWidth:420, textAlign:'center' }}>
        <div style={{ fontSize:28, marginBottom:12 }}>⚠️</div>
        <h2 style={{ color:'#a8392f', marginBottom:8, fontSize:18 }}>Erreur de connexion</h2>
        <p style={{ color:'#766a5c', fontSize:14, lineHeight:1.6 }}>{msg}</p>
        <p style={{ color:'#9a8c78', fontSize:12, marginTop:12 }}>Vérifiez votre URL et clé Supabase dans <code>src/supabase.js</code></p>
      </div>
    </div>
  )
}

function AppInner() {
  const { state } = useApp()
  if (!state.loaded)      return <Loading />
  if (state.loadError)    return <ErrorScreen msg={state.loadError} />
  if (!state.currentUser) return <Login />
  const u = state.currentUser
  return (
    <div style={{ minHeight:'100vh', background:C.paper, color:C.ink, fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
      <Topbar />
      <div style={{ maxWidth:980, margin:'0 auto', padding:'24px 20px' }}>
        {u.role === 'caissiere' && <CashierDashboard />}
        {u.role === 'boss'      && <BossDashboard />}
        {u.role === 'admin'     && (state.view === 'users' ? <UserManagement /> : <CashierDashboard />)}
      </div>
    </div>
  )
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>
}
