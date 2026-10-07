import XLSX from 'xlsx'

const filePath = 'C:/Users/MUKHAMMAD ALFAEN F/Downloads/PWT_DATA QRIS (3) (1).xlsx'
const wb = XLSX.readFile(filePath)
const sheet = wb.Sheets['Transaksi']
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

for (let r = 13; r <= 16; r++) {
  const kab = rows[r][3]
  console.log(`\n${kab} Raw values:`)
  let s = 0
  for (let c = 40; c <= 47; c++) {
    const v = Number(rows[r][c])
    s += v
    console.log(`  Col ${c}: ${v}`)
  }
  console.log(`  Sum: ${s} (round: ${Math.round(s)})`)
}
console.log('\nRow 17 (Total Bulanan raw):')
let s17 = 0
for (let c = 40; c <= 47; c++) {
  const v = Number(rows[17][c])
  s17 += v
  console.log(`  Col ${c}: ${v} (round: ${Math.round(v)})`)
}
console.log(`  Sum: ${s17} (round: ${Math.round(s17)})`)

console.log('\nRow 18 (Kumulatif raw):')
for (let c = 40; c <= 47; c++) {
  const v = Number(rows[18][c])
  console.log(`  Col ${c}: ${v} (round: ${Math.round(v)})`)
}
