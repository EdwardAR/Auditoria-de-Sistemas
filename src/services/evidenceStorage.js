const DATABASE_NAME = 'audit360_evidence_v1'
const STORE_NAME = 'files'
export const MAX_EVIDENCE_SIZE = 10 * 1024 * 1024
export const ALLOWED_EVIDENCE_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'png', 'jpg', 'jpeg']
export const ALLOWED_EVIDENCE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
]

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error('IndexedDB no está disponible en este navegador.'))
    const request = indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('No se pudo abrir el almacén de evidencias.'))
  })
}

function transaction(mode, operation) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, mode)
    const store = tx.objectStore(STORE_NAME)
    const request = operation(store)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('No se pudo completar la operación de evidencia.'))
    tx.oncomplete = () => database.close()
  }))
}

export function validateEvidenceFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_EVIDENCE_EXTENSIONS.includes(extension) || !ALLOWED_EVIDENCE_TYPES.includes(file.type)) throw new Error('Formato no permitido. Usa PDF, DOCX, XLSX, PNG o JPG.')
  if (file.size > MAX_EVIDENCE_SIZE) throw new Error('El archivo supera el límite de 10 MB.')
}

export async function saveEvidenceFile(id, file) {
  validateEvidenceFile(file)
  await transaction('readwrite', (store) => store.put(file, id))
}

export async function getEvidenceFile(id) {
  return transaction('readonly', (store) => store.get(id))
}

export async function deleteEvidenceFile(id) {
  return transaction('readwrite', (store) => store.delete(id))
}
