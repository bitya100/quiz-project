import React, { useState, useEffect } from 'react';
import { Fab, Fade, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = (e) => {
    const scrolled = window.scrollY || document.documentElement.scrollTop || (e.target && e.target.scrollTop) || 0;
    
    if (scrolled > 150) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.querySelectorAll('div, main, section, body, html').forEach((el) => {
      if (el.scrollTop > 0) {
        el.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, true);
    return () => window.removeEventListener("scroll", toggleVisibility, true);
  }, []);

  return (
    <Fade in={isVisible}>
      <Tooltip title="חזור למעלה" placement="right">
        <Fab 
          onClick={scrollToTop}
          size="medium"
          sx={{
            position: 'fixed',
            bottom: 30,
            left: 30,
            zIndex: 99999,
            bgcolor: 'rgba(2, 6, 23, 0.7)',
            color: '#40e0d0',
            border: '1px solid rgba(64, 224, 208, 0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 15px rgba(64, 224, 208, 0.2)',
            transition: 'all 0.3s ease-in-out',
            // כאן ביטלנו את הקפיצה למעלה, נשאר רק שינוי הצבע וההילה!
            '&:hover': {
              border: '1px solid #020617',
              bgcolor: '#40e0d0',
              color: '#020617',
              boxShadow: '0 0 25px rgba(64, 224, 208, 0.6)'
            }
          }}
        >
          <KeyboardArrowUpIcon fontSize="large" />
        </Fab>
      </Tooltip>
    </Fade>
  );
};

export default ScrollToTop;