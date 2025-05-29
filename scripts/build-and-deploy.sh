#!/bin/bash

# Script de build et déploiement pour Production Management System
# Usage: ./scripts/build-and-deploy.sh [environment]
# Environments: development, staging, production

set -e  # Exit on any error

# Configuration
PROJECT_NAME="production-management-frontend"
BUILD_DIR="build"
BACKUP_DIR="backups"
LOG_FILE="deploy.log"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour logger
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Vérification des prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//')
    REQUIRED_NODE="16.0.0"
    
    if ! printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1 | grep -q "^$REQUIRED_NODE"; then
        error "Node.js version $REQUIRED_NODE ou supérieure requise. Version actuelle: $NODE_VERSION"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        error "npm n'est pas installé"
        exit 1
    fi
    
    success "Prérequis validés"
}

# Installation des dépendances
install_dependencies() {
    log "Installation des dépendances..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    success "Dépendances installées"
}

# Tests
run_tests() {
    log "Exécution des tests..."
    
    # Tests unitaires
    npm test -- --coverage --watchAll=false
    
    # Linting
    npm run lint
    
    success "Tests réussis"
}

# Build de l'application
build_application() {
    local env=$1
    log "Build de l'application pour l'environnement: $env"
    
    # Configuration de l'environnement
    case $env in
        "development")
            export NODE_ENV=development
            export REACT_APP_ENV=development
            ;;
        "staging")
            export NODE_ENV=production
            export REACT_APP_ENV=staging
            export REACT_APP_API_URL="https://api-staging.production-management.com"
            ;;
        "production")
            export NODE_ENV=production
            export REACT_APP_ENV=production
            export REACT_APP_API_URL="https://api.production-management.com"
            export REACT_APP_DEBUG=false
            ;;
        *)
            warning "Environnement non reconnu, utilisation de development par défaut"
            export NODE_ENV=development
            export REACT_APP_ENV=development
            ;;
    esac
    
    # Nettoyer le dossier build précédent
    if [ -d "$BUILD_DIR" ]; then
        rm -rf $BUILD_DIR
    fi
    
    # Build
    npm run build
    
    # Vérifier que le build s'est bien passé
    if [ ! -d "$BUILD_DIR" ]; then
        error "Le build a échoué, dossier build non créé"
        exit 1
    fi
    
    success "Build terminé avec succès"
}

# Analyse du bundle
analyze_bundle() {
    log "Analyse de la taille du bundle..."
    
    # Installer l'analyseur de bundle si nécessaire
    if ! command -v npx serve &> /dev/null; then
        npm install -g serve
    fi
    
    # Afficher la taille des fichiers
    echo "Taille des fichiers principaux:"
    find $BUILD_DIR/static -name "*.js" -o -name "*.css" | head -10 | while read file; do
        size=$(du -h "$file" | cut -f1)
        echo "  $file: $size"
    done
    
    # Taille totale du build
    total_size=$(du -sh $BUILD_DIR | cut -f1)
    log "Taille totale du build: $total_size"
}

# Backup de la version précédente
backup_previous_version() {
    if [ -d "$BACKUP_DIR" ]; then
        log "Sauvegarde de la version précédente..."
        
        timestamp=$(date +%Y%m%d_%H%M%S)
        backup_name="backup_${timestamp}"
        
        mkdir -p "$BACKUP_DIR/$backup_name"
        
        if [ -d "$BUILD_DIR" ]; then
            cp -r $BUILD_DIR "$BACKUP_DIR/$backup_name/"
            success "Backup créé: $BACKUP_DIR/$backup_name"
        fi
    fi
}

# Déploiement local pour test
deploy_local() {
    log "Déploiement local pour test..."
    
    # Démarrer le serveur local
    if command -v serve &> /dev/null; then
        log "Serveur disponible sur http://localhost:3000"
        serve -s $BUILD_DIR -l 3000
    else
        warning "Serve n'est pas installé. Installer avec: npm install -g serve"
    fi
}

