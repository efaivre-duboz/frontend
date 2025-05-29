import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Fade,
    Paper
} from '@mui/material';
import {
    Science,
    Inventory,
    Assessment,
    Security
} from '@mui/icons-material';

function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const loadingSteps = [
        { label: 'Initialisation du système ProdMaster...', icon: <Science /> },
        { label: 'Chargement des données produits...', icon: <Inventory /> },
        { label: 'Préparation de l\'interface utilisateur...', icon: <Assessment /> },
        { label: 'Sécurisation des connexions...', icon: <Security /> },
        { label: 'Finalisation du démarrage...', icon: <Science /> }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                
                const increment = Math.random() * 12 + 8; // 8-20% increment
                const newProgress = Math.min(prevProgress + increment, 100);
                
                // Changer l'étape selon le progrès
                const newStep = Math.floor((newProgress / 100) * loadingSteps.length);
                setCurrentStep(Math.min(newStep, loadingSteps.length - 1));
                
                return newProgress;
            });
        }, 250);

        return () => clearInterval(timer);
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #E30613 0%, #B30000 100%)',
                backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Particules d'arrière-plan animées */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.1,
                    backgroundImage: `
                        radial-gradient(2px 2px at 20px 30px, white, transparent),
                        radial-gradient(2px 2px at 40px 70px, white, transparent),
                        radial-gradient(1px 1px at 90px 40px, white, transparent),
                        radial-gradient(1px 1px at 130px 80px, white, transparent),
                        radial-gradient(2px 2px at 160px 30px, white, transparent)
                    `,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 100px',
                    animation: 'float 20s infinite linear'
                }}
            />

            <Fade in timeout={1000}>
                <Paper
                    elevation={20}
                    sx={{
                        p: 6,
                        borderRadius: 4,
                        textAlign: 'center',
                        minWidth: { xs: 350, sm: 450 },
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    {/* Logo et titre */}
                    <Box sx={{ mb: 4 }}>
                        {/* Logo Envirolin */}
                        <Box sx={{ mb: 3 }}>
                            <Box
                                component="img"
                                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjcwIiB2aWV3Qm94PSIwIDAgMTUwIDcwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjcwIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSI3NSIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNFMzA2MTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVudmlyb2xpbjwvdGV4dD4KPHRleHQgeD0iNzUiIHk9IjQyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMxYTFhMWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhbmFkYSBEaXN0cmlidXRldXI8L3RleHQ+Cjx0ZXh0IHg9Ijc1IiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMWExYTFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5kZSBMdWJyaWZpYW50czwvdGV4dD4KPHN2Zz4="
                                alt="Envirolin Logo"
                                sx={{ height: 60, mb: 2 }}
                            />
                        </Box>

                        <Box sx={{ position: 'relative' }}>
                            <Science 
                                sx={{ 
                                    fontSize: 80, 
                                    color: '#E30613',
                                    mb: 2,
                                    animation: 'pulse 2s infinite',
                                    filter: 'drop-shadow(0 4px 8px rgba(227, 6, 19, 0.3))'
                                }} 
                            />
                            
                            {/* Cercles animés autour de l'icône */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -60%)',
                                    width: 100,
                                    height: 100,
                                    border: '2px solid #E30613',
                                    borderRadius: '50%',
                                    opacity: 0.3,
                                    animation: 'rotate 4s linear infinite'
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -60%)',
                                    width: 120,
                                    height: 120,
                                    border: '1px solid #B30000',
                                    borderRadius: '50%',
                                    opacity: 0.2,
                                    animation: 'rotate 6s linear infinite reverse'
                                }}
                            />
                        </Box>

                        <Typography 
                            variant="h3" 
                            component="h1" 
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #E30613 30%, #B30000 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                mb: 1
                            }}
                        >
                            ProdMaster
                        </Typography>
                        
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            Système de Gestion de Production
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary">
                            Envirolin Canada • Distribution de Lubrifiants
                        </Typography>
                    </Box>

                    {/* Étape actuelle */}
                    <Box sx={{ mb: 4 }}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: 2,
                                mb: 3,
                                p: 2,
                                backgroundColor: 'rgba(227, 6, 19, 0.05)',
                                borderRadius: 2,
                                border: '1px solid rgba(227, 6, 19, 0.1)'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    color: '#E30613',
                                    animation: 'bounce 2s infinite'
                                }}
                            >
                                {loadingSteps[currentStep]?.icon}
                            </Box>
                            <Typography 
                                variant="body1" 
                                color="textPrimary"
                                sx={{ fontWeight: 'medium' }}
                            >
                                {loadingSteps[currentStep]?.label}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Barre de progression */}
                    <Box sx={{ mb: 3 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgba(227, 6, 19, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 5,
                                    background: 'linear-gradient(90deg, #E30613 0%, #B30000 100%)',
                                    boxShadow: '0 2px 4px rgba(227, 6, 19, 0.3)'
                                }
                            }}
                        />
                        <Typography 
                            variant="body1" 
                            color="primary" 
                            sx={{ 
                                mt: 1, 
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}
                        >
                            {Math.round(progress)}% terminé
                        </Typography>
                    </Box>

                    {/* Points de chargement animés */}
                    <Box 
                        sx={{ 
                            mt: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1
                        }}
                    >
                        {[0, 1, 2, 3].map((dot) => (
                            <Box
                                key={dot}
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(45deg, #E30613, #B30000)',
                                    animation: `bounce 1.4s infinite ease-in-out both`,
                                    animationDelay: `${dot * 0.16}s`,
                                    boxShadow: '0 2px 4px rgba(227, 6, 19, 0.3)'
                                }}
                            />
                        ))}
                    </Box>

                    {/* Message de statut */}
                    <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        sx={{ 
                            mt: 3,
                            fontStyle: 'italic'
                        }}
                    >
                        {progress < 50 ? 
                            'Chargement des modules système...' :
                            progress < 90 ?
                            'Préparation de l\'interface...' :
                            'Finalisation du démarrage...'
                        }
                    </Typography>
                </Paper>
            </Fade>

            {/* Informations de version */}
            <Typography 
                variant="caption" 
                sx={{ 
                    position: 'absolute', 
                    bottom: 20,
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}
            >
                Version 1.0.0 • ProdMaster by Envirolin<br />
                Développé avec React & Material-UI
            </Typography>

            {/* Styles CSS pour les animations */}
            <style jsx>{`
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes rotate {
                    0% {
                        transform: translate(-50%, -60%) rotate(0deg);
                    }
                    100% {
                        transform: translate(-50%, -60%) rotate(360deg);
                    }
                }

                @keyframes float {
                    0% {
                        transform: translateX(0px);
                    }
                    100% {
                        transform: translateX(-200px);
                    }
                }
            `}</style>
        </Box>
    );
}

export default LoadingScreen;