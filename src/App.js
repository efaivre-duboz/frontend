import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
    CssBaseline, 
    Box, 
    Container, 
    Paper, 
    Typography, 
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent,
    Chip
} from '@mui/material';

// Importation de tes composants
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Naviguation';
import ProductionScan from './pages/ProductionScan';
import ProductionRecipe from './pages/ProductionRecipe';
import ProductionIngredients from './pages/ProductionIngredients';
import QualityControl from './pages/QualityControl';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './pages/Login';
import ProductsManagement from './pages/ProductsManagement';
import BatchesManagement from './pages/BatchesManagement';
import ReportsManagement from './pages/ReportsManagement';

// Contexte d'authentification
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Thème Material-UI - Envirolin (Rouge et Noir)
const theme = createTheme({
  palette: {
    primary: {
      main: '#E30613', // Rouge Envirolin
      light: '#ff4444',
      dark: '#B30000',
    },
    secondary: {
      main: '#1a1a1a', // Noir
      light: '#424242',
      dark: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
    h6: {
      fontWeight: 'medium',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#E30613',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#E30613',
          '&:hover': {
            backgroundColor: '#B30000',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(227, 6, 19, 0.1)',
        },
        bar: {
          backgroundColor: '#E30613',
        },
      },
    },
  },
});

// Composant Dashboard principal
function Dashboard() {
  const { user } = useAuth();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            component="img"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSI2MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNFMzA2MTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVudmlyb2xpbjwvdGV4dD4KPHRleHQgeD0iNjAiIHk9IjM1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiMxYTFhMWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbmFkYSBEaXN0cmlidXRldXI8L3RleHQ+Cjx0ZXh0IHg9IjYwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMWExYTFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5kZSBMdWJyaWZpYW50czwvdGV4dD4KPHN2Zz4="
            alt="Envirolin Logo"
            sx={{ height: 40 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              ProdMaster
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Système de gestion de production Envirolin
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Bienvenue, {user?.name} !
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Utilisez le menu de navigation pour accéder aux différentes fonctionnalités du système de production.
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🔬 Production
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Démarrez une nouvelle production en scannant un code produit ou en saisissant manuellement les informations.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/scan'}
              >
                Commencer Production
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                📊 Statistiques
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Consultez les statistiques de production et les rapports de qualité.
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                disabled
              >
                Voir Rapports
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

// Composant principal de production qui gère le workflow
function ProductionWorkflow() {
    const [currentStep, setCurrentStep] = useState('scan');
    const [batchData, setBatchData] = useState(null);
    const [productData, setProductData] = useState(null);

    const handleStartProduction = (batch, product) => {
        console.log('🚀 Démarrage production:', { batch, product });
        setBatchData(batch);
        setProductData(product);
        setCurrentStep('ingredients'); // Passer directement aux ingrédients
    };

    const handleStepComplete = (updatedBatch, updatedProduct) => {
        console.log('✅ Étape complétée:', currentStep, { updatedBatch, updatedProduct });
        setBatchData(updatedBatch);
        if (updatedProduct) {
            setProductData(updatedProduct);
        }

        // Déterminer la prochaine étape
        switch (currentStep) {
            case 'recipe':
                setCurrentStep('ingredients');
                break;
            case 'ingredients':
                setCurrentStep('quality');
                break;
            case 'quality':
                setCurrentStep('completed');
                break;
            default:
                break;
        }
    };

    const handleReset = () => {
        setCurrentStep('scan');
        setBatchData(null);
        setProductData(null);
    };

    // Rendu conditionnel selon l'étape
    switch (currentStep) {
        case 'scan':
            return <ProductionScan onStartProduction={handleStartProduction} />;
        
        case 'recipe':
            return (
                <ProductionRecipe 
                    batchData={batchData}
                    productData={productData}
                    onContinue={handleStepComplete}
                />
            );
        
        case 'ingredients':
            return (
                <ProductionIngredients 
                    batchData={batchData}
                    productData={productData}
                    onContinue={handleStepComplete}
                />
            );
        
        case 'quality':
            return (
                <QualityControl 
                    batchData={batchData}
                    productData={productData}
                    onContinue={handleStepComplete}
                />
            );
        
        case 'completed':
            return (
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom color="primary">
                            🎉 Production Terminée !
                        </Typography>
                        <Box sx={{ my: 3 }}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Lot:</strong> {batchData?.batchNumber}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Produit:</strong> {productData?.name}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Quantité:</strong> {batchData?.quantity} unités
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Statut:</strong> Terminé avec succès
                            </Typography>
                            {batchData?.totalPauseTime > 0 && (
                                <Typography variant="body2" color="warning.main">
                                    <strong>Temps d'arrêt total:</strong> {Math.floor(batchData.totalPauseTime / 60)}min {batchData.totalPauseTime % 60}s
                                </Typography>
                            )}
                            {batchData?.overallResult && (
                                <Typography variant="body1" gutterBottom>
                                    <strong>Résultat qualité:</strong> 
                                    <Chip 
                                        label={batchData.overallResult === 'passed' ? 'Conforme' : 'Non conforme'}
                                        color={batchData.overallResult === 'passed' ? 'success' : 'error'}
                                        sx={{ ml: 1 }}
                                    />
                                </Typography>
                            )}
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleReset}
                            sx={{ mt: 2 }}
                        >
                            Nouvelle Production
                        </Button>
                    </Paper>
                </Container>
            );
        
        default:
            return <ProductionScan onStartProduction={handleStartProduction} />;
    }
}

// Composant principal App
function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Simulation du chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Fonctions d'authentification
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Vérifier si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Valeurs du contexte d'authentification
  const authValue = {
    user,
    login,
    logout,
    isAdmin
  };

  // Afficher l'écran de chargement
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  // Afficher la page de connexion si pas d'utilisateur connecté
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={login} />
      </ThemeProvider>
    );
  }

  // Application principale
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={authValue}>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Navigation />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                pt: { xs: 7, md: 8 }, // Pour compenser la hauteur de la AppBar
                pl: { xs: 0, md: '250px' }, // Pour compenser la largeur du drawer desktop
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Routes>
                {/* Route principale - Dashboard */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Route de scan/production */}
                <Route 
                  path="/scan" 
                  element={
                    <ProtectedRoute>
                      <ProductionWorkflow />
                    </ProtectedRoute>
                  } 
                />

                {/* Routes administrateur */}
                <Route 
                  path="/products" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ProductsManagement />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/batches" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <BatchesManagement />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ReportsManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* Route de redirection pour les chemins non trouvés */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;