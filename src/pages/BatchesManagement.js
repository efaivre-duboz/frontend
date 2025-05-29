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
    CircularProgress,
    TablePagination,
    DatePicker
} from '@mui/material';
import {
    Visibility,
    GetApp,
    Search,
    FilterList,
    Assignment,
    CheckCircle,
    Error,
    Warning,
    ExpandMore,
    FileDownload,
    TableChart,
    Timeline,
    Person,
    Schedule
} from '@mui/icons-material';
import { useAuth } from '../App';

function BatchesManagement() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { user } = useAuth();

    // Données de démonstration
    const mockBatches = [
        {
            id: 1,
            batchNumber: 'PROD001-20240115-001',
            productCode: 'PROD001',
            productName: 'Huile Moteur 5W-30',
            quantity: 500,
            status: 'completed',
            qualityResult: 'passed',
            operatorName: 'Jean Dupont',
            operatorId: 1,
            startTime: '2024-01-15T08:30:00',
            endTime: '2024-01-15T10:15:00',
            duration: 105, // minutes
            ingredients: [
                { name: 'Base synthétique', expected: 425, actual: 427, variance: 0.47 },
                { name: 'Additifs détergents', expected: 50, actual: 49.8, variance: -0.4 },
                { name: 'Modificateurs viscosité', expected: 25, actual: 25.2, variance: 0.8 }
            ],
            qualityTests: [
                { name: 'Viscosité', result: 30.2, status: 'passed', expected: '29-31 cSt' },
                { name: 'Point d\'éclair', result: 235, status: 'passed', expected: '220-240 °C' },
                { name: 'Apparence', result: 'Claire', status: 'passed', expected: 'Claire/Trouble' }
            ],
            notes: 'Production normale, tous les paramètres dans les normes',
            temperature: 22,
            humidity: 45
        },
        {
            id: 2,
            batchNumber: 'PROD002-20240114-002',
            productCode: 'PROD002',
            productName: 'Graisse Multi-Usage',
            quantity: 250,
            status: 'completed',
            qualityResult: 'failed',
            operatorName: 'Pierre Lafond',
            operatorId: 3,
            startTime: '2024-01-14T14:00:00',
            endTime: '2024-01-14T15:30:00',
            duration: 90,
            ingredients: [
                { name: 'Huile de base', expected: 175, actual: 178, variance: 1.71 },
                { name: 'Savon de lithium', expected: 62.5, actual: 65, variance: 4.0 },
                { name: 'Antioxydants', expected: 12.5, actual: 12.5, variance: 0 }
            ],
            qualityTests: [
                { name: 'Pénétration', result: 305, status: 'failed', expected: '265-295 0.1mm' },
                { name: 'Point de goutte', result: 195, status: 'passed', expected: '180-220 °C' }
            ],
            notes: 'Échec du test de pénétration - Lot rejeté pour retraitement',
            temperature: 24,
            humidity: 50
        },
        {
            id: 3,
            batchNumber: 'PROD003-20240113-001',
            productCode: 'PROD003',
            productName: 'Fluide Hydraulique ISO 46',
            quantity: 1000,
            status: 'in_progress',
            qualityResult: 'pending',
            operatorName: 'Marie Tremblay',
            operatorId: 2,
            startTime: '2024-01-13T09:15:00',
            endTime: null,
            duration: null,
            ingredients: [
                { name: 'Huile de base ISO 46', expected: 900, actual: 900, variance: 0 },
                { name: 'Anti-mousse', expected: 50, actual: 51, variance: 2.0 },
                { name: 'Anti-usure', expected: 50, actual: 49, variance: -2.0 }
            ],
            qualityTests: [],
            notes: 'Production en cours - Étape qualité en attente',
            temperature: 21,
            humidity: 42
        },
        {
            id: 4,
            batchNumber: 'PROD001-20240112-003',
            productCode: 'PROD001',
            productName: 'Huile Moteur 5W-30',
            quantity: 750,
            status: 'completed',
            qualityResult: 'passed',
            operatorName: 'Sophie Martin',
            operatorId: 4,
            startTime: '2024-01-12T11:00:00',
            endTime: '2024-01-12T13:20:00',
            duration: 140,
            ingredients: [
                { name: 'Base synthétique', expected: 637.5, actual: 640, variance: 0.39 },
                { name: 'Additifs détergents', expected: 75, actual: 74.5, variance: -0.67 },
                { name: 'Modificateurs viscosité', expected: 37.5, actual: 37.8, variance: 0.8 }
            ],
            qualityTests: [
                { name: 'Viscosité', result: 30.8, status: 'passed', expected: '29-31 cSt' },
                { name: 'Point d\'éclair', result: 228, status: 'passed', expected: '220-240 °C' },
                { name: 'Apparence', result: 'Claire', status: 'passed', expected: 'Claire/Trouble' }
            ],
            notes: 'Excellente production, paramètres optimaux',
            temperature: 20,
            humidity: 48
        },
        {
            id: 5,
            batchNumber: 'PROD004-20240111-001',
            productCode: 'PROD004',
            productName: 'Dégraissant Industriel',
            quantity: 300,
            status: 'cancelled',
            qualityResult: 'n/a',
            operatorName: 'Jean Dupont',
            operatorId: 1,
            startTime: '2024-01-11T16:00:00',
            endTime: '2024-01-11T16:45:00',
            duration: 45,
            ingredients: [
                { name: 'Solvant biodégradable', expected: 240, actual: 125, variance: -47.9 },
                { name: 'Tensioactifs', expected: 45, actual: 0, variance: -100 },
                { name: 'Inhibiteurs corrosion', expected: 15, actual: 0, variance: -100 }
            ],
            qualityTests: [],
            notes: 'Production annulée - Problème d\'approvisionnement matières premières',
            temperature: 23,
            humidity: 52
        }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setBatches(mockBatches);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterStatusChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const handleFilterPeriodChange = (event) => {
        setFilterPeriod(event.target.value);
    };

    const getFilteredBatches = () => {
        return batches.filter(batch => {
            const matchesSearch = batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                batch.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
            
            let matchesPeriod = true;
            if (filterPeriod !== 'all') {
                const batchDate = new Date(batch.startTime);
                const now = new Date();
                const daysDiff = (now - batchDate) / (1000 * 60 * 60 * 24);
                
                switch (filterPeriod) {
                    case 'today':
                        matchesPeriod = daysDiff < 1;
                        break;
                    case 'week':
                        matchesPeriod = daysDiff < 7;
                        break;
                    case 'month':
                        matchesPeriod = daysDiff < 30;
                        break;
                    default:
                        matchesPeriod = true;
                }
            }
            
            return matchesSearch && matchesStatus && matchesPeriod;
        });
    };

    const filteredBatches = getFilteredBatches();
    const paginatedBatches = filteredBatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleViewBatch = (batch) => {
        setSelectedBatch(batch);
        setShowDialog(true);
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
        const headers = [
            'Numéro Lot',
            'Produit',
            'Quantité',
            'Statut',
            'Résultat Qualité',
            'Opérateur',
            'Date Début',
            'Date Fin',
            'Durée (min)',
            'Température',
            'Humidité',
            'Notes'
        ];

        const csvContent = [
            headers.join(','),
            ...filteredBatches.map(batch => [
                batch.batchNumber,
                `"${batch.productName}"`,
                batch.quantity,
                batch.status,
                batch.qualityResult,
                `"${batch.operatorName}"`,
                new Date(batch.startTime).toLocaleString('fr-FR'),
                batch.endTime ? new Date(batch.endTime).toLocaleString('fr-FR') : '',
                batch.duration || '',
                batch.temperature,
                batch.humidity,
                `"${batch.notes}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `lots_production_${new Date().toISOString().slice(0, 10)}.csv`);
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
            case 'completed': return 'success';
            case 'in_progress': return 'info';
            case 'cancelled': return 'error';
            case 'failed': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Terminé';
            case 'in_progress': return 'En cours';
            case 'cancelled': return 'Annulé';
            case 'failed': return 'Échec';
            default: return status;
        }
    };

    const getQualityColor = (result) => {
        switch (result) {
            case 'passed': return 'success';
            case 'failed': return 'error';
            case 'pending': return 'warning';
            case 'n/a': return 'default';
            default: return 'default';
        }
    };

    const getQualityText = (result) => {
        switch (result) {
            case 'passed': return 'Conforme';
            case 'failed': return 'Non conforme';
            case 'pending': return 'En attente';
            case 'n/a': return 'N/A';
            default: return result;
        }
    };

    const formatDuration = (minutes) => {
        if (!minutes) return '-';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* En-tête */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                    Gestion des Lots de Production
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Historique et suivi des lots de production
                </Typography>
            </Box>

            {/* Statistiques */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <Assignment />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="primary">
                                        {batches.length}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Lots
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
                                    <CheckCircle />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="success.main">
                                        {batches.filter(b => b.qualityResult === 'passed').length}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Conformes
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
                                <Avatar sx={{ bgcolor: 'error.main' }}>
                                    <Error />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="error.main">
                                        {batches.filter(b => b.qualityResult === 'failed').length}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Non Conformes
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
                                    <Timeline />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="info.main">
                                        {batches.filter(b => b.status === 'in_progress').length}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        En Cours
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
                            placeholder="Rechercher un lot..."
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={filterStatus}
                                onChange={handleFilterStatusChange}
                                label="Statut"
                            >
                                <MenuItem value="all">Tous</MenuItem>
                                <MenuItem value="completed">Terminés</MenuItem>
                                <MenuItem value="in_progress">En cours</MenuItem>
                                <MenuItem value="cancelled">Annulés</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Période</InputLabel>
                            <Select
                                value={filterPeriod}
                                onChange={handleFilterPeriodChange}
                                label="Période"
                            >
                                <MenuItem value="all">Toutes</MenuItem>
                                <MenuItem value="today">Aujourd'hui</MenuItem>
                                <MenuItem value="week">Cette semaine</MenuItem>
                                <MenuItem value="month">Ce mois</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<GetApp />}
                                onClick={handleExportMenuOpen}
                            >
                                Exporter
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

            {/* Tableau des lots */}
            <Paper>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Numéro de Lot</TableCell>
                                        <TableCell>Produit</TableCell>
                                        <TableCell align="center">Quantité</TableCell>
                                        <TableCell align="center">Statut</TableCell>
                                        <TableCell align="center">Qualité</TableCell>
                                        <TableCell>Opérateur</TableCell>
                                        <TableCell>Date/Durée</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedBatches.map((batch) => (
                                        <TableRow key={batch.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {batch.batchNumber}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {batch.productName}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {batch.productCode}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body1" fontWeight="medium">
                                                    {batch.quantity}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={getStatusText(batch.status)}
                                                    color={getStatusColor(batch.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={getQualityText(batch.qualityResult)}
                                                    color={getQualityColor(batch.qualityResult)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Person fontSize="small" color="primary" />
                                                    <Typography variant="body2">
                                                        {batch.operatorName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2">
                                                        {new Date(batch.startTime).toLocaleDateString('fr-FR')}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Schedule fontSize="small" color="textSecondary" />
                                                        <Typography variant="caption" color="textSecondary">
                                                            {formatDuration(batch.duration)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Voir détails">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewBatch(batch)}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <TablePagination
                            component="div"
                            count={filteredBatches.length}
                            page={page}
                            onPageChange={(event, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage(parseInt(event.target.value, 10));
                                setPage(0);
                            }}
                            labelRowsPerPage="Lignes par page:"
                        />
                    </>
                )}
            </Paper>

            {/* Dialog de détails du lot */}
            <Dialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Détails du Lot de Production
                </DialogTitle>
                <DialogContent>
                    {selectedBatch && (
                        <Box sx={{ mt: 2 }}>
                            {/* Informations générales */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Informations Générales
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Numéro de Lot"
                                                        secondary={selectedBatch.batchNumber}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Produit"
                                                        secondary={selectedBatch.productName}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Quantité"
                                                        secondary={`${selectedBatch.quantity} unités`}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Opérateur"
                                                        secondary={selectedBatch.operatorName}
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
                                                Conditions de Production
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Date de début"
                                                        secondary={new Date(selectedBatch.startTime).toLocaleString('fr-FR')}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Date de fin"
                                                        secondary={selectedBatch.endTime ? 
                                                            new Date(selectedBatch.endTime).toLocaleString('fr-FR') : 
                                                            'En cours'
                                                        }
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Durée"
                                                        secondary={formatDuration(selectedBatch.duration)}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Température / Humidité"
                                                        secondary={`${selectedBatch.temperature}°C / ${selectedBatch.humidity}%`}
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Ingrédients */}
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="h6">Ingrédients Utilisés</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Ingrédient</TableCell>
                                                    <TableCell align="center">Prévu</TableCell>
                                                    <TableCell align="center">Réel</TableCell>
                                                    <TableCell align="center">Écart (%)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedBatch.ingredients.map((ingredient, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{ingredient.name}</TableCell>
                                                        <TableCell align="center">{ingredient.expected}</TableCell>
                                                        <TableCell align="center">{ingredient.actual}</TableCell>
                                                        <TableCell align="center">
                                                            <Typography
                                                                variant="body2"
                                                                color={Math.abs(ingredient.variance) > 5 ? 'error' : 'success'}
                                                                fontWeight="medium"
                                                            >
                                                                {ingredient.variance > 0 ? '+' : ''}{ingredient.variance.toFixed(1)}%
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>

                            {/* Tests qualité */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="h6">Tests de Qualité</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {selectedBatch.qualityTests.length > 0 ? (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Test</TableCell>
                                                        <TableCell align="center">Résultat</TableCell>
                                                        <TableCell align="center">Critères</TableCell>
                                                        <TableCell align="center">Statut</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectedBatch.qualityTests.map((test, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{test.name}</TableCell>
                                                            <TableCell align="center">{test.result}</TableCell>
                                                            <TableCell align="center">{test.expected}</TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={test.status === 'passed' ? 'Conforme' : 'Non conforme'}
                                                                    color={test.status === 'passed' ? 'success' : 'error'}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Typography color="textSecondary">
                                            Aucun test qualité effectué ou en attente
                                        </Typography>
                                    )}
                                </AccordionDetails>
                            </Accordion>

                            {/* Notes */}
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Notes de Production
                                </Typography>
                                <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                                    <Typography variant="body1">
                                        {selectedBatch.notes}
                                    </Typography>
                                </Paper>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDialog(false)}>
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default BatchesManagement;