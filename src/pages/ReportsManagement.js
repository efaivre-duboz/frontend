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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DatePicker,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Menu,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Divider,
    LinearProgress
} from '@mui/material';
import {
    Assessment,
    TrendingUp,
    TrendingDown,
    GetApp,
    BarChart,
    PieChart,
    Timeline,
    CheckCircle,
    Error,
    Warning,
    FileDownload,
    TableChart,
    Print,
    Visibility,
    DateRange
} from '@mui/icons-material';
import { useAuth } from '../App';

function ReportsManagement() {
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [dateRange, setDateRange] = useState('month');
    const [productFilter, setProductFilter] = useState('all');
    const [operatorFilter, setOperatorFilter] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [reportData, setReportData] = useState({});

    const { user } = useAuth();

    // Données de rapport simulées
    const mockReportData = {
        summary: {
            totalBatches: 47,
            successfulBatches: 42,
            failedBatches: 3,
            inProgressBatches: 2,
            totalQuantity: 15750,
            successRate: 89.4,
            averageProductionTime: 95, // minutes
            topProduct: 'Huile Moteur 5W-30'
        },
        productionTrends: [
            { date: '2024-01-01', batches: 8, quantity: 2100, success: 7 },
            { date: '2024-01-02', batches: 6, quantity: 1800, success: 6 },
            { date: '2024-01-03', batches: 5, quantity: 1550, success: 4 },
            { date: '2024-01-04', batches: 7, quantity: 2000, success: 6 },
            { date: '2024-01-05', batches: 9, quantity: 2300, success: 8 },
            { date: '2024-01-08', batches: 4, quantity: 1200, success: 4 },
            { date: '2024-01-09', batches: 8, quantity: 2500, success: 7 }
        ],
        productStats: [
            {
                product: 'Huile Moteur 5W-30',
                code: 'PROD001',
                batches: 18,
                totalQuantity: 6500,
                successRate: 94.4,
                avgTime: 105,
                failureRate: 5.6
            },
            {
                product: 'Graisse Multi-Usage',
                code: 'PROD002',
                batches: 12,
                totalQuantity: 3200,
                successRate: 83.3,
                avgTime: 85,
                failureRate: 16.7
            },
            {
                product: 'Fluide Hydraulique ISO 46',
                code: 'PROD003',
                batches: 10,
                totalQuantity: 4500,
                successRate: 90.0,
                avgTime: 75,
                failureRate: 10.0
            },
            {
                product: 'Dégraissant Industriel',
                code: 'PROD004',
                batches: 7,
                totalQuantity: 1550,
                successRate: 71.4,
                avgTime: 60,
                failureRate: 28.6
            }
        ],
        operatorStats: [
            {
                name: 'Jean Dupont',
                batches: 15,
                successRate: 93.3,
                avgTime: 98,
                totalQuantity: 4200,
                efficiency: 'Excellent'
            },
            {
                name: 'Marie Tremblay',
                batches: 13,
                successRate: 92.3,
                avgTime: 88,
                totalQuantity: 3800,
                efficiency: 'Excellent'
            },
            {
                name: 'Pierre Lafond',
                batches: 11,
                successRate: 81.8,
                avgTime: 102,
                totalQuantity: 3200,
                efficiency: 'Bon'
            },
            {
                name: 'Sophie Martin',
                batches: 8,
                successRate: 87.5,
                avgTime: 95,
                totalQuantity: 2550,
                efficiency: 'Bon'
            }
        ],
        qualityTrends: [
            { test: 'Viscosité', conformRate: 96.2, totalTests: 52 },
            { test: 'Point d\'éclair', conformRate: 98.1, totalTests: 52 },
            { test: 'Apparence visuelle', conformRate: 94.2, totalTests: 52 },
            { test: 'pH', conformRate: 89.3, totalTests: 28 },
            { test: 'Pénétration', conformRate: 85.7, totalTests: 21 }
        ],
        alerts: [
            {
                type: 'warning',
                message: 'Taux d\'échec élevé pour le Dégraissant Industriel (28.6%)',
                date: '2024-01-15'
            },
            {
                type: 'info',
                message: 'Performance excellente de Jean Dupont ce mois-ci',
                date: '2024-01-14'
            },
            {
                type: 'error',
                message: '3 lots non conformes cette semaine - Investigation requise',
                date: '2024-01-13'
            }
        ]
    };

    useEffect(() => {
        setLoading(true);
        // Simulation du chargement des données
        const timer = setTimeout(() => {
            setReportData(mockReportData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [dateRange, productFilter, operatorFilter]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleExportMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleExportMenuClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (format, reportType) => {
        setAnchorEl(null);
        
        if (format === 'csv') {
            exportToCSV(reportType);
        } else if (format === 'excel') {
            exportToExcel(reportType);
        } else if (format === 'pdf') {
            exportToPDF(reportType);
        }
    };

    const exportToCSV = (reportType) => {
        let csvContent = '';
        let filename = '';

        switch (reportType) {
            case 'production':
                const headers = ['Produit', 'Code', 'Lots', 'Quantité Total', 'Taux Succès (%)', 'Temps Moyen (min)'];
                csvContent = [
                    headers.join(','),
                    ...reportData.productStats.map(product => [
                        `"${product.product}"`,
                        product.code,
                        product.batches,
                        product.totalQuantity,
                        product.successRate,
                        product.avgTime
                    ].join(','))
                ].join('\n');
                filename = `rapport_production_${new Date().toISOString().slice(0, 10)}.csv`;
                break;

            case 'operators':
                const opHeaders = ['Opérateur', 'Lots', 'Taux Succès (%)', 'Temps Moyen (min)', 'Quantité Total', 'Efficacité'];
                csvContent = [
                    opHeaders.join(','),
                    ...reportData.operatorStats.map(operator => [
                        `"${operator.name}"`,
                        operator.batches,
                        operator.successRate,
                        operator.avgTime,
                        operator.totalQuantity,
                        `"${operator.efficiency}"`
                    ].join(','))
                ].join('\n');
                filename = `rapport_operateurs_${new Date().toISOString().slice(0, 10)}.csv`;
                break;

            case 'quality':
                const qualHeaders = ['Test', 'Taux Conformité (%)', 'Total Tests'];
                csvContent = [
                    qualHeaders.join(','),
                    ...reportData.qualityTrends.map(quality => [
                        `"${quality.test}"`,
                        quality.conformRate,
                        quality.totalTests
                    ].join(','))
                ].join('\n');
                filename = `rapport_qualite_${new Date().toISOString().slice(0, 10)}.csv`;
                break;

            default:
                csvContent = 'Type de rapport non supporté';
                filename = 'rapport_erreur.csv';
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = (reportType) => {
        alert(`Export Excel simulé pour ${reportType} - En production, ceci utiliserait une bibliothèque comme SheetJS`);
    };

    const exportToPDF = (reportType) => {
        alert(`Export PDF simulé pour ${reportType} - En production, ceci utiliserait une bibliothèque comme jsPDF`);
    };

    const getEfficiencyColor = (efficiency) => {
        switch (efficiency) {
            case 'Excellent': return 'success';
            case 'Bon': return 'primary';
            case 'Moyen': return 'warning';
            case 'Faible': return 'error';
            default: return 'default';
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'error': return <Error color="error" />;
            case 'warning': return <Warning color="warning" />;
            case 'info': return <CheckCircle color="info" />;
            default: return <CheckCircle />;
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    };

    // Onglet Vue d'ensemble
    const OverviewTab = () => (
        <Box>
            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <Assessment />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="primary">
                                        {reportData.summary?.totalBatches}
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
                                    <TrendingUp />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="success.main">
                                        {reportData.summary?.successRate}%
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Taux de Succès
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
                                    <BarChart />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="info.main">
                                        {reportData.summary?.totalQuantity?.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Quantité Totale
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
                                    <Timeline />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="warning.main">
                                        {formatDuration(reportData.summary?.averageProductionTime)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Temps Moyen
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Graphiques et tendances */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Tendances de Production
                        </Typography>
                        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="textSecondary">
                                [Graphique de tendances - Intégration Chart.js recommandée]
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Répartition Qualité
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Conformes</Typography>
                                <Typography variant="body2">{reportData.summary?.successfulBatches}</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(reportData.summary?.successfulBatches / reportData.summary?.totalBatches) * 100} 
                                color="success"
                                sx={{ mb: 2 }}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Non Conformes</Typography>
                                <Typography variant="body2">{reportData.summary?.failedBatches}</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(reportData.summary?.failedBatches / reportData.summary?.totalBatches) * 100} 
                                color="error"
                                sx={{ mb: 2 }}
                            />
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">En Cours</Typography>
                                <Typography variant="body2">{reportData.summary?.inProgressBatches}</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(reportData.summary?.inProgressBatches / reportData.summary?.totalBatches) * 100} 
                                color="warning"
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Alertes */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Alertes et Notifications
                </Typography>
                {reportData.alerts?.map((alert, index) => (
                    <Alert 
                        key={index} 
                        severity={alert.type} 
                        sx={{ mb: 1 }}
                        icon={getAlertIcon(alert.type)}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                                {alert.message}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {new Date(alert.date).toLocaleDateString('fr-FR')}
                            </Typography>
                        </Box>
                    </Alert>
                ))}
            </Paper>
        </Box>
    );

    // Onglet Production
    const ProductionTab = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Rapport de Production par Produit
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<GetApp />}
                    onClick={handleExportMenuOpen}
                >
                    Exporter Production
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produit</TableCell>
                            <TableCell align="center">Lots Produits</TableCell>
                            <TableCell align="center">Quantité Totale</TableCell>
                            <TableCell align="center">Taux Succès</TableCell>
                            <TableCell align="center">Temps Moyen</TableCell>
                            <TableCell align="center">Taux Échec</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData.productStats?.map((product, index) => (
                            <TableRow key={index} hover>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body1" fontWeight="medium">
                                            {product.product}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {product.code}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body1" fontWeight="medium">
                                        {product.batches}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body1">
                                        {product.totalQuantity.toLocaleString()}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <Typography 
                                            variant="body1" 
                                            fontWeight="medium"
                                            color={product.successRate >= 90 ? 'success.main' : 
                                                   product.successRate >= 80 ? 'warning.main' : 'error.main'}
                                        >
                                            {product.successRate}%
                                        </Typography>
                                        {product.successRate >= 90 ? <TrendingUp color="success" fontSize="small" /> : 
                                         product.successRate >= 80 ? <Warning color="warning" fontSize="small" /> : 
                                         <TrendingDown color="error" fontSize="small" />}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body1">
                                        {formatDuration(product.avgTime)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={`${product.failureRate}%`}
                                        color={product.failureRate <= 10 ? 'success' : 
                                               product.failureRate <= 20 ? 'warning' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    // Onglet Opérateurs
    const OperatorsTab = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Performance des Opérateurs
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<GetApp />}
                    onClick={handleExportMenuOpen}
                >
                    Exporter Opérateurs
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Opérateur</TableCell>
                            <TableCell align="center">Lots</TableCell>
                            <TableCell align="center">Taux Succès</TableCell>
                            <TableCell align="center">Temps Moyen</TableCell>
                            <TableCell align="center">Quantité</TableCell>
                            <TableCell align="center">Efficacité</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData.operatorStats?.map((operator, index) => (
                            <TableRow key={index} hover>
                                <TableCell>
                                    <Typography variant="body1" fontWeight="medium">
                                        {operator.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body1">
                                        {operator.batches}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography 
                                        variant="body1" 
                                        fontWeight="medium"
                                        color={operator.successRate >= 90 ? 'success.main' : 
                                               operator.successRate >= 80 ? 'warning.main' : 'error.main'}
                                    >
                                        {operator.successRate}%
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body1">
                                        {formatDuration(operator.avgTime)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body1">
                                        {operator.totalQuantity.toLocaleString()}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={operator.efficiency}
                                        color={getEfficiencyColor(operator.efficiency)}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    // Onglet Qualité
    const QualityTab = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Rapport de Qualité
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<GetApp />}
                    onClick={handleExportMenuOpen}
                >
                    Exporter Qualité
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Test de Qualité</TableCell>
                            <TableCell align="center">Taux de Conformité</TableCell>
                            <TableCell align="center">Total Tests</TableCell>
                            <TableCell align="center">Statut</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData.qualityTrends?.map((quality, index) => (
                            <TableRow key={index} hover>
                                <TableCell>
                                    <Typography variant="body1" fontWeight="medium">
                                        {quality.test}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <Typography 
                                            variant="body1" 
                                            fontWeight="medium"
                                            color={quality.conformRate >= 95 ? 'success.main' : 
                                                   quality.conformRate >= 85 ? 'warning.main' : 'error.main'}
                                        >
                                            {quality.conformRate}%
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={quality.conformRate}
                                            color={quality.conformRate >= 95 ? 'success' : 
                                                   quality.conformRate >= 85 ? 'warning' : 'error'}
                                            sx={{ width: 60, ml: 1 }}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body1">
                                        {quality.totalTests}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={quality.conformRate >= 95 ? 'Excellent' : 
                                               quality.conformRate >= 85 ? 'Bon' : 'À améliorer'}
                                        color={quality.conformRate >= 95 ? 'success' : 
                                               quality.conformRate >= 85 ? 'warning' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* En-tête */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                    Rapports et Analyses
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Analyses détaillées des performances de production
                </Typography>
            </Box>

            {/* Filtres */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Période</InputLabel>
                            <Select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                label="Période"
                                startAdornment={<DateRange sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="week">Cette semaine</MenuItem>
                                <MenuItem value="month">Ce mois</MenuItem>
                                <MenuItem value="quarter">Ce trimestre</MenuItem>
                                <MenuItem value="year">Cette année</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Produit</InputLabel>
                            <Select
                                value={productFilter}
                                onChange={(e) => setProductFilter(e.target.value)}
                                label="Produit"
                            >
                                <MenuItem value="all">Tous les produits</MenuItem>
                                <MenuItem value="PROD001">Huile Moteur 5W-30</MenuItem>
                                <MenuItem value="PROD002">Graisse Multi-Usage</MenuItem>
                                <MenuItem value="PROD003">Fluide Hydraulique ISO 46</MenuItem>
                                <MenuItem value="PROD004">Dégraissant Industriel</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Opérateur</InputLabel>
                            <Select
                                value={operatorFilter}
                                onChange={(e) => setOperatorFilter(e.target.value)}
                                label="Opérateur"
                            >
                                <MenuItem value="all">Tous les opérateurs</MenuItem>
                                <MenuItem value="1">Jean Dupont</MenuItem>
                                <MenuItem value="2">Marie Tremblay</MenuItem>
                                <MenuItem value="3">Pierre Lafond</MenuItem>
                                <MenuItem value="4">Sophie Martin</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<Print />}
                                fullWidth
                                onClick={() => window.print()}
                            >
                                Imprimer
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<GetApp />}
                                onClick={handleExportMenuOpen}
                            >
                                Export
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
                <MenuItem onClick={() => handleExport('csv', 'production')}>
                    <FileDownload sx={{ mr: 2 }} />
                    Production CSV
                </MenuItem>
                <MenuItem onClick={() => handleExport('excel', 'production')}>
                    <TableChart sx={{ mr: 2 }} />
                    Production Excel
                </MenuItem>
                <MenuItem onClick={() => handleExport('csv', 'operators')}>
                    <FileDownload sx={{ mr: 2 }} />
                    Opérateurs CSV
                </MenuItem>
                <MenuItem onClick={() => handleExport('excel', 'operators')}>
                    <TableChart sx={{ mr: 2 }} />
                    Opérateurs Excel
                </MenuItem>
                <MenuItem onClick={() => handleExport('csv', 'quality')}>
                    <FileDownload sx={{ mr: 2 }} />
                    Qualité CSV
                </MenuItem>
                <MenuItem onClick={() => handleExport('pdf', 'complete')}>
                    <Print sx={{ mr: 2 }} />
                    Rapport Complet PDF
                </MenuItem>
            </Menu>

            {/* Contenu principal avec onglets */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper>
                    <Tabs 
                        value={selectedTab} 
                        onChange={handleTabChange}
                        sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
                    >
                        <Tab 
                            label="Vue d'ensemble" 
                            icon={<Assessment />}
                            iconPosition="start"
                        />
                        <Tab 
                            label="Production" 
                            icon={<BarChart />}
                            iconPosition="start"
                        />
                        <Tab 
                            label="Opérateurs" 
                            icon={<Timeline />}
                            iconPosition="start"
                        />
                        <Tab 
                            label="Qualité" 
                            icon={<CheckCircle />}
                            iconPosition="start"
                        />
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                        {selectedTab === 0 && <OverviewTab />}
                        {selectedTab === 1 && <ProductionTab />}
                        {selectedTab === 2 && <OperatorsTab />}
                        {selectedTab === 3 && <QualityTab />}
                    </Box>
                </Paper>
            )}

            {/* Résumé en bas de page */}
            <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                    Résumé Exécutif
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Produit le plus performant"
                                    secondary={reportData.summary?.topProduct}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Taux de succès global"
                                    secondary={`${reportData.summary?.successRate}% (Objectif: 95%)`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Temps de production moyen"
                                    secondary={formatDuration(reportData.summary?.averageProductionTime)}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                            Recommandations :
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="• Améliorer le processus du Dégraissant Industriel"
                                    secondary="Taux d'échec élevé (28.6%)"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="• Formation supplémentaire pour Pierre Lafond"
                                    secondary="Performance en dessous de la moyenne"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="• Révision des tests de pénétration"
                                    secondary="Taux de conformité à améliorer (85.7%)"
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                        Rapport généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')} • 
                        ProdMaster v1.0 • Envirolin Canada
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default ReportsManagement;