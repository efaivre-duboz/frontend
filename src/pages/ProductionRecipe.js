import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Card,
    CardContent,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Assignment as RecipeIcon,
    PlayArrow,
    CheckCircle,
    Schedule,
    Person,
    Inventory,
    Info,
    Warning,
    ExpandMore,
    Science
} from '@mui/icons-material';
import { useAuth } from '../App';

function ProductionRecipe({ batchData, productData, onContinue }) {
    const [readyToProceed, setReadyToProceed] = useState(false);
    const [startTime] = useState(new Date());
    const { user } = useAuth();

    const steps = ['Recette & Instructions', 'Saisie Ingrédients', 'Contrôle Qualité', 'Finalisation'];

    // Données par défaut si pas de données passées
    const defaultBatch = batchData || {
        batchNumber: 'DEMO-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-001',
        productCode: 'PROD001',
        quantity: 100,
        operatorName: user?.name,
        status: 'in_progress',
        startTime: new Date().toISOString()
    };

    const defaultProduct = productData || {
        name: 'Produit Démonstration',
        code: 'PROD001',
        description: 'Produit de test pour démonstration du système',
        recipe: {
            instructions: `Instructions détaillées pour la production du ${defaultBatch.productCode}:

1. PRÉPARATION DE L'ENVIRONNEMENT
   - Vérifier la propreté de la zone de travail
   - S'assurer que tous les équipements sont fonctionnels
   - Porter les équipements de protection individuelle (EPI)
   - Vérifier la température ambiante (18-25°C)

2. PRÉPARATION DES INGRÉDIENTS
   - Peser tous les ingrédients selon les quantités indiquées
   - Vérifier la qualité et la date d'expiration de chaque ingrédient
   - Disposer les ingrédients dans l'ordre d'utilisation
   - Préchauffer les équipements si nécessaire

3. PROCESSUS DE MÉLANGE - PHASE 1
   - Commencer par les ingrédients secs dans le mélangeur principal
   - Mélanger à vitesse lente (niveau 1) pendant 2 minutes
   - Vérifier l'homogénéité du mélange sec

4. PROCESSUS DE MÉLANGE - PHASE 2  
   - Ajouter progressivement les liquides en 3 étapes
   - Première étape : 50% du volume liquide, mélanger 3 minutes
   - Deuxième étape : 30% du volume liquide, mélanger 2 minutes
   - Troisième étape : 20% restant, mélanger 1 minute

5. CONTRÔLE INTERMÉDIAIRE
   - Arrêter le mélangeur et vérifier la consistance
   - Prélever un échantillon pour contrôle visuel
   - Ajuster la viscosité si nécessaire
   - Nettoyer les parois du mélangeur avec une spatule

6. FINALISATION
   - Mélange final à vitesse modérée pendant 5 minutes
   - Contrôle visuel de l'homogénéité
   - Prélèvement d'échantillon pour les tests qualité
   - Arrêt de la production et nettoyage des outils`,
            estimatedTime: 45,
            difficulty: 'Moyen',
            ingredients: [
                { name: 'Base lavante douce', quantity: 500, unit: 'ml', description: 'Composant principal liquide, température ambiante' },
                { name: 'Actif hydratant', quantity: 50, unit: 'ml', description: 'Agent moisturisant concentré' },
                { name: 'Conservateur naturel', quantity: 10, unit: 'ml', description: 'Système de conservation sans parabènes' },
                { name: 'Colorant alimentaire', quantity: 5, unit: 'g', description: 'Colorant bleu E133, dosage précis requis' },
                { name: 'Parfum naturel', quantity: 15, unit: 'ml', description: 'Fragrance hypoallergénique' }
            ],
            equipment: [
                'Mélangeur industriel 50L',
                'Balance de précision (±0.1g)',
                'Béchers gradués (500ml, 100ml, 50ml)',
                'Spatule en inox alimentaire',
                'Thermomètre digital',
                'pH-mètre étalonné'
            ],
            safetyNotes: [
                'Porter des gants nitrile obligatoire',
                'Utiliser des lunettes de sécurité',
                'Assurer une ventilation adéquate (extraction d\'air)',
                'Éviter tout contact avec la peau et les yeux',
                'Avoir une douche oculaire accessible',
                'Garder les fiches de sécurité à portée de main'
            ]
        }
    };

    useEffect(() => {
        // Simuler la lecture des instructions (on pourrait tracker le temps)
        const timer = setTimeout(() => {
            setReadyToProceed(true);
        }, 3000); // L'utilisateur doit rester 3 secondes minimum

        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        const updatedBatch = {
            ...defaultBatch,
            currentStep: 'ingredients',
            recipeViewedAt: new Date().toISOString(),
            recipeViewDuration: Math.round((new Date() - startTime) / 1000) // en secondes
        };

        console.log('📋 Recette consultée, passage aux ingrédients');
        if (onContinue) {
            onContinue(updatedBatch, defaultProduct);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* En-tête avec stepper */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Recette & Instructions
                </Typography>
                
                {/* Stepper de progression */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Stepper activeStep={0} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel 
                                    StepIconComponent={index === 0 ? 
                                        () => <CheckCircle color="primary" /> : 
                                        undefined
                                    }
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper>

                {/* Informations du lot */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <RecipeIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Lot de Production
                                        </Typography>
                                        <Typography variant="h6">
                                            {defaultBatch.batchNumber}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Produit
                                </Typography>
                                <Typography variant="body1">
                                    {defaultProduct.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {defaultProduct.code}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Quantité
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    {defaultBatch.quantity}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Opérateur
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person fontSize="small" />
                                    <Typography variant="body2">
                                        {defaultBatch.operatorName}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Temps Estimé
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Schedule fontSize="small" color="primary" />
                                    <Typography variant="body1">
                                        {defaultProduct.recipe.estimatedTime} min
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>

            <Grid container spacing={3}>
                {/* Instructions principales */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            📋 Instructions de Production
                        </Typography>
                        <Box sx={{ 
                            backgroundColor: '#f8f9fa', 
                            p: 3, 
                            borderRadius: 2,
                            border: '1px solid #e9ecef',
                            whiteSpace: 'pre-line',
                            fontFamily: 'Roboto Mono, monospace',
                            fontSize: '0.9rem',
                            lineHeight: 1.8,
                            maxHeight: '500px',
                            overflowY: 'auto'
                        }}>
                            {defaultProduct.recipe.instructions}
                        </Box>
                    </Paper>

                    {/* Équipements requis */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Science color="primary" />
                                <Typography variant="h6">
                                    Équipements Requis
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {defaultProduct.recipe.equipment.map((equipment, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            p: 2,
                                            backgroundColor: '#f0f8ff',
                                            borderRadius: 1,
                                            border: '1px solid #b3d9ff'
                                        }}>
                                            <Inventory fontSize="small" color="primary" />
                                            <Typography variant="body2">
                                                {equipment}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* Panneau latéral */}
                <Grid item xs={12} md={4}>
                    {/* Ingrédients */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            🧪 Ingrédients Requis
                        </Typography>
                        <List dense>
                            {defaultProduct.recipe.ingredients.map((ingredient, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {ingredient.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body1" color="primary" fontWeight="bold">
                                                    {ingredient.quantity} {ingredient.unit}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {ingredient.description}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    {/* Consignes de sécurité */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
                            ⚠️ Consignes de Sécurité
                        </Typography>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                                Respecter impérativement ces consignes
                            </Typography>
                        </Alert>
                        <List dense>
                            {defaultProduct.recipe.safetyNotes.map((note, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Warning color="warning" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={note}
                                        primaryTypographyProps={{ 
                                            variant: 'body2',
                                            fontWeight: 'medium'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    {/* Informations complémentaires */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            ℹ️ Informations
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Niveau de Difficulté
                            </Typography>
                            <Chip 
                                label={defaultProduct.recipe.difficulty}
                                color="primary"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Début de Production
                            </Typography>
                            <Typography variant="body2">
                                {new Date(defaultBatch.startTime).toLocaleString('fr-FR')}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                Temps Écoulé
                            </Typography>
                            <Typography variant="body2" color="primary">
                                {Math.round((new Date() - new Date(defaultBatch.startTime)) / 60000)} min
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Actions */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Alert 
                    severity={readyToProceed ? "success" : "info"}
                    sx={{ flex: 1, mr: 3 }}
                >
                    {readyToProceed ? 
                        "✅ Instructions consultées - Vous pouvez continuer" :
                        "📖 Lisez attentivement les instructions avant de continuer"
                    }
                </Alert>
                
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleContinue}
                    disabled={!readyToProceed}
                    startIcon={<PlayArrow />}
                    sx={{ minWidth: 250 }}
                >
                    {readyToProceed ? 
                        "Continuer vers les Ingrédients" : 
                        "Lecture en cours..."
                    }
                </Button>
            </Box>
        </Container>
    );
}

export default ProductionRecipe;