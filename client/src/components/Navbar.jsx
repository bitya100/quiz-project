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
  Stack,
  Input
} from '@mui/joy';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = ({ searchTerm, setSearchTerm }) => {
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

  const neonGlow = {
    color: '#00c1ab',
    textShadow: '0 0 8px rgba(0, 193, 171, 0.8), 0 0 15px rgba(0, 193, 171, 0.5)',
  };

  const adminGlow = {
    color: '#bc13fe',
    textShadow: '0 0 8px rgba(188, 19, 254, 0.8)',
  };

  const NavLinks = ({ isMobile = false }) => (
    <>
      <ListItem>
        <ListItemButton component={Link} to="/quizzes" onClick={() => setIsMenuOpen(false)}>
          <ListItemContent sx={{ textAlign: isMobile ? 'right' : 'center', ...neonGlow, fontWeight: 'bold' }}>
            חידונים
          </ListItemContent>
        </ListItemButton>
      </ListItem>
      
      {token && (
        <ListItem>
          <ListItemButton component={Link} to="/my-scores" onClick={() => setIsMenuOpen(false)}>
            <ListItemContent sx={{ textAlign: isMobile ? 'right' : 'center', ...neonGlow, fontWeight: 'bold' }}>
              הציונים שלי
            </ListItemContent>
          </ListItemButton>
        </ListItem>
      )}

      {token && userRole === 'admin' && (
        <>
          <ListItem>
            <ListItemButton component={Link} to="/admin/all-scores" onClick={() => setIsMenuOpen(false)}>
              <ListItemContent sx={{ textAlign: isMobile ? 'right' : 'center', ...adminGlow, fontWeight: 'bold' }}>
                ניהול ציונים
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to="/admin/users" onClick={() => setIsMenuOpen(false)}>
              <ListItemContent sx={{ textAlign: isMobile ? 'right' : 'center', color: 'orange', textShadow: '0 0 8px rgba(255, 165, 0, 0.7)', fontWeight: 'bold' }}>
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
        boxShadow: '0 4px 20px rgba(0, 193, 171, 0.2)'
      }}
    >
      {/* לוגו */}
      <Typography component={Link} to="/" level="h4" sx={{ textDecoration: 'none', fontWeight: 'bold', ...neonGlow, fontSize: '1.5rem', flexShrink: 0 }}>
        QUIZ ZONE
      </Typography>

      {/* --- שורת חיפוש חכמה (מתרחבת בלחיצה) - דסקטופ --- */}
      <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexGrow: 1, justifyContent: 'center', px: 2 }}>
        <Input
          placeholder="חיפוש ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startDecorator={<SearchIcon sx={{ color: '#00c1ab' }} />}
          sx={{
            width: '180px',
            transition: 'all 0.3s ease',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            color: 'white',
            borderRadius: '20px',
            '&:focus-within': {
              width: '350px',
              borderColor: '#00c1ab',
              boxShadow: '0 0 10px rgba(0, 193, 171, 0.3)'
            }
          }}
        />
      </Box>

      {/* תפריט וכפתורים */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
          <List orientation="horizontal" sx={{ gap: 1 }}>
            <NavLinks />
          </List>
          {token && <Divider orientation="vertical" sx={{ mx: 1, bgcolor: '#333', height: '24px' }} />}
        </Box>

        {!token ? (
          <Stack direction="row" spacing={1}>
            <Button variant="ghost" component={Link} to="/login">התחברות</Button>
            <Button variant="solid" sx={{ bgcolor: '#00c1ab' }} component={Link} to="/register">הרשמה</Button>
          </Stack>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold', fontSize: '0.9rem' }}>
              שלום, <span style={neonGlow}>{userName}</span>
            </Typography>
            <Button 
                variant="outlined" 
                color="danger" 
                size="sm" 
                sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: '8px' }} 
                onClick={handleLogout}
            >
                התנתק
            </Button>
          </Box>
        )}

        <IconButton
          variant="outlined"
          onClick={() => setIsMenuOpen(true)}
          sx={{ display: { md: 'none' }, borderColor: '#00c1ab', color: '#00c1ab' }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Drawer למובייל וטאבלט */}
      <Drawer 
        anchor="right" 
        open={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        slotProps={{ 
          backdrop: {
            sx: {
              // אם יש טקסט בחיפוש - מבטל טשטוש וצבע רקע כדי שיראו את התוצאות
              backdropFilter: searchTerm ? 'none' : 'blur(4px)',
              backgroundColor: searchTerm ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s ease',
            }
          },
          content: { 
            sx: { 
              bgcolor: '#0a0a0c', 
              color: 'white', 
              p: 3, 
              direction: 'rtl',
              boxShadow: searchTerm ? '-10px 0 30px rgba(0,0,0,0.8)' : 'none' 
            } 
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography level="h6" sx={neonGlow}>תפריט</Typography>
          <IconButton onClick={() => setIsMenuOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </Box>

        <Input
          placeholder="חיפוש..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startDecorator={<SearchIcon sx={{ color: '#00c1ab' }} />}
          sx={{ 
            mb: 3, 
            backgroundColor: '#1a1a1a', 
            color: 'white',
            borderColor: '#333',
            '&:focus-within': { borderColor: '#00c1ab' }
          }}
        />

        <Divider sx={{ mb: 2, bgcolor: '#333' }} />
        <List><NavLinks isMobile /></List>
        
        <Box sx={{ mt: 'auto', textAlign: 'center', pb: 2 }}>
           <Typography sx={{ mb: 2 }}>מחובר כ: <b style={neonGlow}>{userName || 'אורח'}</b></Typography>
           {token && <Button fullWidth color="danger" variant="soft" onClick={handleLogout}>התנתק מהמערכת</Button>}
        </Box>
      </Drawer>
    </Sheet>
  );
};

export default Navbar;