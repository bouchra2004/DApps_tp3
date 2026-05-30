import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { exercises } from '../data/exercises.js'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Sommaire interactif du TP3</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Selectionnez un exercice pour executer ses fonctions Solidity, suivre les blocs Ganache et visualiser la derniere transaction.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {exercises.map((exercise) => (
          <Link
            key={exercise.slug}
            to={`/exercice/${exercise.slug}`}
            className="card group p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <div className="mb-5 flex items-start justify-between">
              <span className={`rounded-md px-3 py-1 text-xs font-bold ${exercise.accent}`}>Exercice {exercise.number}</span>
              <ArrowUpRight size={18} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-800" />
            </div>
            <h3 className="text-lg font-bold text-slate-950">{exercise.title}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{exercise.description}</p>
            <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">{exercise.contract}.sol</div>
          </Link>
        ))}
      </section>
    </div>
  )
}
