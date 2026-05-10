# TIME - Gestion d'emploi du temps

Application React/Vite pour gérer un emploi du temps hebdomadaire.

## Fonctionnalités

- Ajouter une tâche dans chaque jour de la semaine.
- Modifier une tâche.
- Supprimer une tâche.
- Marquer une tâche comme terminée.
- Définir l'heure de début.
- Définir la durée.
- Définir une priorité : neutre, assez importante, moyenne, importante.
- Détection de chevauchement d'horaires dans le même jour.
- Filtrer les tâches par priorité.
- Sauvegarde locale automatique avec `localStorage`.
- Exporter le tableau de la semaine sous forme d'image PNG.

## Lancer le frontend

```bash
cd client
npm install
npm run dev
```

## Build frontend

```bash
cd client
npm run build
```

## Lancer le backend optionnel

Le backend Express/PostgreSQL contient déjà des routes CRUD pour les tâches.

```bash
cd server
npm install
node index.js
```

Créer la table PostgreSQL avec :

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

La version frontend actuelle fonctionne déjà sans backend grâce au `localStorage`.
