import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ShabbatMessage = () => (
    <Box sx={{ 
        height: '100vh', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', bgcolor: '#020617' 
    }}>
        <Paper sx={{ p: 5, textAlign: 'center', bgcolor: 'rgba(64, 224, 208, 0.1)', color: 'white' }}>
            <Typography variant="h3" gutterBottom>שבת שלום! 🕯️🕯️</Typography>
            <Typography variant="h5">האתר סגור כעת למנוחת השבת.</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>נפתח מחדש במוצאי שבת. בשורות טובות!</Typography>
        </Paper>
    </Box>
);

export default ShabbatMessage;