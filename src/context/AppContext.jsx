import { createContext, useContext, useReducer, useEffect } from 'react'
import { getUsers, getTransactions, addUser, deleteUser, addTransaction, deleteTransaction, getCategories } from '../hooks/api'

const initialState = {
  loaded: false, loadError: null, users: [], transactions: [],
  currentUser: null, view: 'dashboard', loginError: '', filterDate: 'today',
  txForm: { kind: 'in', category: CATEGORIES_IN[0], description: '', amount: '' },
  categories: { in: [], out: [] },  // ← ajoute cette ligne
  newUser: { username: '', password: '', role: 'caissiere', name: '' },
  userError: '', txLoading: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOADED':      return { ...state, loaded: true, loadError: null, users: action.users, transactions: action.transactions }
    case 'LOAD_ERROR':  return { ...state, loaded: true, loadError: action.msg }
    case 'LOGIN':       return { ...state, currentUser: action.user, loginError: '', view: 'dashboard' }
    case 'LOGIN_ERROR': return { ...state, loginError: action.msg }
    case 'LOGOUT':      return { ...state, currentUser: null }
    case 'SET_VIEW':    return { ...state, view: action.view }
    case 'SET_FILTER':  return { ...state, filterDate: action.filter }
    case 'TX_FORM':     return { ...state, txForm: { ...state.txForm, ...action.patch } }
    case 'TX_LOADING':  return { ...state, txLoading: action.loading }
    case 'TX_ADDED':    return { ...state, transactions: [action.tx, ...state.transactions], txForm: { ...state.txForm, description: '', amount: '' }, txLoading: false }
    case 'TX_DELETED':  return { ...state, transactions: state.transactions.filter(t => t.id !== action.id) }
    case 'NEW_USER_FORM': return { ...state, newUser: { ...state.newUser, ...action.patch }, userError: '' }
    case 'USER_ADDED':  return { ...state, users: [...state.users, action.user], newUser: { username: '', password: '', role: 'caissiere', name: '' }, userError: '' }
    case 'USER_ERROR':  return { ...state, userError: action.msg }
    case 'USER_DELETED':return { ...state, users: state.users.filter(u => u.id !== action.id) }
    case 'CATEGORIES':  return { ...state, categories: action.categories }
    default: return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function load() {
  try {
    const [users, transactions, categories] = await Promise.all([
      getUsers(), 
      getTransactions(),
      getCategories(),  // ← ajoute
    ])
    console.log('Utilisateurs chargés:', users)
    dispatch({ type: 'LOADED', users, transactions })
    dispatch({ type: 'CATEGORIES', categories })  // ← ajoute
  } catch (e) {
    console.error(e)
    dispatch({ type: 'LOAD_ERROR', msg: 'Impossible de se connecter à la base de données.' })
  }
}
    load()
  }, [])

  const actions = {
    login(username, password) {
      const u = state.users.find(x => x.username === username.trim() && x.password === password)
      if (!u) { dispatch({ type: 'LOGIN_ERROR', msg: 'Identifiant ou mot de passe incorrect.' }); return }
      dispatch({ type: 'LOGIN', user: u })
    },
    logout() { dispatch({ type: 'LOGOUT' }) },
    setView(view) { dispatch({ type: 'SET_VIEW', view }) },
    setFilter(filter) { dispatch({ type: 'SET_FILTER', filter }) },
    patchTxForm(patch) { dispatch({ type: 'TX_FORM', patch }) },
    async submitTransaction() {
      const f = state.txForm
      const amt = parseFloat(f.amount)
      if (!amt || amt <= 0) throw new Error('Montant invalide')
      dispatch({ type: 'TX_LOADING', loading: true })
      try {
        const tx = await addTransaction({ kind: f.kind, amount: amt, description: f.description.trim(), category: f.category, by: state.currentUser.name, userId: state.currentUser.id })
        dispatch({ type: 'TX_ADDED', tx })
      } catch (e) { dispatch({ type: 'TX_LOADING', loading: false }); throw e }
    },
    async removeTransaction(id) { await deleteTransaction(id); dispatch({ type: 'TX_DELETED', id }) },
    patchNewUser(patch) { dispatch({ type: 'NEW_USER_FORM', patch }) },
    async submitNewUser() {
      const f = state.newUser
      if (!f.username.trim() || !f.password.trim() || !f.name.trim()) { dispatch({ type: 'USER_ERROR', msg: 'Tous les champs sont requis.' }); return }
      if (state.users.some(u => u.username === f.username.trim())) { dispatch({ type: 'USER_ERROR', msg: 'Cet identifiant existe déjà.' }); return }
      try {
        const user = await addUser({ name: f.name.trim(), username: f.username.trim(), password: f.password, role: f.role })
        dispatch({ type: 'USER_ADDED', user })
      } catch (e) { dispatch({ type: 'USER_ERROR', msg: 'Erreur lors de la création du compte.' }) }
    },
    async removeUser(id) {
      if (state.users.length <= 1) throw new Error('Impossible de supprimer le dernier compte.')
      await deleteUser(id); dispatch({ type: 'USER_DELETED', id })
    },
  }

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp doit être dans <AppProvider>')
  return ctx
}
