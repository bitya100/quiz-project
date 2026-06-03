import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
// אם את משתמשת ב-socket.io:
// import socket from '../services/socket'; 

const LiveUsers = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // כאן מתחברים לאירוע מהשרת
    // socket.on('updateUserCount', (newCount) => setCount(newCount));
    
    // סימולציה למקרה שאין לך עדיין סוקטים:
    setCount(Math.floor(Math.random() * 50) + 10); 
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#40e0d0', opacity: 0.7 }}>
      <PeopleIcon fontSize="small" />
      <Typography variant="caption">{count} משתמשים כרגע באתר</Typography>
    </Box>
  );
};

export default LiveUsers;