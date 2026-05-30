export function truncateAddress(value, start = 6, end = 4) {
  if (!value) return 'Non disponible'
  if (value.length <= start + end) return value
  return `${value.slice(0, start)}...${value.slice(-end)}`
}

export function formatNumber(value) {
  if (value === undefined || value === null || value === '') return '-'
  return Number(value).toLocaleString('fr-FR')
}

export function formatDate(timestamp) {
  if (!timestamp) return '-'
  return new Date(Number(timestamp) * 1000).toLocaleString('fr-FR')
}

export function formatRaw(value) {
  if (value === undefined || value === null || value === '') return 'N/A'
  return value.toString()
}

export function formatEth(web3, wei) {
  if (!web3 || wei === undefined || wei === null || wei === '') return '0'
  return Number(web3.utils.fromWei(wei.toString(), 'ether')).toFixed(6).replace(/\.?0+$/, '')
}

export function formatGwei(web3, wei) {
  if (!web3 || wei === undefined || wei === null || wei === '') return 'N/A'
  return Number(web3.utils.fromWei(wei.toString(), 'gwei')).toFixed(6).replace(/\.?0+$/, '')
}
