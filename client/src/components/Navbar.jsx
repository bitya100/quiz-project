import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Divider
} from '@mui/material';
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

  const toggleDrawer = (open) => () => {
    setIsMenuOpen(open);
  };

  // תפריט הצד (Drawer) לניידים - עומד בדרישת "תפריט המבורגר" 
  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton><CloseIcon /></IconButton>
      </Box>
      <List>
        <ListItem button component={Link} to="/quizzes">
          <ListItemText primary="חידונים" sx={{ textAlign: 'right' }} />
        </ListItem>
        {token && (
          <ListItem button component={Link} to="/my-scores">
            <ListItemText primary="הציונים שלי" sx={{ textAlign: 'right' }} />
          </ListItem>
        )}
        {token && userRole === 'admin' && (
          <>
            <Divider />
            <ListItem button component={Link} to="/admin/all-scores">
              <ListItemText primary="ניהול ציונים" sx={{ textAlign: 'right', color: 'purple' }} />
            </ListItem>
            <ListItem button component={Link} to="/admin/users">
              <ListItemText primary="ניהול משתמשים" sx={{ textAlign: 'right', color: 'orange' }} />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1">שלום, <b>{userName || 'אורח'}</b></Typography>
        {!token ? (
          <>
            <Button fullWidth component={Link} to="/login" sx={{ mt: 1 }}>התחברות</Button>
            <Button fullWidth variant="contained" component={Link} to="/register" sx={{ mt: 1 }}>הרשמה</Button>
          </>
        ) : (
          <Button fullWidth variant="outlined" color="error" onClick={handleLogout} sx={{ mt: 1 }}>התנתק</Button>
        )}
      </Box>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#121212', borderBottom: '1px solid #333' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
          {/* לוגו */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: '#00c1ab', fontWeight: 'bold', letterSpacing: 1 }}
          >
            QUIZ ZONE
          </Typography>

          {/* תפריט למסכים גדולים (Desktop)  */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button component={Link} to="/quizzes" color="inherit">חידונים</Button>
            {token && <Button component={Link} to="/my-scores" color="inherit">הציונים שלי</Button>}
            
            {token && userRole === 'admin' && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button component={Link} to="/admin/all-scores" sx={{ color: '#bc13fe' }}>ניהול ציונים</Button>
                <Button component={Link} to="/admin/users" sx={{ color: '#ffcc00' }}>ניהול משתמשים</Button>
              </Box>
            )}

            <Typography sx={{ ml: 2, color: '#ccc' }}>
              שלום, <span style={{ color: '#00c1ab' }}>{userName || 'אורח'}</span>
            </Typography>

            {!token ? (
              <>
                <Button component={Link} to="/login" color="inherit">התחברות</Button>
                <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: '#00c1ab' }}>הרשמה</Button>
              </>
            ) : (
              <Button onClick={handleLogout} variant="outlined" color="error" size="small">התנתק</Button>
            )}
          </Box>

          {/* כפתור המבורגר לניידים  */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Drawer - התפריט שנפתח מהצד */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;