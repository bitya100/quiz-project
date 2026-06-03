import React, { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import io from 'socket.io-client';

const socket = io('https://quiz-project-server.onrender.com', {
  transports: ['websocket'],
  secure: true
});

const LiveUsers = () => {
  const [count, setCount] = useState(0);
  const theme = useTheme();
  // בדיקה אם המסך קטן מ-600px (מובייל)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    socket.on('updateUserCount', (newCount) => {
      setCount(newCount);
    });
    return () => socket.off('updateUserCount');
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#40e0d0', opacity: 0.7 }}>
      <PeopleIcon fontSize="small" />
      <Typography variant="caption">
        {isMobile ? count : `${count} משתמשים כרגע באתר`}
      </Typography>
    </Box>
  );
};

export default LiveUsers;