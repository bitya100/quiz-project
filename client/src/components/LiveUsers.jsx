import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import io from 'socket.io-client';

// התחברות לשרת (שני את הכתובת אם השרת שלך לא ב-3001)
const socket = io('https://quiz-project-server.onrender.com', {
  transports: ['websocket'], // מוודא שזה יעבוד בצורה יציבה
  secure: true
});
const LiveUsers = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on('updateUserCount', (newCount) => {
      setCount(newCount);
    });

    return () => socket.off('updateUserCount');
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#40e0d0', opacity: 0.7 }}>
      <PeopleIcon fontSize="small" />
      <Typography variant="caption">{count} משתמשים כרגע באתר</Typography>
    </Box>
  );
};

export default LiveUsers;