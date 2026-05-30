import { Outlet } from 'react-router-dom'
import { Activity, GraduationCap, Wallet } from 'lucide-react'
import { useWeb3 } from '../context/Web3Context.jsx'
import { truncateAddress } from '../utils/format.js'

export default function Layout() {
  const { account, balance, connectWallet, networkId, status } = useWeb3()

  return (
    <div className="min-h-screen bg-canvas text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white shadow-soft">
              <GraduationCap size={22} />
            </div>
            <h1 className="text-lg font-bold text-slate-950">DApps_tp3</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              <Activity size={16} />
              {status} {networkId && <span className="text-emerald-500">#{networkId}</span>}
            </div>
            <button type="button" onClick={connectWallet} className="btn-secondary">
              <Wallet size={16} />
              {account ? truncateAddress(account) : 'Connecter MetaMask'}
              {account && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{balance} ETH</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
