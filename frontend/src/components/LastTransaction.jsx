import { CheckCircle2, XCircle } from 'lucide-react'
import { useWeb3 } from '../context/Web3Context.jsx'
import { formatDate, formatEth, formatGwei, formatRaw } from '../utils/format.js'

function TxRow({ label, value }) {
  const displayValue = value === undefined || value === null || value === '' ? 'N/A' : value.toString()

  return (
    <div className="grid gap-1 px-4 py-2.5 text-sm sm:grid-cols-[190px_1fr]">
      <span className="font-bold text-slate-800">{label} :</span>
      <span className="break-all font-semibold text-emerald-700">{displayValue}</span>
    </div>
  )
}

export default function LastTransaction() {
  const { lastTransaction, web3 } = useWeb3()
  const transaction = lastTransaction ?? {}

  return (
    <section className="card p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Details de la derniere transaction</p>
          <h2 className="text-2xl font-bold text-slate-950">Transactions {lastTransaction ? `(${lastTransaction.number})` : '(0)'}</h2>
        </div>
        {lastTransaction && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${lastTransaction.status ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {lastTransaction.status ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {lastTransaction.status ? 'Succes' : 'Echec'}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-100 px-4 py-2">
          <h3 className="text-sm font-bold text-slate-800">Transaction #{lastTransaction?.number ?? 'N/A'}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <TxRow label="Numero" value={transaction.number} />
          <TxRow label="Expediteur (From)" value={transaction.from} />
          <TxRow label="Destinataire (To)" value={transaction.to} />
          <TxRow label="Hash de transaction" value={transaction.hash} />
          <TxRow label="Nonce" value={formatRaw(transaction.nonce)} />
          <TxRow label="Montant" value={lastTransaction ? `${formatEth(web3, transaction.valueWei)} ETH` : 'N/A'} />
          <TxRow label="Frais de transaction (Gas)" value={lastTransaction ? `${formatGwei(web3, transaction.gasPriceWei)} Gwei` : 'N/A'} />
          <TxRow label="Limite de Gas" value={formatRaw(transaction.gasLimit)} />
          <TxRow label="Gas utilise" value={formatRaw(transaction.gasUsed)} />
          <TxRow label="Solde apres transaction" value={lastTransaction ? `${formatEth(web3, transaction.balanceAfterWei)} ETH` : 'N/A'} />
          <TxRow label="Statut" value={lastTransaction ? (transaction.status ? 'Succes' : 'Echec') : 'N/A'} />
          <TxRow label="Numero du Bloc" value={formatRaw(transaction.blockNumber)} />
          <TxRow label="Horodatage" value={lastTransaction ? formatDate(transaction.timestamp) : 'N/A'} />
          <TxRow label="Fonction appelee" value={transaction.functionName} />
          <TxRow label="Nom du contrat" value={transaction.contractName} />
        </div>
      </div>
    </section>
  )
}
