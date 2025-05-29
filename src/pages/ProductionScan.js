import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Alert,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import {
    QrCodeScanner,
    PlayArrow,
    CheckCircle,
    Edit as EditIcon,
    Science,
    Refresh,
    Calculate,
    Assignment
} from '@mui/icons-material';
import { useAuth } from '../App';

function ProductionScan({ onStartProduction }) {
    const [scanMode, setScanMode] = useState('scan');
    const [productCode, setProductCode] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [productData, setProductData] = useState(null);
    const [batchNumber, setBatchNumber] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    
    const { user } = useAuth();

    // Base de données de produits simulée avec système de ratios
    const productDatabase = {
        'PROD001': {
            id: 1,
            name: 'Huile Moteur 5W-30',
            code: 'PROD001',
            description: 'Huile moteur synthétique haute performance pour véhicules légers',
            category: 'Lubrifiants Automobiles',
            recipe: {
                outputUnit: 'L',
                outputDescription: 'Litres d\'huile moteur produite',
                ingredients: [
                    { name: 'Base synthétique', ratio: 8.5, unit: 'ml', unitPerLiter: 'ml/L', description: 'Composant principal liquide', tolerance: 2.5 },
                    { name: 'Additifs détergents', ratio: 1.0, unit: 'ml', unitPerLiter: 'ml/L', description: 'Agents nettoyants', tolerance: 0.5 },
                    { name: 'Modificateurs viscosité', ratio: 0.5, unit: 'ml', unitPerLiter: 'ml/L', description: 'Régulateurs de viscosité', tolerance: 0.2 }
                ],
                estimatedTime: 45,
                difficulty: 'Moyen'
            },
            qualityTests: [
                { name: 'Viscosité', type: 'number', min: 29, max: 31, unit: 'cSt', required: true, description: 'Mesure de viscosité cinématique' },
                { name: 'Point d\'éclair', type: 'number', min: 220, max: 240, unit: '°C', required: true, description: 'Température d\'inflammation' },
                { name: 'Apparence visuelle', type: 'select', options: ['Claire', 'Trouble'], required: true, description: 'Inspection visuelle du produit' }
            ]
        },
        'PROD002': {
            id: 2,
            name: 'Graisse Multi-Usage',
            code: 'PROD002',
            description: 'Graisse lithium pour applications industrielles générales',
            category: 'Graisses Industrielles',
            recipe: {
                outputUnit: 'kg',
                outputDescription: 'Kilogrammes de graisse produite',
                ingredients: [
                    { name: 'Huile de base', ratio: 14.0, unit: 'ml', unitPerLiter: 'ml/kg', description: 'Base lubrifiante', tolerance: 7.0 },
                    { name: 'Savon de lithium', ratio: 5.0, unit: 'g', unitPerLiter: 'g/kg', description: 'Agent épaississant', tolerance: 2.5 },
                    { name: 'Antioxydants', ratio: 1.0, unit: 'ml', unitPerLiter: 'ml/kg', description: 'Protecteurs anti-oxydation', tolerance: 0.5 }
                ],
                estimatedTime: 60,
                difficulty: 'Complexe'
            },
            qualityTests: [
                { name: 'Pénétration', type: 'number', min: 265, max: 295, unit: '0.1mm', required: true, description: 'Test de consistance ASTM' },
                { name: 'Point de goutte', type: 'number', min: 180, max: 220, unit: '°C', required: true, description: 'Température de fusion' },
                { name: 'Aspect', type: 'select', options: ['Homogène', 'Granuleux'], required: true, description: 'Contrôle visuel de texture' }
            ]
        },
        'PROD003': {
            id: 3,
            name: 'Fluide Hydraulique ISO 46',
            code: 'PROD003',
            description: 'Fluide hydraulique pour systèmes industriels haute pression',
            category: 'Fluides Hydrauliques',
            recipe: {
                outputUnit: 'L',
                outputDescription: 'Litres de fluide hydraulique produit',
                ingredients: [
                    { name: 'Huile de base ISO 46', ratio: 9.0, unit: 'ml', unitPerLiter: 'ml/L', description: 'Base hydraulique spécialisée', tolerance: 4.5 },
                    { name: 'Anti-mousse', ratio: 0.5, unit: 'ml', unitPerLiter: 'ml/L', description: 'Suppresseur de mousse', tolerance: 0.2 },
                    { name: 'Anti-usure', ratio: 0.5, unit: 'ml', unitPerLiter: 'ml/L', description: 'Protection des surfaces métalliques', tolerance: 0.2 }
                ],
                estimatedTime: 30,
                difficulty: 'Simple'
            },
            qualityTests: [
                { name: 'Viscosité ISO', type: 'number', min: 41.4, max: 50.6, unit: 'cSt', required: true, description: 'Viscosité selon norme ISO' },
                { name: 'Indice d\'acidité', type: 'number', min: 0, max: 0.5, unit: 'mg KOH/g', required: true, description: 'Niveau d\'acidité résiduelle' },
                { name: 'Couleur', type: 'select', options: ['Claire', 'Ambrée', 'Foncée'], required: true, description: 'Couleur du fluide fini' }
            ]
        }
    };

    // Fonction pour générer le numéro de lot
    const generateBatchNumber = (productCode, quantity) => {
        const today = new Date();
        const dateStr = today.getFullYear().toString() + 
                       (today.getMonth() + 1).toString().padStart(2, '0') + 
                       today.getDate().toString().padStart(2, '0');
        
        const sequence = (today.getHours().toString().padStart(2, '0') + 
                         today.getMinutes().toString().padStart(2, '0')).slice(-3).padStart(3, '0');
        
        return `${productCode}-${dateStr}-${sequence}`;
    };

    const handleScanSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setProductData(null);

        try {
            let scannedData;
            
            if (scanMode === 'scan') {
                scannedData = productCode.includes('|') ? 
                    productCode.split('|') : 
                    [productCode, quantity];
            } else {
                scannedData = [productCode, quantity];
            }

            const [scannedProductCode, scannedQuantity] = scannedData;

            if (!scannedProductCode || !scannedQuantity) {
                throw new Error('Code produit et quantité requis');
            }

            if (parseInt(scannedQuantity) <= 0) {
                throw new Error('La quantité doit être supérieure à 0');
            }

            // Simulation délai réseau
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Recherche du produit dans la base
            const foundProduct = productDatabase[scannedProductCode.toUpperCase()];
            
            if (!foundProduct) {
                throw new Error(`Produit ${scannedProductCode} non trouvé dans la base de données`);
            }

            // Calculer le ratio de production
            const productionQuantity = parseInt(scannedQuantity);
            const productionRatio = productionQuantity / foundProduct.baseQuantity;

            // Créer les instructions adaptées à la quantité
            const adaptedInstructions = `Instructions de production pour ${productionQuantity} unités de ${foundProduct.name}:

RATIO DE PRODUCTION: x${productionRatio.toFixed(2)} (base: ${foundProduct.baseQuantity} unités)

1. PRÉPARATION DE L'ENVIRONNEMENT
   - Vérifier la propreté de la zone de travail
   - S'assurer que tous les équipements sont fonctionnels
   - Porter les équipements de protection individuelle (EPI)
   - Vérifier la température ambiante (18-25°C)
   - Ajuster la taille du mélangeur selon la quantité (${productionQuantity} unités)

2. PRÉPARATION DES INGRÉDIENTS
   - Peser tous les ingrédients selon les quantités calculées automatiquement
   - Vérifier la qualité et la date d'expiration de chaque ingrédient
   - Disposer les ingrédients dans l'ordre d'utilisation
   - Préchauffer les équipements si nécessaire
   - Temps de préparation estimé: ${Math.round(15 * productionRatio)} minutes

3. PROCESSUS DE MÉLANGE - PHASE 1
   - Commencer par les ingrédients secs dans le mélangeur principal
   - Mélanger à vitesse lente (niveau 1) pendant ${Math.round(2 * productionRatio)} minutes
   - Vérifier l'homogénéité du mélange sec

4. PROCESSUS DE MÉLANGE - PHASE 2  
   - Ajouter progressivement les liquides en 3 étapes
   - Première étape : 50% du volume liquide, mélanger ${Math.round(3 * productionRatio)} minutes
   - Deuxième étape : 30% du volume liquide, mélanger ${Math.round(2 * productionRatio)} minutes
   - Troisième étape : 20% restant, mélanger ${Math.round(1 * productionRatio)} minute(s)

5. CONTRÔLE INTERMÉDIAIRE
   - Arrêter le mélangeur et vérifier la consistance
   - Prélever un échantillon pour contrôle visuel
   - Ajuster la viscosité si nécessaire
   - Nettoyer les parois du mélangeur avec une spatule

6. FINALISATION
   - Mélange final à vitesse modérée pendant ${Math.round(5 * productionRatio)} minutes
   - Contrôle visuel de l'homogénéité
   - Prélèvement d'échantillon pour les tests qualité
   - Arrêt de la production et nettoyage des outils

⚠️ IMPORTANT : 
- Respecter scrupuleusement les quantités calculées et les tolérances
- Temps total estimé: ${Math.round(foundProduct.recipe.estimatedTime * productionRatio)} minutes
- Niveau de difficulté: ${foundProduct.recipe.difficulty}`;

            // Construire l'objet produit avec données calculées
            const adaptedProduct = {
                ...foundProduct,
                quantity: productionQuantity,
                recipe: {
                    ...foundProduct.recipe,
                    instructions: adaptedInstructions,
                    estimatedTime: Math.round(foundProduct.recipe.estimatedTime * (productionQuantity / 10))
                }
            };
            
            const generatedBatch = generateBatchNumber(scannedProductCode, scannedQuantity);
            
            setProductData(adaptedProduct);
            setBatchNumber(generatedBatch);
            setProductCode(scannedProductCode);
            setQuantity(scannedQuantity);
            setShowConfirmDialog(true);

        } catch (err) {
            console.error('Erreur lors du scan:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartProduction = () => {
        const batchData = {
            batchNumber,
            productId: productData.id,
            productCode: productData.code,
            quantity: productData.quantity,
            operatorId: user.id,
            operatorName: user.name,
            status: 'in_progress',
            startTime: new Date().toISOString(),
            outputUnit: productData.recipe.outputUnit,
            pauseHistory: [],
            totalPauseTime: 0,
            productionData: {
                recipe: productData.recipe,
                qualityTests: productData.qualityTests
            }
        };

        console.log('🚀 Démarrage de la production:', batchData);
        setShowConfirmDialog(false);
        
        if (onStartProduction) {
            onStartProduction(batchData, productData);
        }
    };

    const handleReset = () => {
        setProductCode('');
        setQuantity('');
        setProductData(null);
        setBatchNumber('');
        setShowConfirmDialog(false);
        setError('');
        setScanMode('scan');
    };

    // Calculer les quantités d'ingrédients pour l'aperçu selon les ratios
    const getCalculatedIngredients = () => {
        if (!productData) return [];
        
        return productData.recipe.ingredients.map(ingredient => ({
            ...ingredient,
            calculatedQuantity: Math.round((ingredient.ratio * productData.quantity) * 100) / 100,
            calculatedTolerance: Math.round((ingredient.tolerance * productData.quantity) * 100) / 100
        }));
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Scan de Production
            </Typography>
            
            <Paper sx={{ p: 4, mt: 3 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Sélection du mode */}
                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Mode de saisie</InputLabel>
                        <Select
                            value={scanMode}
                            onChange={(e) => setScanMode(e.target.value)}
                            label="Mode de saisie"
                        >
                            <MenuItem value="scan">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <QrCodeScanner />
                                    Scanner QR/Code-barres
                                </Box>
                            </MenuItem>
                            <MenuItem value="manual">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EditIcon />
                                    Saisie manuelle
                                </Box>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <form onSubmit={handleScanSubmit}>
                    {scanMode === 'scan' ? (
                        <TextField
                            fullWidth
                            label="Scanner ou coller le code (Format: PRODUIT|QUANTITÉ)"
                            value={productCode}
                            onChange={(e) => setProductCode(e.target.value)}
                            margin="normal"
                            required
                            disabled={loading}
                            placeholder="PROD001|150"
                            helperText="Scannez le QR code ou saisissez manuellement au format PRODUIT|QUANTITÉ"
                        />
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Code Produit"
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                    margin="normal"
                                    required
                                    disabled={loading}
                                    placeholder="PROD001, PROD002, PROD003"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Quantité à produire"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    margin="normal"
                                    required
                                    disabled={loading}
                                    placeholder="150"
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                        </Grid>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 3 }}
                        startIcon={loading ? <CircularProgress size={20} /> : <QrCodeScanner />}
                    >
                        {loading ? 'Vérification...' : 'Vérifier Produit'}
                    </Button>
                </form>

                {/* Produits disponibles */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Produits disponibles :
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.values(productDatabase).map(product => (
                            <Grid item xs={12} sm={4} key={product.code}>
                                <Card 
                                    variant="outlined"
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                    onClick={() => {
                                        setProductCode(product.code);
                                        setScanMode('manual');
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle2" color="primary">
                                            {product.code}
                                        </Typography>
                                        <Typography variant="body2">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Unité: {product.recipe.outputUnit} • {product.recipe.outputDescription}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {productData && !showConfirmDialog && (
                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={handleReset}
                            startIcon={<Refresh />}
                        >
                            Nouveau Scan
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Dialog de confirmation */}
            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Confirmation de Production
                </DialogTitle>
                <DialogContent>
                    {productData && (
                        <Box>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Produit trouvé ! Numéro de lot généré : <strong>{batchNumber}</strong>
                            </Alert>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Informations Produit
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Nom du Produit"
                                                        secondary={productData.name}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Code Produit"
                                                        secondary={productData.code}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Description"
                                                        secondary={productData.description}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Catégorie"
                                                        secondary={productData.category}
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Détails Production
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Quantité à Produire"
                                                        secondary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="h5" color="primary">
                                                                    {productData.quantity}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {productData.recipe.outputUnit}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Unité de Production"
                                                        secondary={
                                                            <Chip 
                                                                label={productData.recipe.outputDescription}
                                                                color="info"
                                                                icon={<Calculate />}
                                                            />
                                                        }
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Temps Estimé"
                                                        secondary={`${productData.recipe.estimatedTime} minutes`}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Opérateur"
                                                        secondary={user?.name}
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            {/* Aperçu des ingrédients calculés */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Assignment color="primary" />
                                    Ingrédients Calculés (Aperçu)
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Grid container spacing={2}>
                                        {getCalculatedIngredients().map((ingredient, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                    <Typography variant="subtitle2">
                                                        {ingredient.name}
                                                    </Typography>
                                                    <Typography variant="body1" color="primary" fontWeight="bold">
                                                        {ingredient.calculatedQuantity} {ingredient.unit}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Ratio: {ingredient.ratio} {ingredient.unit}/{productData.recipe.outputUnit} | 
                                                        Tolérance: ±{ingredient.calculatedTolerance} {ingredient.unit}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Box>

                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Étapes de Production
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip label="1. Recette & Instructions" color="primary" />
                                    <Chip label="2. Saisie Ingrédients" color="default" />
                                    <Chip label="3. Contrôle Qualité" color="default" />
                                    <Chip label="4. Finalisation" color="default" />
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReset}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleStartProduction}
                        variant="contained"
                        startIcon={<PlayArrow />}
                    >
                        Démarrer Production
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ProductionScan;