import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Container,
    Alert,
    CardContent,
    Divider,
    Chip,
    IconButton,
    InputAdornment,
    CircularProgress,
    Fade
} from '@mui/material';
import {
    Person,
    AdminPanelSettings,
    Login as LoginIcon,
    Visibility,
    VisibilityOff,
    Security
} from '@mui/icons-material';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Base de données des utilisateurs (en production, ceci serait dans une base de données sécurisée)
    const users = [
        { 
            id: 1, 
            username: 'jean.dupont', 
            password: 'prod123',
            name: 'Jean Dupont', 
            role: 'operator', 
            email: 'jean@envirolin.ca',
            department: 'Production',
            lastLogin: '2024-01-15'
        },
        { 
            id: 2, 
            username: 'marie.tremblay', 
            password: 'admin456',
            name: 'Marie Tremblay', 
            role: 'admin', 
            email: 'marie@envirolin.ca',
            department: 'Administration',
            lastLogin: '2024-01-14'
        },
        { 
            id: 3, 
            username: 'pierre.lafond', 
            password: 'prod789',
            name: 'Pierre Lafond', 
            role: 'operator', 
            email: 'pierre@envirolin.ca',
            department: 'Production',
            lastLogin: '2024-01-13'
        },
        { 
            id: 4, 
            username: 'sophie.martin', 
            password: 'qual123',
            name: 'Sophie Martin', 
            role: 'admin', 
            email: 'sophie@envirolin.ca',
            department: 'Qualité',
            lastLogin: '2024-01-12'
        }
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Simulation d'une requête d'authentification
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Vérification des identifiants
            const user = users.find(u => 
                u.username.toLowerCase() === username.toLowerCase() && 
                u.password === password
            );

            if (user) {
                // Authentification réussie
                const authenticatedUser = {
                    ...user,
                    lastLogin: new Date().toISOString(),
                    sessionId: 'session_' + Date.now()
                };
                
                if (onLogin) {
                    onLogin(authenticatedUser);
                }
            } else {
                // Identifiants incorrects
                setError('Nom d\'utilisateur ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            setError('Erreur de connexion. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isFormValid = username.trim() !== '' && password.trim() !== '';

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #E30613 0%, #B30000 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Fade in timeout={1000}>
                    <Paper
                        elevation={10}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            backgroundColor: 'white'
                        }}
                    >
                        {/* En-tête avec logo */}
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                p: 4,
                                textAlign: 'center',
                                borderBottom: '1px solid #e0e0e0'
                            }}
                        >
                            {/* Logo Envirolin */}
                            <Box sx={{ mb: 3 }}>
                                <Box
                                    component="img"
                                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjcwIiB2aWV3Qm94PSIwIDAgMTUwIDcwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjcwIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSI3NSIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNFMzA2MTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVudmlyb2xpbjwvdGV4dD4KPHRleHQgeD0iNzUiIHk9IjQyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMxYTFhMWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbmFkYSBEaXN0cmlidXRldXI8L3RleHQ+Cjx0ZXh0IHg9Ijc1IiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMWExYTFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5kZSBMdWJyaWZpYW50czwvdGV4dD4KPHN2Zz4="
                                    alt="Envirolin Logo"
                                    sx={{ height: 60, mb: 2 }}
                                />
                            </Box>
                            
                            <Typography 
                                variant="h4" 
                                gutterBottom 
                                sx={{ 
                                    color: 'primary.main', 
                                    fontWeight: 'bold',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                ProdMaster
                            </Typography>
                            
                            <Typography variant="subtitle1" color="textSecondary">
                                Système de Gestion de Production
                            </Typography>
                        </Box>

                        {/* Formulaire de connexion */}
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                                <Security color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Connexion Sécurisée
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleLogin}>
                                <TextField
                                    fullWidth
                                    label="Nom d'utilisateur"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    margin="normal"
                                    required
                                    disabled={loading}
                                    autoComplete="username"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Mot de passe"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    margin="normal"
                                    required
                                    disabled={loading}
                                    autoComplete="current-password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleTogglePasswordVisibility}
                                                    edge="end"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                <Button
                                    type="submit"
                                    disabled={!isFormValid || loading}
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                    sx={{ 
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        textTransform: 'none'
                                    }}
                                >
                                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                                </Button>
                            </form>

                            <Divider sx={{ my: 3 }} />

                            {/* Informations de démonstration */}
                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="body2">
                                    <strong>Environnement de démonstration</strong><br/>
                                    Utilisez les identifiants ci-dessous pour tester l'application.
                                </Typography>
                            </Alert>

                            {/* Comptes de démonstration */}
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                                    Comptes de démonstration disponibles :
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {/* Comptes Opérateurs */}
                                    <Box>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                            Comptes Opérateurs :
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Chip
                                                label="jean.dupont / prod123"
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => {
                                                    setUsername('jean.dupont');
                                                    setPassword('prod123');
                                                }}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                            <Chip
                                                label="pierre.lafond / prod789"
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => {
                                                    setUsername('pierre.lafond');
                                                    setPassword('prod789');
                                                }}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Comptes Administrateurs */}
                                    <Box>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            <AdminPanelSettings fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                            Comptes Administrateurs :
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Chip
                                                label="marie.tremblay / admin456"
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                onClick={() => {
                                                    setUsername('marie.tremblay');
                                                    setPassword('admin456');
                                                }}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                            <Chip
                                                label="sophie.martin / qual123"
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                onClick={() => {
                                                    setUsername('sophie.martin');
                                                    setPassword('qual123');
                                                }}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                                    Cliquez sur un compte pour remplir automatiquement les champs
                                </Typography>
                            </Box>
                        </CardContent>

                        {/* Pied de page */}
                        <Box
                            sx={{
                                backgroundColor: '#f8f9fa',
                                p: 2,
                                textAlign: 'center',
                                borderTop: '1px solid #e0e0e0'
                            }}
                        >
                            <Typography variant="caption" color="textSecondary">
                                ProdMaster v1.0 • Envirolin Canada<br/>
                                Système de gestion de production industrielle
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
}

export default Login;