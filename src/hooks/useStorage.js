/**
 * useStorage — abstraction over localStorage pour le web,
 * ou window.storage (Claude artifact API) si disponible.
 *
 * Dans un vrai déploiement, remplacer par une API backend (REST/Firebase/Supabase).
 */

const PREFIX = 'ccg_'

function getStorage() {
  // Claude artifact environment
  if (typeof window !== 'undefined' && window.storage) return 'claude'
  // Standard browser localStorage
  return 'local'
}

export async function storageGet(key) {
  const k = PREFIX + key
  if (getStorage() === 'claude') {
    try {
      const r = await window.storage.get(k, true)
      return r ? JSON.parse(r.value) : null
    } catch { return null }
  } else {
    try {
      const v = localStorage.getItem(k)
      return v ? JSON.parse(v) : null
    } catch { return null }
  }
}

export async function storageSet(key, value) {
  const k = PREFIX + key
  const serialized = JSON.stringify(value)
  if (getStorage() === 'claude') {
    try { await window.storage.set(k, serialized, true) } catch (e) { console.error(e) }
  } else {
    try { localStorage.setItem(k, serialized) } catch (e) { console.error(e) }
  }
}
