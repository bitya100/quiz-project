import React from 'react';
import { Container, Typography, Box, Button, keyframes } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from 'react-router-dom';

// אנימציית קפיצה אופקית (שמאלה-ימינה) במקום למעלה-למטה
const bounceHorizontal = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(-6px, 0, 0); }
`;

// אנימציית כניסה פשוטה וקלה למשאבים
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        minHeight: '80vh', // ממורכז במסך בלי צורך לגלול
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${fadeIn} 1s ease-out forwards` // אנימציית כניסה חלקה
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 10  }}>
        
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontWeight: 900, 
            color: 'white', 
            fontSize: { xs: '3.5rem', md: '5.5rem', lg: '7rem' },
            textShadow: '0 0 20px rgba(64, 224, 208, 0.4)',
            fontFamily: 'Assistant, sans-serif',
            mb: 6 // רווח גדול בין הכותרת לכפתור
          }}
        >
          ברוכים הבאים ל-
          <Box component="span" sx={{ color: '#40e0d0', display: 'block', mt: 2 }}>
            QUIZ MASTER
          </Box>
        </Typography>

        <Button 
          onClick={() => navigate('/quizzes')}
          variant="contained" 
          size="large"
          endIcon={<KeyboardArrowLeftIcon sx={{ ml: 1, fontSize: '3rem !important', animation: `${bounceHorizontal} 1.5s infinite` }} />} 
          sx={{ 
            bgcolor: '#0334575e', 
            color: 'white', 
            fontSize: '1.6rem',
            fontWeight: 'bold', 
            px: 6,
            py: 2,
            borderRadius: '50px',
            border: '2px solid transparent',
            boxShadow: '0 0 20px rgba(125, 19, 254, 0.5)',
            transition: 'all 0.3s ease',
            
            '&:hover': { 
              bgcolor: '#3353999b',
              transform: 'translateY(-3px)',
              boxShadow: '0 5px 30px rgba(125, 19, 254, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.5)'
            } 
          }}
        >
          בואו נתחיל לשחק
        </Button>

      </Container>
    </Box>
  );
};

export default Home;