# Gestion Cybercafé — Application React

Application web de gestion de caisse pour cybercafé.

## Stack technique

- **React 18** + **Vite 5**
- Gestion d'état : `useReducer` + `Context API`
- Persistance : `localStorage` (web) ou `window.storage` (Claude artifact)
- Styles : inline styles avec tokens centralisés dans `src/styles/theme.js`

## Structure du projet

```
cybercafe-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                      # Point d'entrée React
    ├── App.jsx                       # Composant racine + routing par rôle
    ├── context/
    │   └── AppContext.jsx            # State global (reducer + provider)
    ├── hooks/
    │   └── useStorage.js             # Abstraction localStorage / window.storage
    ├── utils/
    │   ├── categories.js             # Constantes (catégories, rôles, utilisateurs par défaut)
    │   └── format.js                 # Fonctions utilitaires (formatage, filtres, totaux)
    ├── styles/
    │   ├── globals.css               # Reset CSS global
    │   └── theme.js                  # Design tokens (couleurs, styles réutilisables)
    └── components/
        ├── Login.jsx                 # Formulaire de connexion
        ├── Topbar.jsx                # Barre de navigation
        ├── TotalsRow.jsx             # Résumé entrées / sorties / solde
        ├── TransactionForm.jsx       # Formulaire de saisie d'opération
        ├── TransactionTable.jsx      # Tableau des opérations
        ├── CashierDashboard.jsx      # Vue caissière (saisie + historique du jour)
        ├── BossDashboard.jsx         # Vue boss (historique filtré + totaux)
        └── UserManagement.jsx        # Gestion des comptes (admin)
```

## MCD (Modèle Conceptuel de Données)

```
UTILISATEUR (id, nom, identifiant, mot_de_passe, rôle, date_création)
     ||
     || saisit (1,N)
     ||
TRANSACTION (id, type[in/out], montant, description, date, utilisateur_id FK, categorie_id FK)
     ||
     || classifie (N,1)
     ||
CATEGORIE (id, libellé, type[in/out])
```

## Rôles utilisateurs

| Rôle       | Droits                                               |
|------------|------------------------------------------------------|
| Caissière  | Saisir entrées/sorties, voir le récapitulatif du jour |
| Boss       | Voir tout l'historique filtré par période            |
| Admin      | Saisir des opérations + gérer les comptes            |

## Installation et démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173)

## Comptes de démonstration

| Identifiant | Mot de passe | Rôle      |
|-------------|--------------|-----------|
| boss        | boss123      | Boss      |
| admin       | admin123     | Admin     |
| caisse      | caisse123    | Caissière |

## Pour aller plus loin

- Remplacer `localStorage` par une vraie API backend (ex: Supabase, Firebase)
- Ajouter des graphiques de tendances avec `recharts`
- Export PDF du rapport journalier
- Mode impression de la clôture de caisse
