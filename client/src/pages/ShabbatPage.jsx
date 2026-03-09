import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';

const ShabbatPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'white',
      textAlign: 'center',
      p: 3
    }}>
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ 
          p: 6, 
          borderRadius: 5, 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(64, 224, 208, 0.3)'
        }}>
          <Typography variant="h2" sx={{ mb: 2 }}>🕯️🕯️</Typography>
          <Typography variant="h3" sx={{ color: '#40e0d0', fontWeight: 'bold', mb: 3 }}>
            שבת שלום!
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
            האתר סגור מחצות יום שישי עד מוצאי שבת. <br />
            נשמח לראותכם שוב עם צאת השבת.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            "וּשְׁמַרְתֶּם אֶת הַשַּׁבָּת כִּי קֹדֶשׁ הִיא לָכֶם מְחַלְלֶיהָ מוֹת יוּמָת..." שמות לא, יד
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ShabbatPage;