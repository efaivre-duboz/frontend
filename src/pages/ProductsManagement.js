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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    Menu,
    CircularProgress
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Visibility,
    GetApp,
    Search,
    FilterList,
    Science,
    Inventory,
    ExpandMore,
    FileDownload,
    TableChart,
    Warning
} from '@mui/icons-material';
import { useAuth } from '../App';

function ProductsManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('view');
    const [anchorEl, setAnchorEl] = useState(null);

    const { user } = useAuth();

    // Données de démonstration
    const mockProducts = [
        {
            id: 1,
            code: 'PROD001',
            name: 'Huile Moteur 5W-30',
            category: 'Lubrifiants Automobiles',
            status: 'active',
            description: 'Huile moteur synthétique haute performance pour véhicules légers',
            price: 45.99,
            stock: 150,
            minStock: 20,
            supplier: 'PetroCanada',
            lastUpdated: '2024-01-15',
            recipe: {
                ingredients: [
                    { name: 'Base synthétique', quantity: 850, unit: 'ml', description: 'Composant principal' },
                    { name: 'Additifs détergents', quantity: 100, unit: 'ml', description: 'Agents nettoyants' },
                    { name: 'Modificateurs viscosité', quantity: 50, unit: 'ml', description: 'Régulateurs de viscosité' }
                ],
                instructions: 'Mélanger la base synthétique avec les additifs à température contrôlée de 20-25°C. Homogénéiser pendant 15 minutes à vitesse modérée.',
                estimatedTime: 30
            },
            qualityTests: [
                { name: 'Viscosité', type: 'number', min: 29, max: 31, unit: 'cSt', description: 'Mesure de viscosité', required: true },
                { name: 'Point d\'éclair', type: 'number', min: 220, max: 240, unit: '°C', description: 'Température d\'inflammation', required: true },
                { name: 'Apparence', type: 'select', options: ['Claire', 'Trouble'], description: 'Inspection visuelle', required: true }
            ]
        },
        {
            id: 2,
            code: 'PROD002',
            name: 'Graisse Multi-Usage',
            category: 'Graisses Industrielles',
            status: 'active',
            description: 'Graisse lithium pour applications industrielles générales',
            price: 32.50,
            stock: 85,
            minStock: 15,
            supplier: 'Texaco',
            lastUpdated: '2024-01-10',
            recipe: {
                ingredients: [
                    { name: 'Huile de base', quantity: 700, unit: 'ml', description: 'Base lubrifiante' },
                    { name: 'Savon de lithium', quantity: 250, unit: 'g', description: 'Agent épaississant' },
                    { name: 'Antioxydants', quantity: 50, unit: 'ml', description: 'Protecteurs anti-oxydation' }
                ],
                instructions: 'Chauffer l\'huile de base à 80°C, ajouter progressivement le savon de lithium en mélangeant constamment. Refroidir lentement.',
                estimatedTime: 45
            },
            qualityTests: [
                { name: 'Pénétration', type: 'number', min: 265, max: 295, unit: '0.1mm', description: 'Test de consistance', required: true },
                { name: 'Point de goutte', type: 'number', min: 180, max: 220, unit: '°C', description: 'Température de fusion', required: true }
            ]
        },
        {
            id: 3,
            code: 'PROD003',
            name: 'Fluide Hydraulique ISO 46',
            category: 'Fluides Hydrauliques',
            status: 'active',
            description: 'Fluide hydraulique pour systèmes industriels',
            price: 28.75,
            stock: 12,
            minStock: 25,
            supplier: 'Shell',
            lastUpdated: '2024-01-08',
            recipe: {
                ingredients: [
                    { name: 'Huile de base ISO 46', quantity: 900, unit: 'ml', description: 'Base hydraulique' },
                    { name: 'Anti-mousse', quantity: 50, unit: 'ml', description: 'Suppresseur de mousse' },
                    { name: 'Anti-usure', quantity: 50, unit: 'ml', description: 'Protection des surfaces' }
                ],
                instructions: 'Mélanger tous les composants à température ambiante. Homogénéiser pendant 10 minutes.',
                estimatedTime: 20
            },
            qualityTests: [
                { name: 'Viscosité ISO', type: 'number', min: 41.4, max: 50.6, unit: 'cSt', description: 'Viscosité standard', required: true },
                { name: 'Indice d\'acidité', type: 'number', min: 0, max: 0.5, unit: 'mg KOH/g', description: 'Niveau d\'acidité', required: true }
            ]
        }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setProducts(mockProducts);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setDialogMode('view');
        setShowDialog(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setDialogMode('edit');
        setShowDialog(true);
    };

    const handleAddProduct = () => {
        setSelectedProduct({
            id: null,
            code: '',
            name: '',
            category: '',
            status: 'active',
            description: '',
            price: 0,
            stock: 0,
            minStock: 0,
            supplier: '',
            lastUpdated: new Date().toISOString().slice(0, 10),
            recipe: {
                ingredients: [],
                instructions: '',
                estimatedTime: 30,
                outputUnit: 'L',
                outputDescription: 'Litres de produit fini'
            },
            qualityTests: []
        });
        setDialogMode('add');
        setShowDialog(true);
    };

    const handleSaveProduct = () => {
        if (dialogMode === 'add') {
            const newProduct = {
                ...selectedProduct,
                id: Math.max(...products.map(p => p.id), 0) + 1,
                lastUpdated: new Date().toISOString().slice(0, 10)
            };
            setProducts([...products, newProduct]);
        } else if (dialogMode === 'edit') {
            const updatedProducts = products.map(p => 
                p.id === selectedProduct.id ? 
                { ...selectedProduct, lastUpdated: new Date().toISOString().slice(0, 10) } : 
                p
            );
            setProducts(updatedProducts);
        }
        setShowDialog(false);
    };

    const handleProductChange = (field, value) => {
        setSelectedProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRecipeChange = (field, value) => {
        setSelectedProduct(prev => ({
            ...prev,
            recipe: {
                ...prev.recipe,
                [field]: value
            }
        }));
    };

    const addIngredient = () => {
        setSelectedProduct(prev => ({
            ...prev,
            recipe: {
                ...prev.recipe,
                ingredients: [
                    ...prev.recipe.ingredients,
                    { name: '', ratio: 0, unit: 'ml', unitPerLiter: 'ml/L', description: '', tolerance: 0 }
                ]
            }
        }));
    };

    const updateIngredient = (index, field, value) => {
        setSelectedProduct(prev => ({
            ...prev,
            recipe: {
                ...prev.recipe,
                ingredients: prev.recipe.ingredients.map((ing, i) =>
                    i === index ? { ...ing, [field]: value } : ing
                )
            }
        }));
    };

    const removeIngredient = (index) => {
        setSelectedProduct(prev => ({
            ...prev,
            recipe: {
                ...prev.recipe,
                ingredients: prev.recipe.ingredients.filter((_, i) => i !== index)
            }
        }));
    };

    const addQualityTest = () => {
        setSelectedProduct(prev => ({
            ...prev,
            qualityTests: [
                ...prev.qualityTests,
                { name: '', type: 'number', min: 0, max: 100, unit: '', options: [], required: true, description: '' }
            ]
        }));
    };

    const updateQualityTest = (index, field, value) => {
        setSelectedProduct(prev => ({
            ...prev,
            qualityTests: prev.qualityTests.map((test, i) =>
                i === index ? { ...test, [field]: value } : test
            )
        }));
    };

    const removeQualityTest = (index) => {
        setSelectedProduct(prev => ({
            ...prev,
            qualityTests: prev.qualityTests.filter((_, i) => i !== index)
        }));
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    const handleExportMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExportMenuClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (format) => {
        setAnchorEl(null);
        if (format === 'csv') {
            exportToCSV();
        } else if (format === 'excel') {
            exportToExcel();
        }
    };

    const exportToCSV = () => {
        const headers = ['Code', 'Nom', 'Catégorie', 'Statut', 'Prix', 'Stock', 'Stock Min', 'Fournisseur', 'Dernière MAJ'];
        const csvContent = [
            headers.join(','),
            ...filteredProducts.map(product => [
                product.code,
                `"${product.name}"`,
                `"${product.category}"`,
                product.status,
                product.price,
                product.stock,
                product.minStock,
                `"${product.supplier}"`,
                product.lastUpdated
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `produits_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = () => {
        alert('Export Excel simulé - En production, ceci utiliserait une bibliothèque comme SheetJS');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'discontinued': return 'warning';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Actif';
            case 'inactive': return 'Inactif';
            case 'discontinued': return 'Discontinué';
            default: return status;
        }
    };

    const getStockStatus = (stock, minStock) => {
        if (stock === 0) return { color: 'error', text: 'Rupture' };
        if (stock <= minStock) return { color: 'warning', text: 'Bas' };
        return { color: 'success', text: 'Normal' };
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* En-tête */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                    Gestion des Produits
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Gérez votre catalogue de produits Envirolin
                </Typography>
            </Box>

            {/* Statistiques */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <Inventory />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="primary">
                                        {products.length}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Produits
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <Science />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="success.main">
                                        {products.filter(p => p.status === 'active').length}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Produits Actifs
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <Warning />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="warning.main">
                                        {products.filter(p => p.stock <= p.minStock).length}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Stock Bas
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <TableChart />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="info.main">
                                        {new Set(products.map(p => p.category)).size}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Catégories
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Barre d'outils */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Filtrer par statut</InputLabel>
                            <Select
                                value={filterStatus}
                                onChange={handleFilterChange}
                                label="Filtrer par statut"
                                startAdornment={<FilterList sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="all">Tous les statuts</MenuItem>
                                <MenuItem value="active">Actifs</MenuItem>
                                <MenuItem value="inactive">Inactifs</MenuItem>
                                <MenuItem value="discontinued">Discontinués</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<GetApp />}
                                onClick={handleExportMenuOpen}
                            >
                                Exporter
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAddProduct}
                            >
                                Nouveau Produit
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Menu d'export */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleExportMenuClose}
            >
                <MenuItem onClick={() => handleExport('csv')}>
                    <FileDownload sx={{ mr: 2 }} />
                    Exporter en CSV
                </MenuItem>
                <MenuItem onClick={() => handleExport('excel')}>
                    <TableChart sx={{ mr: 2 }} />
                    Exporter en Excel
                </MenuItem>
            </Menu>

            {/* Tableau des produits */}
            <Paper>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Code</TableCell>
                                    <TableCell>Nom du Produit</TableCell>
                                    <TableCell>Catégorie</TableCell>
                                    <TableCell align="center">Statut</TableCell>
                                    <TableCell align="right">Prix</TableCell>
                                    <TableCell align="center">Stock</TableCell>
                                    <TableCell>Fournisseur</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.map((product) => {
                                    const stockStatus = getStockStatus(product.stock, product.minStock);
                                    return (
                                        <TableRow key={product.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {product.code}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {product.description}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={product.category}
                                                    size="small"
                                                    color="info"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={getStatusText(product.status)}
                                                    color={getStatusColor(product.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1" fontWeight="medium">
                                                    {product.price.toFixed(2)} $
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {product.stock}
                                                    </Typography>
                                                    <Chip
                                                        label={stockStatus.text}
                                                        color={stockStatus.color}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {product.supplier}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Voir détails">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewProduct(product)}
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Modifier">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditProduct(product)}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Dialog de détails/édition */}
            <Dialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    {dialogMode === 'view' ? 'Détails du Produit' :
                     dialogMode === 'edit' ? 'Modifier le Produit' :
                     'Nouveau Produit'}
                </DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Code Produit"
                                        value={selectedProduct.code}
                                        onChange={(e) => handleProductChange('code', e.target.value)}
                                        disabled={dialogMode === 'view'}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom du Produit"
                                        value={selectedProduct.name}
                                        onChange={(e) => handleProductChange('name', e.target.value)}
                                        disabled={dialogMode === 'view'}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={selectedProduct.description}
                                        onChange={(e) => handleProductChange('description', e.target.value)}
                                        disabled={dialogMode === 'view'}
                                        multiline
                                        rows={3}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Catégorie"
                                        value={selectedProduct.category}
                                        onChange={(e) => handleProductChange('category', e.target.value)}
                                        disabled={dialogMode === 'view'}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Fournisseur"
                                        value={selectedProduct.supplier}
                                        onChange={(e) => handleProductChange('supplier', e.target.value)}
                                        disabled={dialogMode === 'view'}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Prix"
                                        type="number"
                                        value={selectedProduct.price}
                                        onChange={(e) => handleProductChange('price', parseFloat(e.target.value) || 0)}
                                        disabled={dialogMode === 'view'}
                                        margin="normal"
                                        InputProps={{
                                            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Stock Actuel"
                                        type="number"
                                        value={selectedProduct.stock}
                                        onChange={(e) => handleProductChange('stock', parseInt(e.target.value) || 0)}
                                        disabled={dialogMode === 'view'}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Stock Minimum"
                                        type="number"
                                        value={selectedProduct.minStock}
                                        onChange={(e) => handleProductChange('minStock', parseInt(e.target.value) || 0)}
                                        disabled={dialogMode === 'view'}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Statut</InputLabel>
                                        <Select
                                            value={selectedProduct.status}
                                            onChange={(e) => handleProductChange('status', e.target.value)}
                                            disabled={dialogMode === 'view'}
                                            label="Statut"
                                        >
                                            <MenuItem value="active">Actif</MenuItem>
                                            <MenuItem value="inactive">Inactif</MenuItem>
                                            <MenuItem value="discontinued">Discontinué</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Unité de Production</InputLabel>
                                        <Select
                                            value={selectedProduct.recipe?.outputUnit || 'L'}
                                            onChange={(e) => handleRecipeChange('outputUnit', e.target.value)}
                                            disabled={dialogMode === 'view'}
                                            label="Unité de Production"
                                        >
                                            <MenuItem value="L">Litres (L)</MenuItem>
                                            <MenuItem value="kg">Kilogrammes (kg)</MenuItem>
                                            <MenuItem value="m³">Mètres cubes (m³)</MenuItem>
                                            <MenuItem value="unités">Unités</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Description de l'unité"
                                        value={selectedProduct.recipe?.outputDescription || ''}
                                        onChange={(e) => handleRecipeChange('outputDescription', e.target.value)}
                                        disabled={dialogMode === 'view'}
                                        margin="normal"
                                        placeholder="Ex: Litres d'huile moteur produite"
                                    />
                                </Grid>
                            </Grid>

                            {/* Recette */}
                            <Accordion sx={{ mt: 3 }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6">Recette de Production (Ratios)</Typography>
                                        {dialogMode !== 'view' && (
                                            <Chip label="Système de ratios" color="info" size="small" />
                                        )}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle2">
                                                Ingrédients :
                                            </Typography>
                                            {dialogMode !== 'view' && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Add />}
                                                    onClick={addIngredient}
                                                >
                                                    Ajouter
                                                </Button>
                                            )}
                                        </Box>
                                        
                                        {selectedProduct.recipe.ingredients.length === 0 ? (
                                            <Alert severity="info">
                                                Aucun ingrédient défini. Cliquez sur "Ajouter" pour commencer.
                                                <br /><strong>Système de ratios :</strong> Saisissez les quantités par unité de production 
                                                (ex: 8.5 ml/L = 8.5ml d'ingrédient par litre de produit fini).
                                            </Alert>
                                        ) : (
                                            <Box>
                                                <Alert severity="info" sx={{ mb: 2 }}>
                                                    <Typography variant="body2">
                                                        <strong>📏 Système de ratios :</strong> Les quantités sont exprimées par unité de production 
                                                        ({selectedProduct.recipe?.outputUnit || 'L'}). 
                                                        Le système calculera automatiquement les quantités selon la production demandée.
                                                    </Typography>
                                                </Alert>
                                                
                                                {selectedProduct.recipe.ingredients.map((ingredient, index) => (
                                                    <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} sm={3}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Nom"
                                                                    value={ingredient.name}
                                                                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                                                    disabled={dialogMode === 'view'}
                                                                    size="small"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6} sm={2}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Ratio"
                                                                    type="number"
                                                                    value={ingredient.ratio}
                                                                    onChange={(e) => updateIngredient(index, 'ratio', parseFloat(e.target.value) || 0)}
                                                                    disabled={dialogMode === 'view'}
                                                                    size="small"
                                                                    inputProps={{ step: "0.1", min: "0" }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6} sm={1.5}>
                                                                <FormControl fullWidth size="small">
                                                                    <InputLabel>Unité</InputLabel>
                                                                    <Select
                                                                        value={ingredient.unit}
                                                                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                                                                        disabled={dialogMode === 'view'}
                                                                        label="Unité"
                                                                    >
                                                                        <MenuItem value="ml">ml</MenuItem>
                                                                        <MenuItem value="g">g</MenuItem>
                                                                        <MenuItem value="kg">kg</MenuItem>
                                                                        <MenuItem value="L">L</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={2}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Tolérance"
                                                                    type="number"
                                                                    value={ingredient.tolerance}
                                                                    onChange={(e) => updateIngredient(index, 'tolerance', parseFloat(e.target.value) || 0)}
                                                                    disabled={dialogMode === 'view'}
                                                                    size="small"
                                                                    inputProps={{ step: "0.1", min: "0" }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={10} sm={2}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Description"
                                                                    value={ingredient.description}
                                                                    onChange={(e) => updateIngredient(index, 'description', e.target.value)}
                                                                    disabled={dialogMode === 'view'}
                                                                    size="small"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} sm={0.5}>
                                                                {dialogMode !== 'view' && (
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={() => removeIngredient(index)}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                        
                                                        {/* Aperçu du ratio */}
                                                        <Box sx={{ mt: 1, p: 1, backgroundColor: '#f0f8ff', borderRadius: 1 }}>
                                                            <Typography variant="caption" color="info.main">
                                                                <strong>Ratio:</strong> {ingredient.ratio} {ingredient.unit}/{selectedProduct.recipe?.outputUnit || 'L'} 
                                                                {ingredient.tolerance > 0 && ` (±${ingredient.tolerance} ${ingredient.unit})`}
                                                                <br />
                                                                <strong>Exemple pour 10 {selectedProduct.recipe?.outputUnit || 'L'}:</strong> {(ingredient.ratio * 10).toFixed(1)} {ingredient.unit}
                                                            </Typography>
                                                        </Box>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        )}
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Typography variant="subtitle2" gutterBottom>
                                            Instructions :
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={selectedProduct.recipe.instructions}
                                            onChange={(e) => handleRecipeChange('instructions', e.target.value)}
                                            disabled={dialogMode === 'view'}
                                            placeholder="Décrivez les étapes de production..."
                                        />
                                        
                                        <Box sx={{ mt: 2 }}>
                                            <TextField
                                                label="Temps estimé (minutes)"
                                                type="number"
                                                value={selectedProduct.recipe.estimatedTime}
                                                onChange={(e) => handleRecipeChange('estimatedTime', parseInt(e.target.value) || 0)}
                                                disabled={dialogMode === 'view'}
                                                size="small"
                                                sx={{ width: 200 }}
                                            />
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            {/* Tests qualité */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6">Tests de Qualité</Typography>
                                        {dialogMode !== 'view' && (
                                            <Chip label="Modifiable" color="primary" size="small" />
                                        )}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle2">
                                                Tests requis :
                                            </Typography>
                                            {dialogMode !== 'view' && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Add />}
                                                    onClick={addQualityTest}
                                                >
                                                    Ajouter Test
                                                </Button>
                                            )}
                                        </Box>
                                        
                                        {selectedProduct.qualityTests.length === 0 ? (
                                            <Alert severity="info">
                                                Aucun test qualité défini. Cliquez sur "Ajouter Test" pour commencer.
                                            </Alert>
                                        ) : (
                                            <Box>
                                                {selectedProduct.qualityTests.map((test, index) => (
                                                    <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} sm={3}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Nom du Test"
                                                                    value={test.name}
                                                                    onChange={(e) => updateQualityTest(index, 'name', e.target.value)}
                                                                    disabled={dialogMode === 'view'}
                                                                    size="small"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6} sm={2}>
                                                                <FormControl fullWidth size="small">
                                                                    <InputLabel>Type</InputLabel>
                                                                    <Select
                                                                        value={test.type}
                                                                        onChange={(e) => updateQualityTest(index, 'type', e.target.value)}
                                                                        disabled={dialogMode === 'view'}
                                                                        label="Type"
                                                                    >
                                                                        <MenuItem value="number">Numérique</MenuItem>
                                                                        <MenuItem value="select">Sélection</MenuItem>
                                                                        <MenuItem value="boolean">Oui/Non</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                            {test.type === 'number' && (
                                                                <>
                                                                    <Grid item xs={3} sm={1.5}>
                                                                        <TextField
                                                                            fullWidth
                                                                            label="Min"
                                                                            type="number"
                                                                            value={test.min || 0}
                                                                            onChange={(e) => updateQualityTest(index, 'min', parseFloat(e.target.value) || 0)}
                                                                            disabled={dialogMode === 'view'}
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={3} sm={1.5}>
                                                                        <TextField
                                                                            fullWidth
                                                                            label="Max"
                                                                            type="number"
                                                                            value={test.max || 100}
                                                                            onChange={(e) => updateQualityTest(index, 'max', parseFloat(e.target.value) || 100)}
                                                                            disabled={dialogMode === 'view'}
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={6} sm={1}>
                                                                        <TextField
                                                                            fullWidth
                                                                            label="Unité"
                                                                            value={test.unit || ''}
                                                                            onChange={(e) => updateQualityTest(index, 'unit', e.target.value)}
                                                                            disabled={dialogMode === 'view'}
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                </>
                                                            )}
                                                            {test.type === 'select' && (
                                                                <Grid item xs={6} sm={3}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Options (séparées par virgule)"
                                                                        value={test.options ? test.options.join(', ') : ''}
                                                                        onChange={(e) => updateQualityTest(index, 'options', e.target.value.split(', ').filter(opt => opt.trim()))}
                                                                        disabled={dialogMode === 'view'}
                                                                        size="small"
                                                                        placeholder="Option1, Option2, Option3"
                                                                    />
                                                                </Grid>
                                                            )}
                                                            <Grid item xs={8} sm={2}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Description"
                                                                    value={test.description || ''}
                                                                    onChange={(e) => updateQualityTest(index, 'description', e.target.value)}
                                                                    disabled={dialogMode === 'view'}
                                                                    size="small"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} sm={1}>
                                                                {dialogMode !== 'view' && (
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={() => removeQualityTest(index)}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDialog(false)}>
                        {dialogMode === 'view' ? 'Fermer' : 'Annuler'}
                    </Button>
                    {dialogMode !== 'view' && (
                        <Button 
                            variant="contained" 
                            onClick={handleSaveProduct}
                            disabled={!selectedProduct?.name || !selectedProduct?.code}
                        >
                            {dialogMode === 'edit' ? 'Sauvegarder' : 'Créer Produit'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ProductsManagement;