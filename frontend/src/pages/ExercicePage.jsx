import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Play, Send } from 'lucide-react'
import BlockchainInfo from '../components/BlockchainInfo.jsx'
import LastTransaction from '../components/LastTransaction.jsx'
import { useWeb3 } from '../context/Web3Context.jsx'

function initialValues(action) {
  return action.fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? ''
    return acc
  }, {})
}

function stringifyResult(value) {
  if (Array.isArray(value)) return value.map((item) => item?.toString?.() ?? String(item))
  return value?.toString?.() ?? String(value)
}

function ActionForm({ action, contractName }) {
  const { callMethod, sendMethod, web3 } = useWeb3()
  const [values, setValues] = useState(() => initialValues(action))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('Pret a executer cette action.')

  const args = useMemo(() => {
    if (action.argsFromFields) return action.argsFromFields(values)
    return action.fields.filter((field) => field.name !== action.valueField).map((field) => values[field.name])
  }, [action, values])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      let raw
      if (action.type === 'call') {
        raw = await callMethod(contractName, action.method, args)
      } else if (action.type === 'sendWithCall') {
        raw = await callMethod(contractName, action.method, args)
        await sendMethod(contractName, action.method, args, { functionName: action.label })
      } else {
        const value = action.valueField && web3 ? web3.utils.toWei(values[action.valueField] || '0', 'ether') : '0'
        await sendMethod(contractName, action.method, args, { value, functionName: action.label })
        raw = true
      }
      const printable = stringifyResult(raw)
      setResult(action.format ? action.format(printable) : printable)
    } catch (err) {
      setResult(`Erreur: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-950">{action.label}</h3>
            <p className="text-xs uppercase tracking-wide text-slate-400">{action.type === 'call' ? 'Call gratuit' : 'Send transaction'}</p>
          </div>
          <button type="submit" disabled={loading} className={action.type === 'call' ? 'btn-secondary' : 'btn-primary'}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : action.type === 'call' ? <Play size={16} /> : <Send size={16} />}
            Executer
          </button>
        </div>

        {action.fields.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {action.fields.map((field) => (
              <label key={field.name}>
                <span className="label">{field.label}</span>
                <input
                  className="input"
                  type={field.type}
                  step={field.step}
                  value={values[field.name]}
                  onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                />
              </label>
            ))}
          </div>
        )}
      </form>

      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Resultat</p>
        <div className="mt-3 min-h-20 rounded-md border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 text-slate-800 shadow-sm">
          {result}
        </div>
      </aside>
    </div>
  )
}

export default function ExercicePage({ exercise }) {
  const { contracts, error } = useWeb3()
  const deployed = Boolean(contracts[exercise.contract])

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} />
        Sommaire
      </Link>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-white p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`rounded-md px-3 py-1 text-xs font-bold ${exercise.accent}`}>Exercice {exercise.number}</span>
            <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{exercise.contract}.sol</span>
            <span className={`rounded-md px-3 py-1 text-xs font-semibold ${deployed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {deployed ? 'Contrat charge' : 'Migration requise'}
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">{exercise.title}</h2>
          <p className="mt-2 max-w-2xl text-slate-600">{exercise.description}</p>
          {error && <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        </div>

        <div className="space-y-4 p-6">
          {exercise.actions.map((action) => (
            <ActionForm key={`${action.method}-${action.label}`} action={action} contractName={exercise.contract} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <BlockchainInfo contractName={exercise.contract} />
        <LastTransaction />
      </div>
    </div>
  )
}
