# Tasks API - Documentation Swagger

## 🚀 Démarrage

Pour accéder à la documentation Swagger de l'API :

1. **Démarrer le serveur :**
   ```bash
   npm start
   ```

2. **Ouvrir Swagger UI dans ton navigateur :**
   ```
   http://localhost:3000/api-docs
   ```

## 📚 Documentation API

La documentation interactive Swagger te permet de :

- ✅ Visualiser toutes les routes disponibles
- ✅ Tester les endpoints directement depuis le navigateur
- ✅ Voir les schémas des données (request/response)
- ✅ Comprendre les paramètres requis et optionnels

## 🎯 Endpoints disponibles

### Tasks
- `GET /tasks` - Liste toutes les tâches (avec filtres et pagination)
- `POST /tasks` - Crée une nouvelle tâche
- `GET /tasks/{id}` - Récupère une tâche par ID
- `PATCH /tasks/{id}` - Met à jour une tâche
- `DELETE /tasks/{id}` - Supprime une tâche

### Users
- `GET /users` - Liste tous les utilisateurs
- `POST /users` - Crée un nouvel utilisateur
- `GET /users/{id}` - Récupère un utilisateur avec ses tâches
- `PATCH /users/{id}` - Met à jour un utilisateur
- `DELETE /users/{id}` - Supprime un utilisateur

## 🔧 Filtres disponibles (Tasks)

- `?done=true` ou `?done=false` - Filtrer par statut
- `?titre=recherche` - Rechercher par titre
- `?retard=true` ou `?retard=false` - Filtrer les tâches en retard
- `?page=2` - Pagination (10 éléments par page)

## 📝 Exemples de requêtes

### Créer une tâche
```json
POST /tasks
{
  "titre": "Faire les courses",
  "description": "Acheter du pain et du lait",
  "done": false,
  "datetime": "2025-11-05T10:00:00",
  "UserId": 1
}
```

### Créer un utilisateur
```json
POST /users
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

## 🛠️ Modifier le Swagger

Le fichier de configuration Swagger se trouve dans :
```
/swagger.json
```

Tu peux le modifier pour ajouter de nouvelles routes ou mettre à jour la documentation.

## 📦 Dépendances installées

- `swagger-ui-express` - Interface Swagger UI pour Express

## 🌐 Liens utiles

- Documentation Swagger : http://localhost:3000/api-docs
- API Base URL : http://localhost:3000
