import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Button, keyframes } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// --- אנימציות מותאמות GPU (שימוש ב-translate3d) ---
const float1 = keyframes`
  0%, 100% { transform: translate3d(0px, 0px, 0) rotate(0deg); }
  25% { transform: translate3d(15px, -30px, 0) rotate(10deg); }
  50% { transform: translate3d(-15px, -15px, 0) rotate(-5deg); }
  75% { transform: translate3d(20px, 15px, 0) rotate(5deg); }
`;
const float2 = keyframes`
  0%, 100% { transform: translate3d(0px, 0px, 0) rotate(0deg); }
  25% { transform: translate3d(-15px, 30px, 0) rotate(-10deg); }
  50% { transform: translate3d(15px, 15px, 0) rotate(5deg); }
  75% { transform: translate3d(-20px, -15px, 0) rotate(-5deg); }
`;
const bounce = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, 5px, 0); }
`;

const vanish = keyframes`
  0% { transform: translate3d(0,0,0) scale(1); opacity: 1; }
  100% { transform: translate3d(0,0,0) scale(0.2); opacity: 0; }
`;

const shardFlyOut1 = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate3d(-100px, -100px, 0) rotate(-360deg) scale(0); opacity: 0; }
`;
const shardFlyOut2 = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate3d(100px, -100px, 0) rotate(360deg) scale(0); opacity: 0; }
`;
const shardFlyOut3 = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate3d(-100px, 100px, 0) rotate(-360deg) scale(0); opacity: 0; }
`;
const shardFlyOut4 = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate3d(100px, 100px, 0) rotate(360deg) scale(0); opacity: 0; }
`;

const Shard = ({ color, animation, size, isExploded }) => (
  <Box
    component="span"
    sx={{
      position: 'absolute',
      color: color,
      fontSize: size,
      fontWeight: 'bold',
      textShadow: `0 0 10px ${color}`,
      opacity: 0, 
      animation: isExploded ? `${animation} 0.8s cubic-bezier(0.1, 0.9, 0.2, 1) forwards` : 'none',
      pointerEvents: 'none',
      willChange: 'transform, opacity', // האצת חומרה
      backfaceVisibility: 'hidden', // מונע ריצודים
    }}
  >
    ?
  </Box>
);

const QuestionMarkDeco = ({ top, left, right, bottom, color, delay, size = '1.5rem' }) => {
  const [isExploded, setIsExploded] = useState(false);

  const handleClick = () => {
    if (!isExploded) {
      setIsExploded(true);
      setTimeout(() => {
        setIsExploded(false);
      }, 2000);
    }
  };

  const shardSize = `calc(${size} * 0.6)`;

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'absolute',
        top, left, right, bottom,
        color: color,
        fontSize: size,
        fontWeight: 'bold',
        zIndex: 5,
        cursor: 'pointer',
        pointerEvents: 'auto',
        display: { xs: 'none', sm: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        animation: `${Number(delay) % 2 === 0 ? float1 : float2} ${12 + Number(delay)}s ease-in-out infinite`,
        willChange: 'transform', // התיקון החשוב ביותר!
        backfaceVisibility: 'hidden', // מכריח שכבת GPU נפרדת
        '&:hover span.main-quiz': {
           textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
           opacity: 1,
        }
      }}
    >
      <Box 
        component="span" 
        className="main-quiz"
        sx={{
          transition: 'all 0.2s ease',
          textShadow: `0 0 10px ${color}`,
          opacity: 0.8,
          animation: isExploded ? `${vanish} 0.3s ease-out forwards` : 'none',
          willChange: 'transform, opacity, text-shadow',
          backfaceVisibility: 'hidden',
          display: 'inline-block'
        }}
      >
        ?
      </Box>

      {isExploded && (
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Shard color={color} animation={shardFlyOut1} size={shardSize} isExploded={isExploded} />
          <Shard color={color} animation={shardFlyOut2} size={shardSize} isExploded={isExploded} />
          <Shard color={color} animation={shardFlyOut3} size={shardSize} isExploded={isExploded} />
          <Shard color={color} animation={shardFlyOut4} size={shardSize} isExploded={isExploded} />
        </Box>
      )}
    </Box>
  );
};

const FadeInSection = ({ children, minHeight = '70vh' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(true);
      }
    }, { threshold: 0.2 }); // הורדתי את הרגישות ל-0.2 כדי שזה ייטען מהר יותר

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
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40px, 0)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        minHeight: minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'none',
        willChange: 'transform, opacity', // מונע תקיעות בגלילה של הטקסט
        backfaceVisibility: 'hidden',
      }}
    >
      <Box sx={{ pointerEvents: 'auto' }}>
        {children}
      </Box>
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
      
      {/* צד שמאל */}
      <QuestionMarkDeco top="5%" left="8%" color="#40e0d0" delay="0" size="1.2rem" />
      <QuestionMarkDeco top="15%" left="22%" color="#ffffff" delay="1" size="2.5rem" />
      <QuestionMarkDeco top="28%" left="5%" color="#000000" delay="2" size="1.8rem" /> 
      <QuestionMarkDeco top="42%" left="18%" color="#40e0d0" delay="3" size="3.2rem" />
      <QuestionMarkDeco top="55%" left="7%" color="#ffffff" delay="0" size="1.5rem" />
      <QuestionMarkDeco top="68%" left="25%" color="#40e0d0" delay="4" size="2.1rem" />
      <QuestionMarkDeco top="82%" left="12%" color="#ffffff" delay="1" size="1.9rem" />
      <QuestionMarkDeco top="92%" left="28%" color="#000000" delay="5" size="1.4rem" />
      
      <QuestionMarkDeco top="10%" left="35%" color="#40e0d0" delay="3" size="0.9rem" />
      <QuestionMarkDeco top="35%" left="38%" color="#ffffff" delay="2" size="1.1rem" />
      <QuestionMarkDeco top="60%" left="32%" color="#40e0d0" delay="5" size="1.3rem" />
      <QuestionMarkDeco top="88%" left="5%" color="#40e0d0" delay="2" size="2.8rem" />

      {/* צד ימין */}
      <QuestionMarkDeco top="8%" right="15%" color="#ffffff" delay="2" size="1.5rem" />
      <QuestionMarkDeco top="22%" right="8%" color="#40e0d0" delay="0" size="3.5rem" />
      <QuestionMarkDeco top="35%" right="25%" color="#000000" delay="4" size="1.3rem" />
      <QuestionMarkDeco top="48%" right="12%" color="#ffffff" delay="1" size="2.4rem" />
      <QuestionMarkDeco top="62%" right="28%" color="#40e0d0" delay="3" size="1.7rem" />
      <QuestionMarkDeco top="75%" right="6%" color="#ffffff" delay="5" size="2.2rem" />
      <QuestionMarkDeco top="88%" right="18%" color="#40e0d0" delay="0" size="1.6rem" />
      <QuestionMarkDeco top="95%" right="5%" color="#ffffff" delay="2" size="1.2rem" />

      <QuestionMarkDeco top="15%" right="35%" color="#40e0d0" delay="1" size="1rem" />
      <QuestionMarkDeco top="42%" right="38%" color="#ffffff" delay="5" size="1.2rem" />
      <QuestionMarkDeco top="70%" right="34%" color="#40e0d0" delay="2" size="0.9rem" />
      <QuestionMarkDeco top="82%" right="32%" color="#000000" delay="4" size="1.5rem" />

      <Container maxWidth="lg" sx={{ pt: 5, pb: 10, pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
        
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
              willChange: 'transform, box-shadow', // שומר על אנימציית הכפתור חלקה
              '&:hover': { 
                bgcolor: '#a00bd9',
                transform: 'translate3d(0, -3px, 0)',
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