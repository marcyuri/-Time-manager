import { useEffect, useState } from 'react'
import {
  createTaskTemplate,
  getTaskTemplates,
  removeTaskTemplate,
  updateTaskTemplate,
} from '../services/templateService'

/**
 * Hook de gestion des modèles de tâches.
 *
 * Il permet de :
 * - charger les modèles depuis le localStorage ;
 * - créer un nouveau modèle ;
 * - supprimer un modèle existant ;
 * - exposer une erreur si une opération échoue.
 *
 * @returns {{
 *   templates: Array<Object>,
 *   templateError: string,
 *   createTemplate: Function,
 *   deleteTemplate: Function
 * }}
 */
export function useTaskTemplates() {
  const [templates, setTemplates] = useState([])
  const [templateError, setTemplateError] = useState('')

  useEffect(() => {
    getTaskTemplates()
      .then(setTemplates)
      .catch(() =>
        setTemplateError(
          'Erreur lors du chargement des modèles.'
        )
      )
  }, [])

  /**
   * Crée un modèle de tâche à partir des données du formulaire.
   *
   * @param {Object} templateData - Données du modèle.
   * @param {string} templateData.title - Titre du modèle.
   * @param {string} [templateData.description] - Description.
   * @param {number} templateData.duration - Durée en minutes.
   * @param {string} templateData.priority - Priorité.
   *
   * @returns {Promise<boolean>} true si la création réussit.
   */
  async function createTemplate(templateData) {
    try {
      setTemplateError('')

      const createdTemplate =
        await createTaskTemplate(templateData)

      setTemplates((currentTemplates) => [
        ...currentTemplates,
        createdTemplate,
      ])

      return true
    } catch (error) {
      console.error(error)

      setTemplateError(
        'Erreur lors de la création du modèle.'
      )

      return false
    }
  }

  /**
   * Supprime un modèle de tâche.
   *
   * @param {string} templateId - Identifiant du modèle.
   * @returns {Promise<boolean>} true si la suppression réussit.
   */
  async function deleteTemplate(templateId) {
    try {
      setTemplateError('')

      await removeTaskTemplate(templateId)

      setTemplates((currentTemplates) =>
        currentTemplates.filter(
          (template) => template.id !== templateId
        )
      )

      return true
    } catch (error) {
      console.error(error)

      setTemplateError(
        'Erreur lors de la suppression du modèle.'
      )

      return false
    }
  }

  /**
     * Modifie un modèle existant.
     *
     * @param {string} templateId - Identifiant du modèle.
     * @param {Object} templateData - Nouvelles données.
     *
     * @returns {Promise<boolean>}
     */
    async function editTemplate(
    templateId,
    templateData
    ) {

    try {

        setTemplateError('')

        const updatedTemplate =
        await updateTaskTemplate(
            templateId,
            templateData
        )

        setTemplates((currentTemplates) =>
        currentTemplates.map((template) =>
            template.id === templateId
            ? updatedTemplate
            : template
        )
        )

        return true

    } catch (error) {

        console.error(error)

        setTemplateError(
        'Erreur lors de la modification du modèle.'
        )

        return false
    }
    }

  return {
    templates,
    templateError,
    createTemplate,
    deleteTemplate,
    editTemplate,
  }
}