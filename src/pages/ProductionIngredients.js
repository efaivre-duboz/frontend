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
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    LinearProgress,
    IconButton,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    PlayArrow,
    CheckCircle,
    Warning,
    Save,
    Scale,
    Info,
    Refresh,
    Stop,
    ExpandMore,
    Assignment,
    Pause,
    PlayCircle
} from '@mui/icons-material';
import { useAuth } from '../App';

function ProductionIngredients({ batchData, productData, onContinue }) {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [allIngredientsEntered, setAllIngredientsEntered] = useState(false);
    
    // États pour l'arrêt de production
    const [productionPaused, setProductionPaused] = useState(false);
    const [pauseStartTime, setPauseStartTime] = useState(null);
    const [totalPauseTime, setTotalPauseTime] = useState(0);
    const [showPauseDialog, setShowPauseDialog] = useState(false);
    const [pauseReason, setPauseReason] = useState('');
    const [pauseDetails, setPauseDetails] = useState('');
    const [pauseHistory, setPauseHistory] = useState([]);

    const { user } = useAuth();
    const steps = ['Recette & Instructions', 'Saisie Ingrédients', 'Contrôle Qualité', 'Finalisation'];

    // Données par défaut
    const defaultBatch = batchData || {
        batchNumber: 'DEMO-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-001',
        productCode: 'PROD001',
        quantity: 100,
        operatorName: user?.name,
        status: 'in_progress'
    };

    const defaultProduct = productData || {
        name: 'Produit Démonstration',
        code: 'PROD001',
        baseQuantity: 100, // Quantité de base pour les calculs
        recipe: {
            ingredients: [
                { name: 'Base lavante douce', quantity: 500, unit: 'ml', description: 'Composant principal liquide', tolerance: 25 },
                { name: 'Actif hydratant', quantity: 50, unit: 'ml', description: 'Agent moisturisant', tolerance: 5 },
                { name: 'Conservateur naturel', quantity: 10, unit: 'ml', description: 'Système de conservation', tolerance: 1 },
                { name: 'Colorant alimentaire', quantity: 5, unit: 'g', description: 'Colorant bleu E133', tolerance: 0.5 },
                { name: 'Parfum naturel', quantity: 15, unit: 'ml', description: 'Fragrance hypoallergénique', tolerance: 2 }
            ],
            instructions: `Instructions de production pour ${defaultBatch.quantity} unités :

1. PRÉPARATION DE L'ENVIRONNEMENT
   - Vérifier la propreté de la zone de travail
   - S'assurer que tous les équipements sont fonctionnels
   - Porter les équipements de protection individuelle (EPI)
   - Vérifier la température ambiante (18-25°C)

2. PRÉPARATION DES INGRÉDIENTS
   - Peser tous les ingrédients selon les quantités calculées ci-dessous
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
   - Arrêt de la production et nettoyage des outils

⚠️ IMPORTANT : Respecter scrupuleusement les quantités calculées et les tolérances indiquées.`,
            estimatedTime: 45,
            difficulty: 'Moyen'
        }
    };

    // Calculer le ratio de production
    const productionRatio = defaultBatch.quantity / (defaultProduct.baseQuantity || 100);

    useEffect(() => {
        initializeIngredients();
    }, []);

    useEffect(() => {
        checkAllIngredientsEntered();
    }, [ingredients]);

    const initializeIngredients = () => {
        if (defaultProduct?.recipe?.ingredients) {
            const calculatedIngredients = defaultProduct.recipe.ingredients.map(ingredient => {
                const calculatedQuantity = Math.round((ingredient.quantity * productionRatio) * 100) / 100;
                const calculatedTolerance = Math.round((ingredient.tolerance * productionRatio) * 100) / 100;
                
                return {
                    ...ingredient,
                    originalQuantity: ingredient.quantity,
                    quantity: calculatedQuantity,
                    tolerance: calculatedTolerance,
                    actualQuantity: '',
                    status: 'pending',
                    variance: 0,
                    notes: ''
                };
            });
            setIngredients(calculatedIngredients);
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;

        if (field === 'actualQuantity') {
            const actual = parseFloat(value) || 0;
            const expected = newIngredients[index].quantity;
            const tolerance = newIngredients[index].tolerance || 0;
            
            const variance = expected > 0 ? ((actual - expected) / expected) * 100 : 0;
            newIngredients[index].variance = variance;
            
            if (actual === 0) {
                newIngredients[index].status = 'pending';
            } else if (Math.abs(actual - expected) <= tolerance) {
                newIngredients[index].status = 'entered';
            } else {
                newIngredients[index].status = 'warning';
            }
        }

        setIngredients(newIngredients);
    };

    const checkAllIngredientsEntered = () => {
        const allEntered = ingredients.length > 0 && ingredients.every(ing => 
            ing.actualQuantity && parseFloat(ing.actualQuantity) > 0
        );
        setAllIngredientsEntered(allEntered);
    };

    const handlePauseProduction = () => {
        setShowPauseDialog(true);
    };

    const handleConfirmPause = () => {
        const now = new Date();
        setPauseStartTime(now);
        setProductionPaused(true);
        setShowPauseDialog(false);
        
        // Ajouter à l'historique des pauses
        const pauseRecord = {
            id: Date.now(),
            startTime: now,
            reason: pauseReason,
            details: pauseDetails,
            operator: user?.name
        };
        setPauseHistory(prev => [...prev, pauseRecord]);
        
        // Reset des champs
        setPauseReason('');
        setPauseDetails('');
    };

    const handleResumeProduction = () => {
        if (pauseStartTime) {
            const now = new Date();
            const pauseDuration = Math.round((now - pauseStartTime) / 1000); // en secondes
            setTotalPauseTime(prev => prev + pauseDuration);
            
            // Mettre à jour le dernier record de pause
            setPauseHistory(prev => 
                prev.map((record, index) => 
                    index === prev.length - 1 ? 
                    { ...record, endTime: now, duration: pauseDuration } : 
                    record
                )
            );
        }
        
        setProductionPaused(false);
        setPauseStartTime(null);
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}min ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}min ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const getCurrentPauseDuration = () => {
        if (pauseStartTime) {
            return Math.round((new Date() - pauseStartTime) / 1000);
        }
        return 0;
    };

    const handleSaveIngredients = async () => {
        setSaving(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const updatedBatch = {
                ...defaultBatch,
                currentStep: 'quality_control',
                ingredientsData: ingredients.map(ing => ({
                    name: ing.name,
                    originalQuantity: ing.originalQuantity,
                    calculatedQuantity: ing.quantity,
                    actualQuantity: parseFloat(ing.actualQuantity) || 0,
                    unit: ing.unit,
                    variance: ing.variance,
                    status: ing.status,
                    notes: ing.notes,
                    timestamp: new Date().toISOString(),
                    operatorId: user.id
                })),
                pauseHistory: pauseHistory,
                totalPauseTime: totalPauseTime + (productionPaused ? getCurrentPauseDuration() : 0),
                productionRatio: productionRatio,
                ingredientsCompletedAt: new Date().toISOString()
            };

            console.log('🧪 Ingrédients sauvegardés, passage au contrôle qualité');
            setShowConfirmDialog(false);
            
            if (onContinue) {
                onContinue(updatedBatch, defaultProduct);
            }
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
            setError('Erreur lors de la sauvegarde des ingrédients');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        initializeIngredients();
        setError('');
        setProductionPaused(false);
        setPauseStartTime(null);
        setTotalPauseTime(0);
        setPauseHistory([]);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'entered': return 'success';
            case 'warning': return 'warning';
            case 'pending': return 'default';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'entered': return 'Conforme';
            case 'warning': return 'Attention';
            case 'pending': return 'En attente';
            default: return 'En attente';
        }
    };

    const getVarianceColor = (variance) => {
        if (Math.abs(variance) <= 5) return 'success.main';
        if (Math.abs(variance) <= 10) return 'warning.main';
        return 'error.main';
    };

    const calculateProgress = () => {
        const enteredCount = ingredients.filter(ing => ing.actualQuantity && parseFloat(ing.actualQuantity) > 0).length;
        return ingredients.length > 0 ? (enteredCount / ingredients.length) * 100 : 0;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* En-tête */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Saisie des Ingrédients
                    </Typography>
                    
                    {/* Bouton d'arrêt/reprise de production */}
                    {productionPaused ? (
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<PlayCircle />}
                            onClick={handleResumeProduction}
                            sx={{ minWidth: 200 }}
                        >
                            Reprendre Production
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            startIcon={<Pause />}
                            onClick={handlePauseProduction}
                            sx={{ minWidth: 200 }}
                        >
                            Arrêter Production
                        </Button>
                    )}
                </Box>
                
                {/* Alerte de pause */}
                {productionPaused && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body1" fontWeight="bold">
                            ⏸️ PRODUCTION EN PAUSE
                        </Typography>
                        <Typography variant="body2">
                            Durée actuelle: {formatDuration(getCurrentPauseDuration())} • 
                            Temps total de pause: {formatDuration(totalPauseTime + getCurrentPauseDuration())}
                        </Typography>
                    </Alert>
                )}
                
                {/* Stepper de progression */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Stepper activeStep={1} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel 
                                    StepIconComponent={index <= 1 ? 
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

                {/* Informations du lot avec calculs */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <Scale />
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
                                    Quantité à Produire
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    {defaultBatch.quantity} unités
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Ratio: x{productionRatio.toFixed(2)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Progression
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={calculateProgress()} 
                                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                    />
                                    <Typography variant="body2">
                                        {Math.round(calculateProgress())}%
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Statut
                                </Typography>
                                <Chip 
                                    label={productionPaused ? 'En pause' : allIngredientsEntered ? 'Tous saisis' : 'En cours'}
                                    color={productionPaused ? 'error' : allIngredientsEntered ? 'success' : 'warning'}
                                    icon={productionPaused ? <Pause /> : allIngredientsEntered ? <CheckCircle /> : <Warning />}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>

            <Grid container spacing={3}>
                {/* Instructions de production */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, height: 'fit-content', position: 'sticky', top: 20 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Assignment color="primary" />
                            Instructions de Production
                        </Typography>
                        <Box sx={{ 
                            backgroundColor: '#f8f9fa', 
                            p: 2, 
                            borderRadius: 2,
                            border: '1px solid #e9ecef',
                            whiteSpace: 'pre-line',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            {defaultProduct.recipe.instructions}
                        </Box>
                        
                        {/* Historique des pauses */}
                        {pauseHistory.length > 0 && (
                            <Accordion sx={{ mt: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="subtitle2">
                                        Historique des Arrêts ({pauseHistory.length})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List dense>
                                        {pauseHistory.map((pause, index) => (
                                            <ListItem key={pause.id}>
                                                <ListItemText
                                                    primary={`${pause.reason} - ${pause.duration ? formatDuration(pause.duration) : 'En cours'}`}
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="caption">
                                                                {new Date(pause.startTime).toLocaleTimeString('fr-FR')}
                                                                {pause.endTime && ` - ${new Date(pause.endTime).toLocaleTimeString('fr-FR')}`}
                                                            </Typography>
                                                            {pause.details && (
                                                                <Typography variant="caption" display="block">
                                                                    {pause.details}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="caption" color="primary" fontWeight="bold">
                                        Temps total d'arrêt: {formatDuration(totalPauseTime + (productionPaused ? getCurrentPauseDuration() : 0))}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </Paper>
                </Grid>

                {/* Table des ingrédients */}
                <Grid item xs={12} md={7}>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body1">
                            📏 Quantités calculées pour <strong>{defaultBatch.quantity} unités</strong> (ratio x{productionRatio.toFixed(2)}).
                            Saisissez les quantités réellement utilisées.
                        </Typography>
                    </Alert>

                    <Paper sx={{ mb: 4 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ingrédient</TableCell>
                                        <TableCell align="center">Quantité Calculée</TableCell>
                                        <TableCell align="center">Quantité Réelle</TableCell>
                                        <TableCell align="center">Écart (%)</TableCell>
                                        <TableCell align="center">Statut</TableCell>
                                        <TableCell>Notes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ingredients.map((ingredient, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="medium">
                                                        {ingredient.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {ingredient.description}
                                                    </Typography>
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Typography variant="caption" color="info.main">
                                                            Base: {ingredient.originalQuantity} {ingredient.unit}
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="caption" color="warning.main">
                                                            Tolérance: ±{ingredient.tolerance} {ingredient.unit}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body1" fontWeight="medium" color="primary">
                                                    {ingredient.quantity} {ingredient.unit}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    type="number"
                                                    value={ingredient.actualQuantity}
                                                    onChange={(e) => handleIngredientChange(index, 'actualQuantity', e.target.value)}
                                                    size="small"
                                                    inputProps={{ 
                                                        step: ingredient.unit === 'g' ? "0.1" : "1",
                                                        min: "0"
                                                    }}
                                                    sx={{ width: 120 }}
                                                    placeholder="0"
                                                    disabled={productionPaused}
                                                />
                                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                    {ingredient.unit}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {ingredient.actualQuantity ? (
                                                    <Typography 
                                                        variant="body2" 
                                                        fontWeight="bold"
                                                        sx={{ color: getVarianceColor(ingredient.variance) }}
                                                    >
                                                        {ingredient.variance > 0 ? '+' : ''}{ingredient.variance.toFixed(1)}%
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary">
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={getStatusText(ingredient.status)}
                                                    color={getStatusColor(ingredient.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={ingredient.notes}
                                                    onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                                                    size="small"
                                                    placeholder="Notes..."
                                                    sx={{ width: 150 }}
                                                    disabled={productionPaused}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Résumé des écarts */}
                    {ingredients.some(ing => ing.status === 'warning') && (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                ⚠️ Écarts importants détectés :
                            </Typography>
                            {ingredients.filter(ing => ing.status === 'warning').map((ing, idx) => (
                                <Typography key={idx} variant="body2">
                                    • {ing.name} : {ing.variance > 0 ? '+' : ''}{ing.variance.toFixed(1)}% d'écart
                                </Typography>
                            ))}
                        </Alert>
                    )}

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                startIcon={<Refresh />}
                                disabled={productionPaused}
                            >
                                Réinitialiser
                            </Button>
                        </Box>
                        
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => setShowConfirmDialog(true)}
                            disabled={!allIngredientsEntered || productionPaused}
                            startIcon={<PlayArrow />}
                            sx={{ minWidth: 250 }}
                        >
                            Continuer vers Contrôle Qualité
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Dialog de pause */}
            <Dialog
                open={showPauseDialog}
                onClose={() => setShowPauseDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Arrêt de Production
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Indiquez la raison de l'arrêt de production :
                    </Typography>
                    
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel>Raison de l'arrêt</InputLabel>
                        <Select
                            value={pauseReason}
                            onChange={(e) => setPauseReason(e.target.value)}
                            label="Raison de l'arrêt"
                        >
                            <MenuItem value="Pause repas">Pause repas</MenuItem>
                            <MenuItem value="Problème technique">Problème technique</MenuItem>
                            <MenuItem value="Manque de matière première">Manque de matière première</MenuItem>
                            <MenuItem value="Contrôle qualité">Contrôle qualité approfondi</MenuItem>
                            <MenuItem value="Nettoyage équipement">Nettoyage équipement</MenuItem>
                            <MenuItem value="Urgence">Urgence</MenuItem>
                            <MenuItem value="Autre">Autre</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <TextField
                        fullWidth
                        label="Détails (optionnel)"
                        multiline
                        rows={3}
                        value={pauseDetails}
                        onChange={(e) => setPauseDetails(e.target.value)}
                        placeholder="Précisez les détails de l'arrêt..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowPauseDialog(false)}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirmPause}
                        variant="contained"
                        color="error"
                        disabled={!pauseReason}
                        startIcon={<Pause />}
                    >
                        Confirmer l'Arrêt
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de confirmation */}
            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Confirmation de la Saisie des Ingrédients
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Résumé de la saisie pour le lot <strong>{defaultBatch.batchNumber}</strong> :
                    </Typography>
                    
                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                            Production de {defaultBatch.quantity} unités (ratio x{productionRatio.toFixed(2)})
                        </Typography>
                        {(totalPauseTime > 0 || productionPaused) && (
                            <Typography variant="subtitle2" color="warning.main">
                                Temps d'arrêt total: {formatDuration(totalPauseTime + (productionPaused ? getCurrentPauseDuration() : 0))}
                            </Typography>
                        )}
                    </Box>
                    
                    <TableContainer sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ingrédient</TableCell>
                                    <TableCell align="center">Calculé</TableCell>
                                    <TableCell align="center">Réel</TableCell>
                                    <TableCell align="center">Écart</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ingredients.map((ing, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{ing.name}</TableCell>
                                        <TableCell align="center">{ing.quantity} {ing.unit}</TableCell>
                                        <TableCell align="center">{ing.actualQuantity} {ing.unit}</TableCell>
                                        <TableCell 
                                            align="center"
                                            sx={{ color: getVarianceColor(ing.variance) }}
                                        >
                                            {ing.variance > 0 ? '+' : ''}{ing.variance.toFixed(1)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        Ces données seront enregistrées et transmises à l'étape de contrôle qualité.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)}>
                        Modifier
                    </Button>
                    <Button
                        onClick={handleSaveIngredients}
                        variant="contained"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    >
                        {saving ? 'Enregistrement...' : 'Confirmer et Continuer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ProductionIngredients;