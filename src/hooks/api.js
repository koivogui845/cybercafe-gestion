import { supabase } from '../supabase'

export async function getUsers() {
  const { data, error } = await supabase
    .from('utilisateurs')
    .select('*')
    .order('date_creation', { ascending: true })
  
  console.log('API getUsers data:', data, 'error:', error)
  
  if (error) throw error
  
  return (data || []).map(u => ({
    id:       u.id,
    name:     u.nom,
    username: u.identifiant,
    password: u.mot_de_passe,
    role:     u.role,
  }))
}

export async function addUser({ name, username, password, role }) {
  const { data, error } = await supabase
    .from('utilisateurs')
    .insert([{ nom: name, identifiant: username, mot_de_passe: password, role }])
    .select()
    .single()
  if (error) throw error
  return { id: data.id, name: data.nom, username: data.identifiant, password: data.mot_de_passe, role: data.role }
}

export async function deleteUser(id) {
  const { error } = await supabase.from('utilisateurs').delete().eq('id', id)
  if (error) throw error
}

export async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return (data || []).map(t => ({
    id:          t.id,
    kind:        t.type,
    amount:      parseFloat(t.montant),
    description: t.description,
    category:    t.categorie,
    by:          t.saisi_par,
    date:        t.date,
  }))
}

export async function addTransaction({ kind, amount, description, category, by, userId }) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      type:           kind,
      montant:        amount,
      description:    description || '',
      categorie:      category,
      saisi_par:      by,
      utilisateur_id: userId || null,
    }])
    .select()
    .single()
  if (error) throw error
  return {
    id:          data.id,
    kind:        data.type,
    amount:      parseFloat(data.montant),
    description: data.description,
    category:    data.categorie,
    by:          data.saisi_par,
    date:        data.date,
  }
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}