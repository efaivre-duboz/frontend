import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Box, Typography, Paper } from '@mui/material';
import { Lock } from '@mui/icons-material';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la route nécessite des privilèges admin et que l'utilisateur n'est pas admin
  if (adminOnly && !isAdmin()) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          p: 3
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 400
          }}
        >
          <Lock sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Accès Restreint
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            Cette section est réservée aux administrateurs.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Si tout est bon, afficher le composant enfant
  return children;
}

export default ProtectedRoute;