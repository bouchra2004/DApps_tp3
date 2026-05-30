import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ExercicePage from './pages/ExercicePage.jsx'
import Home from './pages/Home.jsx'
import { exercises } from './data/exercises.js'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {exercises.map((exercise) => (
          <Route
            key={exercise.slug}
            path={`/exercice/${exercise.slug}`}
            element={<ExercicePage exercise={exercise} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
