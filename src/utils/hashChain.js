// Utilitas hash-chain untuk jejak audit tamper-evident.
// Memakai Web Crypto API (crypto.subtle.digest) — SAMA seperti yang dijelaskan di
// dokumen tata kelola BahLink: "Log tindakan admin dirangkai menggunakan hash
// SHA-256 berantai — tiap entri terhubung ke hash entri sebelumnya sehingga
// perubahan pada log lama akan terdeteksi (tamper-evident)."
//
// Setiap entri log menyimpan hash dirinya sendiri (dihitung dari isi entri +
// hash entri sebelumnya). Kalau isi entri lama diubah, hash yang dihitung ulang
// tidak akan cocok lagi dengan hash yang tersimpan → rantai "putus" dan bisa
// dideteksi lewat verifyChain().

const GENESIS_HASH = '0'.repeat(64)

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Membuat entri baru yang terhubung ke hash entri sebelumnya.
export async function appendAuditEntry(chain, { actor, action, note, caseId }) {
  const prevHash = chain.length > 0 ? chain[chain.length - 1].hash : GENESIS_HASH
  const timestamp = new Date().toISOString()
  const payload = JSON.stringify({ caseId, actor, action, note: note ?? '', timestamp, prevHash })
  const hash = await sha256Hex(payload)

  return [...chain, { caseId, actor, action, note: note ?? '', timestamp, prevHash, hash }]
}

// Menghitung ulang seluruh rantai untuk memastikan tidak ada entri yang diubah
// setelah dibuat. Mengembalikan indeks entri pertama yang rantainya putus, atau
// -1 kalau seluruh rantai valid.
export async function verifyChain(chain) {
  let prevHash = GENESIS_HASH
  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i]
    if (entry.prevHash !== prevHash) return i
    const payload = JSON.stringify({
      caseId: entry.caseId,
      actor: entry.actor,
      action: entry.action,
      note: entry.note,
      timestamp: entry.timestamp,
      prevHash: entry.prevHash
    })
    const recomputed = await sha256Hex(payload)
    if (recomputed !== entry.hash) return i
    prevHash = entry.hash
  }
  return -1
}

export function shortHash(hash) {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`
}

export { GENESIS_HASH }