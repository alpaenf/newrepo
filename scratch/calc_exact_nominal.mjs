const monthly = {
  "01": {
    Banjarnegara: 72038409810,
    Banyumas: 718123473674,
    Cilacap: 595742148856,
    Purbalingga: 202124153829
  },
  "02": {
    Banjarnegara: 97749519841,
    Banyumas: 685151679343,
    Cilacap: 435608998316,
    Purbalingga: 207181779501
  },
  "03": {
    Banjarnegara: 191873083610,
    Banyumas: 905591157829,
    Cilacap: 380972898559,
    Purbalingga: 237886997167
  },
  "04": {
    Banjarnegara: 128815891517,
    Banyumas: 945930835395,
    Cilacap: 295223894123,
    Purbalingga: 156835719644
  },
  "05": {
    Banjarnegara: 394210668824,
    Banyumas: 1097605722815,
    Cilacap: 497103769130,
    Purbalingga: 178929226883
  },
  "06": {
    Banjarnegara: 173997944106,
    Banyumas: 1042996528295,
    Cilacap: 248996245714,
    Purbalingga: 274338509089
  },
  "07": {
    Banjarnegara: 98747797373,
    Banyumas: 793888372913,
    Cilacap: 265824278323,
    Purbalingga: 318087831126
  },
  "08": {
    Banjarnegara: 81141016375,
    Banyumas: 598105044005,
    Cilacap: 278024578134,
    Purbalingga: 313733216842
  }
}

const kabs = ['Banjarnegara', 'Banyumas', 'Cilacap', 'Purbalingga']
const monthKeys = ['01', '02', '03', '04', '05', '06', '07', '08']

console.log('--- Month by Month Sums ---')
let cumNom = 0
monthKeys.forEach(m => {
  let mSum = 0
  kabs.forEach(k => {
    mSum += monthly[m][k]
  })
  cumNom += mSum
  console.log(`Month ${m}: ${mSum} | Cumul: ${cumNom}`)
})

console.log('\n--- Kabupaten Cumulatives ---')
let kabTotalSum = 0
const kabCum = {}
kabs.forEach(k => {
  let s = 0
  monthKeys.forEach(m => {
    s += monthly[m][k]
  })
  kabCum[k] = s
  kabTotalSum += s
  console.log(`${k}: ${s}`)
})
console.log('Sum of 4 Kab:', kabTotalSum)
console.log('Target:      12912581390959')
console.log('Diff:        ', kabTotalSum - 12912581390959)
