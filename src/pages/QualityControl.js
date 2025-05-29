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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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
    RadioGroup,
    FormControlLabel,
    Radio,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import {
    PlayArrow,
    CheckCircle,
    Warning,
    Error as ErrorIcon,
    Science,
    Save,
    Pause,
    PlayCircle,
    ExpandMore
} from '@mui/icons-material';
import { useAuth } from '../App';

function QualityControl({ batchData, productData, onContinue }) {
    const [qualityTests, setQualityTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [allTestsCompleted, setAllTestsCompleted] = useState(false);
    const [overallResult, setOverallResult] = useState('pending');
    
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

    // Données par défaut avec récupération des données de production
    const defaultBatch = batchData || {
        batchNumber: 'DEMO-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-001',
        productCode: 'PROD001',
        quantity: 100,
        operatorName: user?.name,
        status: 'quality_control',
        pauseHistory: [],
        totalPauseTime: 0
    };

    // Récupérer l'historique des pauses précédentes
    useEffect(() => {
        if (defaultBatch.pauseHistory) {
            setPauseHistory(defaultBatch.pauseHistory);
        }
        if (defaultBatch.totalPauseTime) {
            setTotalPauseTime(defaultBatch.totalPauseTime);
        }
    }, []);

    const defaultProduct = productData || {
        name: 'Produit Démonstration',
        code: 'PROD001',
        qualityTests: [
            { 
                name: 'pH', 
                type: 'number', 
                min: 6.5, 
                max: 7.5, 
                unit: 'pH', 
                required: true,
                description: 'Mesure du pH du produit fini'
            },
            { 
                name: 'Poids (100ml)', 
                type: 'number', 
                min: 98, 
                max: 102, 
                unit: 'g', 
                required: true,
                description: 'Contrôle du poids pour 100ml de produit'
            },
            { 
                name: 'Apparence visuelle', 
                type: 'select', 
                options: ['Conforme', 'Non conforme'], 
                required: true,
                description: 'Inspection visuelle du produit'
            },
            { 
                name: 'Odeur', 
                type: 'select', 
                options: ['Normale', 'Anormale'], 
                required: true,
                description: 'Contrôle olfactif du produit'
            },
            { 
                name: 'Viscosité', 
                type: 'select', 
                options: ['Fluide', 'Normale', 'Épaisse'], 
                required: true,
                description: 'Évaluation de la consistance'
            },
            {
                name: 'Test de stabilité',
                type: 'boolean',
                required: true,
                description: 'Test de stabilité du mélange'
            }
        ]
    };

    useEffect(() => {
        initializeQualityTests();
    }, []);

    useEffect(() => {
        checkAllTestsCompleted();
        calculateOverallResult();
    }, [qualityTests]);

    const initializeQualityTests = () => {
        if (defaultProduct?.qualityTests) {
            const initialTests = defaultProduct.qualityTests.map(test => ({
                ...test,
                result: '',
                status: 'pending',
                notes: '',
                timestamp: null,
                operatorId: user?.id
            }));
            setQualityTests(initialTests);
        }
    };

    const handleTestChange = (index, field, value) => {
        const newTests = [...qualityTests];
        newTests[index][field] = value;

        if (field === 'result') {
            const test = newTests[index];
            let status = 'pending';

            if (value !== '' && value !== null) {
                switch (test.type) {
                    case 'number':
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue) && numValue >= test.min && numValue <= test.max) {
                            status = 'passed';
                        } else {
                            status = 'failed';
                        }
                        break;
                    case 'select':
                        if (value === 'Non conforme' || value === 'Anormale') {
                            status = 'failed';
                        } else {
                            status = 'passed';
                        }
                        break;
                    case 'boolean':
                        status = value === 'true' || value === true ? 'passed' : 'failed';
                        break;
                    default:
                        status = 'passed';
                }
                
                newTests[index].timestamp = new Date().toISOString();
            }

            newTests[index].status = status;
        }

        setQualityTests(newTests);
    };

    const checkAllTestsCompleted = () => {
        const allCompleted = qualityTests.length > 0 && qualityTests.every(test => 
            test.result !== '' && test.result !== null
        );
        setAllTestsCompleted(allCompleted);
    };

    const calculateOverallResult = () => {
        if (qualityTests.length === 0) {
            setOverallResult('pending');
            return;
        }

        const completedTests = qualityTests.filter(test => test.status !== 'pending');
        
        if (completedTests.length === 0) {
            setOverallResult('pending');
        } else if (completedTests.some(test => test.status === 'failed')) {
            setOverallResult('failed');
        } else if (completedTests.length === qualityTests.length) {
            setOverallResult('passed');
        } else {
            setOverallResult('pending');
        }
    };

    // Fonctions de gestion des pauses
    const handlePauseProduction = () => {
        setShowPauseDialog(true);
    };

    const handleConfirmPause = () => {
        const now = new Date();
        setPauseStartTime(now);
        setProductionPaused(true);
        setShowPauseDialog(false);
        
        const pauseRecord = {
            id: Date.now(),
            startTime: now,
            reason: pauseReason,
            details: pauseDetails,
            operator: user?.name,
            phase: 'quality_control'
        };
        setPauseHistory(prev => [...prev, pauseRecord]);
        
        setPauseReason('');
        setPauseDetails('');
    };

    const handleResumeProduction = () => {
        if (pauseStartTime) {
            const now = new Date();
            const pauseDuration = Math.round((now - pauseStartTime) / 1000);
            setTotalPauseTime(prev => prev + pauseDuration);
            
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'passed': return 'success';
            case 'failed': return 'error';
            case 'pending': return 'default';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'passed': return 'Conforme';
            case 'failed': return 'Non conforme';
            case 'pending': return 'En attente';
            default: return 'En attente';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed': return <CheckCircle />;
            case 'failed': return <ErrorIcon />;
            case 'pending': return <Warning />;
            default: return <Warning />;
        }
    };

    const calculateProgress = () => {
        const completedCount = qualityTests.filter(test => test.status !== 'pending').length;
        return qualityTests.length > 0 ? (completedCount / qualityTests.length) * 100 : 0;
    };

    const renderTestInput = (test, index) => {
        switch (test.type) {
            case 'number':
                return (
                    <TextField
                        type="number"
                        value={test.result}
                        onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                        size="small"
                        fullWidth
                        inputProps={{ 
                            step: test.unit === 'pH' ? "0.1" : "1",
                            min: test.min - 5,
                            max: test.max + 5
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{test.unit}</InputAdornment>
                        }}
                        helperText={`Plage: ${test.min} - ${test.max} ${test.unit}`}
                        disabled={productionPaused}
                    />
                );
            case 'select':
                return (
                    <FormControl fullWidth size="small">
                        <Select
                            value={test.result}
                            onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                            disabled={productionPaused}
                        >
                            {test.options.map((option, idx) => (
                                <MenuItem key={idx} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            case 'boolean':
                return (
                    <RadioGroup
                        value={test.result}
                        onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                        row
                    >
                        <FormControlLabel 
                            value="true" 
                            control={<Radio disabled={productionPaused} />} 
                            label="Conforme" 
                        />
                        <FormControlLabel 
                            value="false" 
                            control={<Radio disabled={productionPaused} />} 
                            label="Non conforme" 
                        />
                    </RadioGroup>
                );
            default:
                return (
                    <TextField
                        value={test.result}
                        onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                        size="small"
                        fullWidth
                        disabled={productionPaused}
                    />
                );
        }
    };

    const handleSaveQualityTests = async () => {
        setSaving(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const updatedBatch = {
                ...defaultBatch,
                currentStep: 'completing',
                qualityTestsData: qualityTests.map(test => ({
                    name: test.name,
                    type: test.type,
                    result: test.result,
                    status: test.status,
                    notes: test.notes,
                    timestamp: test.timestamp || new Date().toISOString(),
                    operatorId: user.id
                })),
                overallResult: overallResult,
                pauseHistory: pauseHistory,
                totalPauseTime: totalPauseTime + (productionPaused ? getCurrentPauseDuration() : 0),
                qualityCompletedAt: new Date().toISOString()
            };

            console.log('🔬 Contrôle qualité terminé, passage à la finalisation');
            setShowConfirmDialog(false);
            
            if (onContinue) {
                onContinue(updatedBatch, defaultProduct);
            }
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
            setError('Erreur lors de la sauvegarde des tests qualité');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* En-tête */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Contrôle Qualité
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
                    <Stepper activeStep={2} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel 
                                    StepIconComponent={index <= 2 ? 
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
                                        <Science />
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
                                    Progression Tests
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
                                    Résultat Global
                                </Typography>
                                <Chip 
                                    label={productionPaused ? 'En pause' : getStatusText(overallResult)}
                                    color={productionPaused ? 'error' : getStatusColor(overallResult)}
                                    icon={productionPaused ? <Pause /> : getStatusIcon(overallResult)}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Tests Complétés
                                </Typography>
                                <Typography variant="h6">
                                    {qualityTests.filter(t => t.status !== 'pending').length} / {qualityTests.length}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Historique des pauses si présent */}
                {pauseHistory.length > 0 && (
                    <Accordion sx={{ mb: 3 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">
                                Historique des Arrêts de Production ({pauseHistory.length})
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
                                                        {pause.phase} • {new Date(pause.startTime).toLocaleTimeString('fr-FR')}
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
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Instructions */}
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1">
                    🔬 Effectuez tous les tests qualité requis pour ce produit. 
                    Les résultats seront automatiquement validés selon les critères définis.
                </Typography>
            </Alert>

            {/* Tests qualité */}
            <Paper sx={{ mb: 4 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6">
                        Tests de Contrôle Qualité
                    </Typography>
                </Box>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Test</TableCell>
                                <TableCell align="center">Critères</TableCell>
                                <TableCell align="center">Résultat</TableCell>
                                <TableCell align="center">Statut</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell align="center">Heure</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {qualityTests.map((test, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {test.name}
                                                {test.required && (
                                                    <Chip label="Obligatoire" size="small" color="primary" sx={{ ml: 1 }} />
                                                )}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {test.description}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        {test.type === 'number' && (
                                            <Typography variant="body2">
                                                {test.min} - {test.max} {test.unit}
                                            </Typography>
                                        )}
                                        {test.type === 'select' && (
                                            <Typography variant="body2">
                                                {test.options.join(', ')}
                                            </Typography>
                                        )}
                                        {test.type === 'boolean' && (
                                            <Typography variant="body2">
                                                Conforme / Non conforme
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center" sx={{ minWidth: 200 }}>
                                        {renderTestInput(test, index)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={getStatusText(test.status)}
                                            color={getStatusColor(test.status)}
                                            size="small"
                                            icon={getStatusIcon(test.status)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={test.notes}
                                            onChange={(e) => handleTestChange(index, 'notes', e.target.value)}
                                            size="small"
                                            placeholder="Notes..."
                                            multiline
                                            rows={2}
                                            sx={{ width: 150 }}
                                            disabled={productionPaused}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {test.timestamp ? (
                                            <Typography variant="caption">
                                                {new Date(test.timestamp).toLocaleTimeString('fr-FR')}
                                            </Typography>
                                        ) : (
                                            <Typography variant="caption" color="textSecondary">
                                                -
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Résumé des échecs */}
            {qualityTests.some(test => test.status === 'failed') && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        ❌ Tests non conformes détectés :
                    </Typography>
                    {qualityTests.filter(test => test.status === 'failed').map((test, idx) => (
                        <Typography key={idx} variant="body2">
                            • {test.name} : {test.result} {test.unit || ''}
                        </Typography>
                    ))}
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                        Ce lot devra être rejeté ou retraité.
                    </Typography>
                </Alert>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Alert 
                    severity={productionPaused ? "warning" : allTestsCompleted ? 
                        (overallResult === 'failed' ? "error" : "success") : 
                        "info"
                    }
                    sx={{ flex: 1, mr: 3 }}
                >
                    {productionPaused ?
                        "⏸️ Production en pause - Reprendre pour continuer" :
                        allTestsCompleted ?
                        (overallResult === 'failed' ? 
                            "❌ Tests non conformes - Lot à rejeter" :
                            "✅ Tous les tests sont conformes"
                        ) :
                        "🧪 Complétez tous les tests pour continuer"
                    }
                </Alert>
                
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={!allTestsCompleted || productionPaused}
                    startIcon={<PlayArrow />}
                    sx={{ minWidth: 250 }}
                    color={overallResult === 'failed' ? 'error' : 'primary'}
                >
                    {overallResult === 'failed' ? 'Finaliser (Non Conforme)' : 'Finaliser Production'}
                </Button>
            </Box>

            {/* Dialog de pause */}
            <Dialog
                open={showPauseDialog}
                onClose={() => setShowPauseDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Arrêt de Production - Contrôle Qualité
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
                            <MenuItem value="Problème équipement test">Problème équipement de test</MenuItem>
                            <MenuItem value="Échantillon défaillant">Échantillon défaillant</MenuItem>
                            <MenuItem value="Attente résultats laboratoire">Attente résultats laboratoire</MenuItem>
                            <MenuItem value="Consultation superviseur">Consultation superviseur</MenuItem>
                            <MenuItem value="Réétalonnage instruments">Réétalonnage instruments</MenuItem>
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
                    Confirmation du Contrôle Qualité
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Résumé du contrôle qualité pour le lot <strong>{defaultBatch.batchNumber}</strong> :
                    </Typography>
                    
                    <Box sx={{ my: 2 }}>
                        <Chip 
                            label={`Résultat Global : ${getStatusText(overallResult)}`}
                            color={getStatusColor(overallResult)}
                            icon={getStatusIcon(overallResult)}
                            size="large"
                        />
                        {(totalPauseTime > 0 || productionPaused) && (
                            <Typography variant="subtitle2" color="warning.main" sx={{ mt: 1 }}>
                                Temps d'arrêt total: {formatDuration(totalPauseTime + (productionPaused ? getCurrentPauseDuration() : 0))}
                            </Typography>
                        )}
                    </Box>

                    <TableContainer sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Test</TableCell>
                                    <TableCell align="center">Résultat</TableCell>
                                    <TableCell align="center">Statut</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {qualityTests.map((test, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{test.name}</TableCell>
                                        <TableCell align="center">
                                            {test.result} {test.unit || ''}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={getStatusText(test.status)}
                                                color={getStatusColor(test.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Alert 
                        severity={overallResult === 'failed' ? 'error' : 'success'} 
                        sx={{ mt: 2 }}
                    >
                        {overallResult === 'failed' ? 
                            'Ce lot ne respecte pas les critères qualité et sera marqué comme non conforme.' :
                            'Tous les tests sont conformes. Le lot peut être finalisé.'
                        }
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)}>
                        Modifier
                    </Button>
                    <Button
                        onClick={handleSaveQualityTests}
                        variant="contained"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                        color={overallResult === 'failed' ? 'error' : 'primary'}
                    >
                        {saving ? 'Enregistrement...' : 'Confirmer et Finaliser'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default QualityControl;