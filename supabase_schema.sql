-- =============================================
--  GESTION CYBERCAFÉ — Script SQL Supabase
-- =============================================

-- 1. Table des utilisateurs
CREATE TABLE utilisateurs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom         TEXT NOT NULL,
  identifiant TEXT NOT NULL UNIQUE,
  mot_de_passe TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('boss', 'admin', 'caissiere')),
  date_creation TIMESTAMPTZ DEFAULT now()
);

-- 2. Table des catégories
CREATE TABLE categories (
  id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  libelle TEXT NOT NULL,
  type    TEXT NOT NULL CHECK (type IN ('in', 'out'))
);

-- 3. Table des transactions
CREATE TABLE transactions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type          TEXT NOT NULL CHECK (type IN ('in', 'out')),
  montant       NUMERIC(12, 2) NOT NULL CHECK (montant > 0),
  description   TEXT DEFAULT '',
  categorie     TEXT NOT NULL,
  saisi_par     TEXT NOT NULL,
  utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
  date          TIMESTAMPTZ DEFAULT now()
);

-- =============================================
--  Données de départ
-- =============================================

-- Utilisateurs par défaut
INSERT INTO utilisateurs (nom, identifiant, mot_de_passe, role) VALUES
  ('Le Patron',      'boss',   'boss123',   'boss'),
  ('Administrateur', 'admin',  'admin123',  'admin'),
  ('Caissière',      'caisse', 'caisse123', 'caissiere');

-- Catégories entrées
INSERT INTO categories (libelle, type) VALUES
  ('Impression',          'in'),
  ('Photocopie',          'in'),
  ('Saisie',              'in'),
  ('Scan',                'in'),
  ('Vente enveloppe',     'in'),
  ('Connexion internet',  'in'),
  ('Autre entrée',        'in');

-- Catégories sorties
INSERT INTO categories (libelle, type) VALUES
  ('Achat papier',         'out'),
  ('Achat encre',          'out'),
  ('Électricité',          'out'),
  ('Internet (abonnement)','out'),
  ('Maintenance',          'out'),
  ('Salaire',              'out'),
  ('Autre dépense',        'out');

-- =============================================
--  Sécurité : désactiver RLS pour commencer
--  (à activer plus tard avec des règles)
-- =============================================
ALTER TABLE utilisateurs   DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories     DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions   DISABLE ROW LEVEL SECURITY;
