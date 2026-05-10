import { PRIORITY_OPTIONS } from '../../data/priorities'
import { Button } from '../ui/Button'

export function Header({ priorityFilter, onFilterChange, onExportImage, onResetTasks, taskCount }) {
  return (
    <header className="app-header">
      <div className="app-header__content">
        <span className="app-header__eyebrow">Time Manager</span>
        <h1>Emploi du temps hebdomadaire</h1>
        <p>Ajoute tes tâches par jour, avec heure de début, durée, priorité et suivi.</p>
      </div>

      <div className="app-header__actions">
        <div className="app-header__stat">
          <strong>{taskCount}</strong>
          <span>tâche{taskCount > 1 ? 's' : ''}</span>
        </div>

        <label className="filter-control">
          <span>Filtrer</span>
          <select value={priorityFilter} onChange={(event) => onFilterChange(event.target.value)}>
            <option value="all">Toutes</option>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </label>

        <Button className="btn--secondary" onClick={onResetTasks}>Vider</Button>
        <Button className="btn--primary" onClick={onExportImage}>Exporter image</Button>
      </div>
    </header>
  )
}
