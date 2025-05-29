# Production Management System - Frontend

## 📋 Description

Système de gestion de production industrielle développé en React avec Material-UI. Cette application permet le suivi complet des processus de production, du contrôle qualité et de la traçabilité des lots.

## 🚀 Fonctionnalités Principales

### 👥 Gestion des Utilisateurs
- **Rôles** : Administrateur et Opérateur
- **Authentification** sécurisée avec gestion de session
- **Permissions** différenciées selon les rôles

### 🏭 Flux de Production
1. **Scan de Production** - Démarrage d'un nouveau lot
2. **Recette & Instructions** - Consultation des procédures
3. **Saisie des Ingrédients** - Enregistrement des quantités utilisées
4. **Contrôle Qualité** - Tests personnalisés par produit
5. **Finalisation** - Validation et clôture du lot

### 📊 Gestion et Analyse
- **Dashboard** en temps réel avec statistiques
- **Gestion des Produits** avec tests qualité configurables
- **Historique des Lots** avec traçabilité complète
- **Rapports et Analyses** détaillés

### 🔍 Contrôle Qualité
- **Tests personnalisés** par produit :
  - Tests numériques (pH, poids, température)
  - Sélections (apparence, odeur, viscosité)
  - Tests booléens (conforme/non conforme)
- **Validation automatique** selon les critères définis
- **Traçabilité complète** des résultats

## 🛠️ Technologies Utilisées

- **React** 19.1.0 - Framework JavaScript
- **Material-UI** 5.17.1 - Interface utilisateur
- **React Router** 6.30.1 - Navigation
- **Axios** 1.9.0 - Requêtes HTTP
- **Date-fns** 2.30.0 - Manipulation des dates

## 📦 Installation

### Prérequis
- Node.js >= 16.0.0
- npm >= 8.0.0

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone https://github.com/your-org/production-management-frontend.git
cd production-management-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Modifier les variables selon votre configuration
nano .env
```

4. **Démarrer l'application**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Configuration API
REACT_APP_API_URL=http://localhost:5000

# Configuration de l'application
REACT_APP_NAME="Production Management System"
REACT_APP_VERSION="1.0.0"

# Configuration de débogage (development only)
REACT_APP_DEBUG=true
```

### Structure des dossiers

```
src/
├── components/          # Composants réutilisables
│   ├── Navigation.js    # Navigation principale
│   ├── ProtectedRoute.js # Protection des routes
│   └── LoadingScreen.js # Écran de chargement
├── pages/              # Pages de l'application
│   ├── Login.js        # Page de connexion
│   ├── Dashboard.js    # Tableau de bord
│   ├── ProductionScan.js # Scan de production
│   ├── ProductionRecipe.js # Recettes
│   ├── ProductionIngredients.js # Ingrédients
│   ├── QualityControl.js # Contrôle qualité
│   ├── ProductionComplete.js # Finalisation
│   ├── ProductsManagement.js # Gestion produits
│   ├── BatchesManagement.js # Gestion lots
│   └── Reports.js      # Rapports
├── config/             # Configuration
│   └── appConfig.js    # Configuration globale
├── utils/              # Utilitaires
│   └── helpers.js      # Fonctions utilitaires
├── App.js              # Composant principal
└── index.js            # Point d'entrée
```

## 👤 Comptes de Démonstration

### Administrateur
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin`
- **Accès** : Toutes les fonctionnalités

### Opérateur
- **Nom d'utilisateur** : `operator`
- **Mot de passe** : `operator`
- **Accès** : Production et dashboard uniquement

## 🔧 Scripts Disponibles

```bash
# Démarrage en mode développement
npm start

# Construction pour la production
npm build

# Tests unitaires
npm test

# Linting du code
npm run lint
npm run lint:fix

# Formatage du code
npm run format

# Analyse du bundle
npm run analyze
```

## 📱 Interface Utilisateur

### Dashboard
- **Statistiques** en temps réel
- **Productions en cours** avec progression
- **Lots récents** avec statuts
- **Alertes qualité** et notifications

### Flux de Production
1. **Scan** - Code QR/manuel avec génération automatique du numéro de lot
2. **Recette** - Instructions détaillées avec ingrédients et consignes
3. **Ingrédients** - Saisie avec calcul automatique des écarts
4. **Qualité** - Tests personnalisés avec validation
5. **Finalisation** - Résumé complet et confirmation

### Gestion (Admin)
- **Produits** - CRUD complet avec tests qualité configurables
- **Lots** - Historique avec traçabilité détaillée
- **Rapports** - Analyses des temps et de la qualité

## 🔒 Sécurité

- **Authentification** par rôles
- **Sessions** avec expiration automatique (8h)
- **Routes protégées** selon les permissions
- **Validation** côté client et serveur

## 📊 Fonctionnalités Avancées

### Contrôle Qualité Personnalisé
- Configuration flexible des tests par produit
- Types de tests variés (numérique, sélection, booléen)
- Validation automatique avec seuils configurables
- Traçabilité complète des résultats

### Génération Automatique des Lots
- Format configurable : `{PRODUIT}-{YYYYMMDD}-{SEQUENCE}`
- Séquence automatique par jour et produit
- Évitement des doublons

### Rapports et Analyses
- **Temps de production** par produit et opérateur
- **Taux de conformité** avec tendances
- **Performance des opérateurs**
- **Analyse des problèmes** récurrents

## 🔄 API Integration

L'application communique avec une API REST. Les endpoints principaux :

```
GET    /api/products              # Liste des produits
POST   /api/products              # Création d'un produit
GET    /api/batches               # Liste des lots
POST   /api/batches               # Création d'un lot
GET    /api/dashboard/stats       # Statistiques du dashboard
POST   /api/auth/login            # Authentification
```

## 🚧 Développement

### Ajout d'une nouvelle page

1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `App.js`
3. Mettre à jour la navigation si nécessaire
4. Ajouter les permissions si requises

### Ajout d'un nouveau test qualité

1. Ajouter le type dans `config/appConfig.js`
2. Mettre à jour le formulaire dans `ProductsManagement.js`
3. Implémenter la validation dans `QualityControl.js`

## 🐛 Dépannage

### Problèmes courants

**Erreur de CORS**
- Vérifier la configuration du serveur backend
- S'assurer que l'URL de l'API est correcte dans `.env`

**Session expirée**
- Les sessions expirent après 8 heures
- Se reconnecter pour renouveler la session

**Tests qualité non visibles**
- Vérifier que les tests sont bien configurés pour le produit
- S'assurer que les types de tests sont supportés

## 📈 Améliorations Futures

- [ ] **Notifications push** en temps réel
- [ ] **Mode hors ligne** pour les opérateurs
- [ ] **Scan QR/Code-barres** avec caméra
- [ ] **Export Excel** des rapports
- [ ] **Graphiques** interactifs pour les analyses
- [ ] **API GraphQL** pour optimiser les requêtes
- [ ] **PWA** pour l'utilisation mobile

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- **Issues** : [GitHub Issues](https://github.com/your-org/production-management-frontend/issues)
- **Email** : support@production-management.com
- **Documentation** : [Wiki du projet](https://github.com/your-org/production-management-frontend/wiki)

---

**Version** :