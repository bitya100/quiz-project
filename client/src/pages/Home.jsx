import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Button, keyframes } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// --- אנימציות עדינות לסימני השאלה ---
const float1 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(10deg); }
`;
const float2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(15px) rotate(-10deg); }
`;
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
`;

// --- קומפוננטה לסימני שאלה מרחפים ברקע ---
const QuestionMarkDeco = ({ top, left, right, bottom, color, delay, size = '1.5rem' }) => (
  <Box
    sx={{
      position: 'absolute',
      top, left, right, bottom,
      color: color,
      fontSize: size,
      fontWeight: 'bold',
      opacity: 0.35, // שקיפות עדינה כדי שלא יפריע לקריאה
      textShadow: `0 0 10px ${color}`, // הילת ניאון קטנה
      animation: `${Number(delay) % 2 === 0 ? float1 : float2} ${4 + Number(delay)}s ease-in-out infinite`,
      zIndex: 0,
      pointerEvents: 'none',
      display: { xs: 'none', sm: 'block' } // מסתיר במסכים ממש קטנים למניעת עומס
    }}
  >
    ?
  </Box>
);

// --- קומפוננטת קסם לחשיפת תוכן בגלילה ---
const FadeInSection = ({ children, minHeight = '70vh' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(true);
      }
    }, { threshold: 0.4 });

    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <Box
      ref={domRef}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        minHeight: minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}
    >
      {children}
    </Box>
  );
};

const Home = () => {
  const handleScrollToQuizzes = () => {
    const section = document.getElementById('quizzes-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* פיזור סימני השאלה ברקע */}
      {/* צד שמאל */}
      <QuestionMarkDeco top="10%" left="10%" color="#40e0d0" delay="0" size="1.2rem" />
      <QuestionMarkDeco top="30%" left="5%" color="#bc13fe" delay="1" size="2.5rem" />
      <QuestionMarkDeco top="55%" left="12%" color="#40e0d0" delay="3" size="1.8rem" />
      <QuestionMarkDeco top="75%" left="8%" color="#bc13fe" delay="2" size="1.5rem" />
      <QuestionMarkDeco top="20%" left="25%" color="#bc13fe" delay="4" size="1rem" />
      <QuestionMarkDeco top="85%" left="20%" color="#40e0d0" delay="5" size="2rem" />

      {/* צד ימין */}
      <QuestionMarkDeco top="15%" right="12%" color="#bc13fe" delay="2" size="1.5rem" />
      <QuestionMarkDeco top="40%" right="8%" color="#40e0d0" delay="0" size="3rem" />
      <QuestionMarkDeco top="65%" right="15%" color="#bc13fe" delay="4" size="1.3rem" />
      <QuestionMarkDeco top="80%" right="10%" color="#40e0d0" delay="1" size="2.2rem" />
      <QuestionMarkDeco top="25%" right="28%" color="#40e0d0" delay="3" size="1.1rem" />
      <QuestionMarkDeco top="90%" right="25%" color="#bc13fe" delay="5" size="1.6rem" />

      <Container maxWidth="lg" sx={{ pt: 5, pb: 10 }}>
        
        {/* מסך 1: כותרת בלבד */}
        <FadeInSection minHeight="85vh">
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontWeight: 900, 
              color: 'white', 
              fontSize: { xs: '3.5rem', md: '5.5rem', lg: '7rem' },
              textShadow: '0 0 20px rgba(64, 224, 208, 0.4)',
              fontFamily: 'Assistant, sans-serif'
            }}
          >
            ברוכים הבאים ל-
            <Box component="span" sx={{ color: '#40e0d0', display: 'block', mt: 2 }}>
              QUIZ MASTER
            </Box>
          </Typography>
        </FadeInSection>

        {/* מסך 2: גוללים ומופיע ההסבר */}
        <FadeInSection minHeight="60vh">
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              maxWidth: '800px', 
              fontSize: { xs: '1.5rem', md: '2.5rem' },
              lineHeight: 1.8,
              fontWeight: '300'
            }}
          >
            המקום בו הידע פוגש את האתגר.
            <br /><br />
            בחרו חידון, ענו על השאלות,<br /> ונסו להגיע ל-100% הצלחה!
          </Typography>
        </FadeInSection>

        {/* מסך 3: גוללים עוד ומופיע הכפתור */}
        <FadeInSection minHeight="50vh">
          <Button 
            onClick={handleScrollToQuizzes}
            variant="contained" 
            size="large"
            endIcon={<KeyboardArrowDownIcon sx={{ ml: 1, fontSize: '2rem !important', animation: `${bounce} 1.5s infinite` }} />} 
            sx={{ 
              bgcolor: '#bc13fe', 
              color: 'white', 
              fontSize: '1.6rem',
              fontWeight: 'bold', 
              px: 6,
              py: 2,
              borderRadius: '50px',
              border: '2px solid transparent',
              boxShadow: '0 0 20px rgba(188, 19, 254, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                bgcolor: '#a00bd9',
                transform: 'translateY(-3px)',
                boxShadow: '0 5px 30px rgba(188, 19, 254, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              } 
            }}
          >
            בואו נתחיל לשחק
          </Button>
        </FadeInSection>

      </Container>
    </Box>
  );
};

export default Home;