# Déploiement sur serveur (exemple avec rsync)
deploy_remote() {
    local env=$1
    local server_config
    
    case $env in
        "staging")
            server_config="user@staging-server.com:/var/www/production-management-staging"
            ;;
        "production")
            server_config="user@production-server.com:/var/www/production-management"
            ;;
        *)
            error "Configuration serveur non définie pour l'environnement: $env"
            exit 1
            ;;
    esac
    
    log "Déploiement sur $env: $server_config"
    
    # Vérifier la connectivité SSH
    server_host=$(echo $server_config | cut -d':' -f1)
    if ! ssh -o ConnectTimeout=5 $server_host exit; then
        error "Impossible de se connecter au serveur: $server_host"
        exit 1
    fi
    
    # Déploiement avec rsync
    rsync -avz --delete $BUILD_DIR/ $server_config/
    
    success "Déploiement terminé sur $env"
}

# Nettoyage
cleanup() {
    log "Nettoyage..."
    
    # Supprimer les fichiers temporaires
    find . -name "*.tmp" -delete
    find . -name "*.log" -mtime +7 -delete
    
    # Nettoyer le cache npm
    npm cache clean --force
    
    success "Nettoyage terminé"
}

# Notifications (optionnel)
send_notification() {
    local status=$1
    local env=$2
    local message=$3
    
    # Exemple avec webhook Slack (à configurer)
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 Deploy $status for $env: $message\"}" \
            $SLACK_WEBHOOK_URL
    fi
    
    # Exemple avec email (à configurer)
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "Deploy $status - $env" admin@production-management.com
    fi
}

# Menu principal
show_menu() {
    echo ""
    echo "=== Production Management System - Build & Deploy ==="
    echo ""
    echo "1) Build Development"
    echo "2) Build Staging"
    echo "3) Build Production"
    echo "4) Build et Test Local"
    echo "5) Build et Deploy Staging"
    echo "6) Build et Deploy Production"
    echo "7) Tests seulement"
    echo "8) Analyse du Bundle"
    echo "9) Nettoyage"
    echo "0) Quitter"
    echo ""
    read -p "Choisissez une option: " choice
}

# Fonction principale
main() {
    local env=${1:-"menu"}
    
    # Créer le fichier de log
    touch $LOG_FILE
    
    log "Début du script de déploiement"
    log "Environnement: $env"
    
    case $env in
        "menu")
            show_menu
            case $choice in
                1) main "development" ;;
                2) main "staging" ;;
                3) main "production" ;;
                4) main "local" ;;
                5) main "deploy-staging" ;;
                6) main "deploy-production" ;;
                7) run_tests ;;
                8) analyze_bundle ;;
                9) cleanup ;;
                0) exit 0 ;;
                *) error "Option invalide" ;;
            esac
            ;;
        "development"|"staging"|"production")
            check_prerequisites
            install_dependencies
            run_tests
            build_application $env
            analyze_bundle
            success "Build $env terminé avec succès!"
            ;;
        "local")
            check_prerequisites
            install_dependencies
            build_application "development"
            deploy_local
            ;;
        "deploy-staging")
            check_prerequisites
            install_dependencies
            run_tests
            backup_previous_version
            build_application "staging"
            deploy_remote "staging"
            send_notification "SUCCESS" "staging" "Application déployée avec succès"
            ;;
        "deploy-production")
            read -p "⚠️  Êtes-vous sûr de vouloir déployer en production? (oui/non): " confirm
            if [ "$confirm" = "oui" ]; then
                check_prerequisites
                install_dependencies
                run_tests
                backup_previous_version
                build_application "production"
                deploy_remote "production"
                send_notification "SUCCESS" "production" "Application déployée avec succès"
            else
                warning "Déploiement en production annulé"
            fi
            ;;
        *)
            error "Environnement non reconnu: $env"
            echo "Usage: $0 [development|staging|production|local|deploy-staging|deploy-production]"
            exit 1
            ;;
    esac
    
    log "Script terminé"
}

# Gestion des signaux
trap 'error "Script interrompu"; exit 1' INT TERM

# Exécution
main "$@"