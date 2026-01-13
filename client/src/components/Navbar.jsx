import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Sheet,
  Divider,
  Stack
} from '@mui/joy';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear();
    setIsMenuOpen(false);
    window.location.href = '/login';
  };

  // עיצוב משותף לזוהר ניאון
  const neonGlow = {
    color: '#00c1ab',
    textShadow: '0 0 8px rgba(0, 193, 171, 0.8), 0 0 15px rgba(0, 193, 171, 0.5)',
  };

  const adminGlow = {
    color: '#bc13fe',
    textShadow: '0 0 8px rgba(188, 19, 254, 0.8)',
  };

  // רשימת הניווט המעודכנת עם אפקט זוהר
  const NavLinks = ({ isMobile = false }) => (
    <>
      <ListItem>
        <ListItemButton component={Link} to="/quizzes" onClick={() => setIsMenuOpen(false)}>
          <ListItemContent sx={{ 
            textAlign: isMobile ? 'right' : 'center',
            ...neonGlow,
            fontWeight: 'bold'
          }}>
            חידונים
          </ListItemContent>
        </ListItemButton>
      </ListItem>
      
      {token && (
        <ListItem>
          <ListItemButton component={Link} to="/my-scores" onClick={() => setIsMenuOpen(false)}>
            <ListItemContent sx={{ 
              textAlign: isMobile ? 'right' : 'center',
              ...neonGlow,
              fontWeight: 'bold'
            }}>
              הציונים שלי
            </ListItemContent>
          </ListItemButton>
        </ListItem>
      )}

      {token && userRole === 'admin' && (
        <>
          <ListItem>
            <ListItemButton component={Link} to="/admin/all-scores" onClick={() => setIsMenuOpen(false)}>
              <ListItemContent sx={{ 
                textAlign: isMobile ? 'right' : 'center', 
                ...adminGlow,
                fontWeight: 'bold'
              }}>
                ניהול ציונים
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to="/admin/users" onClick={() => setIsMenuOpen(false)}>
              <ListItemContent sx={{ 
                textAlign: isMobile ? 'right' : 'center', 
                color: 'orange',
                textShadow: '0 0 8px rgba(255, 165, 0, 0.7)',
                fontWeight: 'bold'
              }}>
                ניהול משתמשים
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </>
      )}
    </>
  );

  return (
    <Sheet
      variant="solid"
      color="neutral"
      invertedColors
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        backgroundColor: '#000',
        borderBottom: '2px solid #00c1ab',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        boxShadow: '0 4px 20px rgba(0, 193, 171, 0.2)' // צל מתחת לנאבבאר
      }}
    >
      {/* לוגו */}
      <Typography
        component={Link}
        to="/"
        level="h4"
        sx={{ 
            textDecoration: 'none', 
            fontWeight: 'bold',
            ...neonGlow,
            fontSize: '1.5rem'
        }}
      >
        QUIZ ZONE
      </Typography>

      {/* תפריט למסכים גדולים */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
        <List orientation="horizontal" sx={{ gap: 1 }}>
          <NavLinks />
        </List>
        
        <Divider orientation="vertical" sx={{ mx: 1, bgcolor: '#333' }} />
        
        <Typography level="body-sm" sx={{ mr: 2, color: 'white' }}>
          שלום, <b style={neonGlow}>{userName || 'אורח'}</b>
        </Typography>

        {!token ? (
          <Stack direction="row" spacing={1}>
            <Button variant="ghost" component={Link} to="/login">התחברות</Button>
            <Button variant="solid" sx={{ bgcolor: '#00c1ab', boxShadow: '0 0 10px #00c1ab' }} component={Link} to="/register">הרשמה</Button>
          </Stack>
        ) : (
          <Button variant="outlined" color="danger" size="sm" onClick={handleLogout}>התנתק</Button>
        )}
      </Box>

      {/* כפתור המבורגר לניידים */}
      <IconButton
        variant="outlined"
        color="neutral"
        onClick={() => setIsMenuOpen(true)}
        sx={{ display: { md: 'none' }, borderColor: '#00c1ab', color: '#00c1ab' }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer - תפריט צד רספונסיבי */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        slotProps={{
          content: {
            sx: {
              bgcolor: '#0a0a0ad8', // רקע כהה מאוד כדי שהזוהר יבלוט
              color: 'white',
              p: 3,
              borderLeft: '1px solid #00c1ab'
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography level="h6" sx={neonGlow}>תפריט</Typography>
          <IconButton onClick={() => setIsMenuOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 2, bgcolor: '#333' }} />
        <List>
          <NavLinks isMobile />
        </List>
        
        <Box sx={{ mt: 'auto', textAlign: 'center', pb: 2 }}>
          {/* עדכון: השם צבוע וזוהר גם כאן */}
          <Typography sx={{ mb: 2, color: 'white' }}>
            שלום, <b style={neonGlow}>{userName || 'אורח'}</b>
          </Typography>
          
          {!token ? (
            <Stack spacing={1}>
              <Button fullWidth variant="outlined" component={Link} to="/login" onClick={() => setIsMenuOpen(false)}>התחברות</Button>
              <Button fullWidth variant="solid" sx={{ bgcolor: '#00c1ab' }} component={Link} to="/register" onClick={() => setIsMenuOpen(false)}>הרשמה</Button>
            </Stack>
          ) : (
            <Button fullWidth color="danger" variant="soft" onClick={handleLogout}>התנתק</Button>
          )}
        </Box>
      </Drawer>
    </Sheet>
  );
};

export default Navbar;