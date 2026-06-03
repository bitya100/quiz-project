import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import io from 'socket.io-client';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const socketUrl = isLocalhost
  ? 'http://localhost:3001'
  : 'https://quiz-project-server.onrender.com';

// 🔥 התיקון כאן: שינוי הסדר לפולינג קודם + הוספת תמיכת credentials לחציית שרתים
const socket = io(socketUrl, {
  transports: ['polling', 'websocket'],
  withCredentials: true
});

// ========================================================
// 🔥 פתרון גלובלי: הזיכרון חי כאן, מחוץ למחזור החיים של React
// ========================================================
let globalCount = 0;          // שומר תמיד את מספר המשתמשים העדכני ביותר
const activeListeners = new Set(); // רשימה של כל קומפוננטות ה-LiveUsers שפתוחות כרגע במסך

// האזנה אחת בלבד ברמת הקובץ - לא מתה לעולם!
socket.on('updateUserCount', (newCount) => {
  globalCount = newCount; // מעדכן את הזיכרון הגלובלי
  // מעדכן את הסטייט הפנימי של כל קומפוננטה שפתוחה כרגע (גם פוטר וגם המבורגר)
  activeListeners.forEach((updateState) => updateState(newCount));
});
// ========================================================

const LiveUsers = ({ showFullText = false }) => {
  // כשקומפוננטה נפתחת (למשל בהמבורגר), היא ישר מציגה את המספר האחרון הידוע בגלובל
  const [count, setCount] = useState(globalCount);

  useEffect(() => {
    // הרשמה של פונקציית עדכון הסטייט הנוכחית לרשימת ההאזנה
    activeListeners.add(setCount);

    // כשקומפוננטה נסגרת (ההמבורגר נסגר), מסירים אותה מהרשימה כדי למנוע זליגת זיכרון
    return () => {
      activeListeners.delete(setCount);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#40e0d0', opacity: 0.7 }}>
      <PeopleIcon fontSize="small" />
      <Typography variant="caption">
        {showFullText ? `${count} משתמשים כרגע באתר` : count}
      </Typography>
    </Box>
  );
};

export default LiveUsers;