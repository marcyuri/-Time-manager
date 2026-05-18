function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  )
}
const STORAGE_KEY = 'time-manager-task-templates'

/**
 * Récupère les modèles de tâches sauvegardés dans le localStorage.
 *
 * @returns {Array<Object>} Liste des modèles de tâches.
 */
function getStoredTemplates() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)

    if (!data) return []

    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * Sauvegarde les modèles de tâches dans le localStorage.
 *
 * @param {Array<Object>} templates - Liste des modèles à sauvegarder.
 * @returns {void}
 */
function saveStoredTemplates(templates) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(templates)
  )
}

/**
 * Retourne tous les modèles de tâches disponibles.
 *
 * @returns {Promise<Array<Object>>} Liste des modèles.
 */
export async function getTaskTemplates() {
  return getStoredTemplates()
}

/**
 * Crée un nouveau modèle de tâche.
 *
 * @param {Object} template - Données du modèle.
 * @param {string} template.title - Titre du modèle.
 * @param {string} [template.description] - Description optionnelle.
 * @param {number} template.duration - Durée en minutes.
 * @param {string} template.priority - Priorité de la tâche.
 *
 * @returns {Promise<Object>} Modèle créé.
 */
export async function createTaskTemplate(template) {
  const templates = getStoredTemplates()

  const newTemplate = {
    ...template,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }

  const nextTemplates = [
    ...templates,
    newTemplate,
  ]

  saveStoredTemplates(nextTemplates)

  return newTemplate
}

/**
 * Supprime un modèle de tâche.
 *
 * @param {string} id - Identifiant du modèle à supprimer.
 * @returns {Promise<boolean>} Résultat de la suppression.
 */
export async function removeTaskTemplate(id) {
  const templates = getStoredTemplates()

  const nextTemplates = templates.filter(
    (template) => template.id !== id
  )

  saveStoredTemplates(nextTemplates)

  return true
}

/**
 * Modifie un modèle de tâche existant.
 *
 * @param {string} id - Identifiant du modèle.
 * @param {Object} template - Nouvelles données.
 *
 * @returns {Promise<Object>} Modèle mis à jour.
 */
export async function updateTaskTemplate(
  id,
  template
) {

  const templates = getStoredTemplates()

  const updatedTemplate = {
    ...template,
    id,
    updatedAt: new Date().toISOString(),
  }

  const nextTemplates = templates.map(
    (item) =>
      item.id === id
        ? updatedTemplate
        : item
  )

  saveStoredTemplates(nextTemplates)

  return updatedTemplate
}