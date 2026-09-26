import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexGrow: 1, // מותח את הקונטיינר למילוי השטח שניתן לו על ידי App.jsx
        py: 4 
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: '#000f2800', border: '2px solid #00c1ab' }}>
        <Box textAlign="center">
          <Typography 
            variant="h1" 
            component="div" 
            sx={{ 
              fontSize: 72, 
              fontWeight: 'bold', 
              color: '#00c1ab', 
              fontFamily: 'monospace',
              direction: 'ltr' 
            }}
          >
            $ 404
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, color: 'white', fontWeight: 'bold' }}>
            וואלה — עשית את זה!
          </Typography>
          <Typography sx={{ mt: 1, color: '#f8fafc', fontFamily: 'monospace' }}>
            הדף שחיפשת לא נמצא
          </Typography>
          <Typography sx={{ mt: 1, color: '#f8fafc', fontFamily: 'monospace' }}>
             יש לך מוח שנון שהגיע למשהו שעוד לא כתבנו עליו. 
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#00c1ab',
              '&:hover': { backgroundColor: '#009688' },
              fontWeight: 'bold',
              borderRadius: 3,
              mt: 4,
              px: 4
            }}
          >
            חזרה לדף הבית
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;