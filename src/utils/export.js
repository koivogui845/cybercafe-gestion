import * as XLSX from 'xlsx'

export function exportRapport(transactions, periode) {
  // Préparer les données
  const lignes = transactions.map(t => ({
    'Date':        new Date(t.date).toLocaleString('fr-FR'),
    'Type':        t.kind === 'in' ? 'Entrée' : 'Sortie',
    'Catégorie':   t.category,
    'Description': t.description || '',
    'Saisi par':   t.by,
    'Montant (FCFA)': t.kind === 'in' ? t.amount : -t.amount,
  }))

  // Ligne de total
  const totalIn  = transactions.filter(t => t.kind === 'in').reduce((s,t) => s + t.amount, 0)
  const totalOut = transactions.filter(t => t.kind === 'out').reduce((s,t) => s + t.amount, 0)

  lignes.push({})  // ligne vide
  lignes.push({
    'Date': 'TOTAL',
    'Type': '',
    'Catégorie': '',
    'Description': '',
    'Saisi par': '',
    'Montant (FCFA)': totalIn - totalOut,
  })
  lignes.push({ 'Date': 'Total entrées',  'Montant (FCFA)': totalIn  })
  lignes.push({ 'Date': 'Total sorties',  'Montant (FCFA)': -totalOut })

  // Créer le fichier Excel
  const ws = XLSX.utils.json_to_sheet(lignes)

  // Largeur des colonnes
  ws['!cols'] = [
    { wch: 20 }, // Date
    { wch: 10 }, // Type
    { wch: 22 }, // Catégorie
    { wch: 28 }, // Description
    { wch: 16 }, // Saisi par
    { wch: 16 }, // Montant
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Rapport')

  // Nom du fichier
  const now = new Date()
  const nomFichier = `rapport_cybercafe_${periode}_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}.xlsx`

  XLSX.writeFile(wb, nomFichier)
}