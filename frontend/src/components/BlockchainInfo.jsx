import { useWeb3 } from '../context/Web3Context.jsx'
import { formatDate, formatNumber, formatRaw } from '../utils/format.js'

function DataSection({ title, children }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-100 px-4 py-2">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  )
}

function DataRow({ label, value }) {
  const displayValue = value === undefined || value === null || value === '' ? 'N/A' : value.toString()

  return (
    <div className="grid gap-1 px-4 py-2.5 text-sm sm:grid-cols-[180px_1fr]">
      <span className="font-bold text-slate-800">{label} :</span>
      <span className="break-all font-semibold text-emerald-700">{displayValue}</span>
    </div>
  )
}

export default function BlockchainInfo({ contractName }) {
  const { account, contracts, lastBlock, networkId, rpcUrl } = useWeb3()
  const contract = contracts[contractName]

  return (
    <section className="card p-5">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Informations de la Blockchain</p>
        <h2 className="text-2xl font-bold text-slate-950">Blockchain</h2>
      </div>

      <div className="space-y-4">
        <DataSection title="Infos du reseau">
          <DataRow label="URL" value={rpcUrl} />
          <DataRow label="ID" value={networkId || 'N/A'} />
        </DataSection>

        <DataSection title="Infos du contrat">
          <DataRow label="Adresse" value={contract?.address ?? 'Contrat non deploye'} />
          <DataRow label="Compte" value={account || 'Aucun compte connecte'} />
        </DataSection>

        <DataSection title="Infos du dernier bloc">
          <DataRow label="N°" value={formatNumber(lastBlock?.number)} />
          <DataRow label="Hash" value={lastBlock?.hash ?? 'N/A'} />
          <DataRow label="Timestamp" value={formatDate(lastBlock?.timestamp)} />
          <DataRow label="parentHash" value={lastBlock?.parentHash ?? 'N/A'} />
          <DataRow label="nonce" value={lastBlock?.nonce ?? 'N/A'} />
          <DataRow label="transactions" value={formatNumber(lastBlock?.transactions?.length ?? 0)} />
          <DataRow label="miner" value={lastBlock?.miner ?? 'N/A'} />
          <DataRow label="difficulty" value={formatRaw(lastBlock?.difficulty)} />
          <DataRow label="gasLimit" value={formatRaw(lastBlock?.gasLimit)} />
          <DataRow label="gasUsed" value={formatRaw(lastBlock?.gasUsed)} />
          <DataRow label="size" value={formatRaw(lastBlock?.size)} />
        </DataSection>
      </div>
    </section>
  )
}
