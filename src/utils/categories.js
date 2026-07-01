export const CATEGORIES_IN = [
  'Impression',
  'Photocopie',
  'Saisie',
  'Scan',
  'Vente enveloppe',
  'Connexion internet',
  'Autre entrée',
]

export const CATEGORIES_OUT = [
  'Achat papier',
  'Achat encre',
  'Électricité',
  'Internet (abonnement)',
  'Maintenance',
  'Salaire',
  'Autre dépense',
]

export const ROLES = {
  boss:      'Boss',
  admin:     'Admin',
  caissiere: 'Caissière',
}

export const DEFAULT_USERS = [
  { id: 'u1', username: 'boss',   password: 'boss123',   role: 'boss',      name: 'Le Patron'       },
  { id: 'u2', username: 'admin',  password: 'admin123',  role: 'admin',     name: 'Administrateur'  },
  { id: 'u3', username: 'caisse', password: 'caisse123', role: 'caissiere', name: 'Caissière'       },
]
