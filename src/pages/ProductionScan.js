import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Alert,
} from '@mui/material';
import axios from 'axios';

function ProductionScan() {
    const [productCode, setProductCode] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [loading, setLoading] = useState(false); // Corrigé: serLoading → setLoading
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Corrigé: prevenDefault → preventDefault
        setLoading(true);
        setError('');

        try {
            // Corrigé: template literals avec backticks au lieu de guillemets simples
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/products/code/${productCode}`
            );

            if (response.data.success) {
                console.log('Produit trouvé:', response.data.data);
            }
        } catch (err) {
            setError('Produit non trouvé ou erreur de connexion'); // Corrigé: setError= → setError(
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Scan de Production
                </Typography>
                <Paper sx={{ p: 4, mt: 3 }}> {/* Corrigé: P → p (minuscule) */}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Code Produit"
                            value={productCode}
                            onChange={(e) => setProductCode(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Numéro de Lot"
                            value={batchNumber}
                            onChange={(e) => setBatchNumber(e.target.value)}
                            margin="normal"
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? 'Vérification...' : 'Continuer'}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

export default ProductionScan;