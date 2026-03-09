import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";
import { 
  AppBar, Toolbar, Typography, Button, InputBase, Box, 
  IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions // הוספתי ייבוא למודאל
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: "auto",
  [theme.breakpoints.up("sm")]: {
    width: "250px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  right: 0, 
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    textAlign: "right",
  },
}));

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false); // סטייט חדש למודאל האורחים

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // פונקציה שמטפלת בלחיצה על "הציונים שלי"
  const handleMyScoresClick = () => {
    if (user) {
      navigate('/my-scores');
      setDrawerOpen(false);
    } else {
      setDrawerOpen(false);
      setGuestModalOpen(true); // פותח את המודאל אם זה אורח
    }
  };

  const isActive = (path) => location.pathname === path;

  const navButtonStyle = (path) => ({
    color: isActive(path) ? "#40e0d0" : "white",
    fontWeight: isActive(path) ? "bold" : "normal",
    borderBottom: isActive(path) ? "2px solid #40e0d0" : "2px solid transparent",
    borderRadius: 0,
    '&:hover': {
      color: "#40e0d0",
      backgroundColor: "transparent"
    }
  });

  const listItemStyle = (path) => ({
    color: isActive(path) ? "#40e0d0" : "white",
    bgcolor: isActive(path) ? "rgba(64, 224, 208, 0.1)" : "transparent",
    borderRight: isActive(path) ? "4px solid #40e0d0" : "4px solid transparent",
    textAlign: 'right',
    cursor: 'pointer',
    '&:hover': {
      bgcolor: "rgba(64, 224, 208, 0.05)",
      color: "#40e0d0"
    }
  });

  return (
    <>
      <AppBar position="sticky" sx={{ 
        background: "rgba(2, 6, 23, 0.8)", 
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(64, 224, 208, 0.3)",
        boxShadow: "none"
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "#40e0d0",
              fontWeight: "bold",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center"
            }}
          >
            QUIZ MASTER
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "#40e0d0" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="חפש חידון..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Search>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              
              <IconButton onClick={toggleDrawer(true)} sx={{ color: "white" }}>
                <MenuIcon />
              </IconButton>
              
              <Drawer
                anchor="left" 
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: { 
                    width: 280, 
                    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)', 
                    backdropFilter: 'blur(20px)', 
                    borderRight: '1px solid rgba(64, 224, 208, 0.2)', 
                    color: 'white' 
                  }
                }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <IconButton onClick={toggleDrawer(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ color: '#40e0d0', fontWeight: 'bold' }}>
                    תפריט ניווט
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2, bgcolor: 'rgba(64, 224, 208, 0.2)' }} />
                
                <List dir="rtl" sx={{ flexGrow: 1 }}>
                  <ListItem component={Link} to="/quizzes" onClick={toggleDrawer(false)} sx={listItemStyle('/quizzes')}>
                    <ListItemText primary="חידונים" sx={{ textAlign: 'right' }} />
                  </ListItem>
                  
                  {/* התיקון: כפתור הציונים מופיע תמיד במובייל */}
                  <ListItem onClick={handleMyScoresClick} sx={listItemStyle('/my-scores')}>
                    <ListItemText primary="הציונים שלי" sx={{ textAlign: 'right' }} />
                  </ListItem>
                  
                  {user?.role === 'admin' && (
                    <>
                      <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      <ListItem component={Link} to="/create-quiz" onClick={toggleDrawer(false)} sx={listItemStyle('/create-quiz')}>
                        <ListItemText primary="צור חידון" sx={{ textAlign: 'right' }} />
                      </ListItem>
                      <ListItem component={Link} to="/admin/all-scores" onClick={toggleDrawer(false)} sx={listItemStyle('/admin/all-scores')}>
                        <ListItemText primary="כל הציונים" sx={{ textAlign: 'right' }} />
                      </ListItem>
                      <ListItem component={Link} to="/admin/users" onClick={toggleDrawer(false)} sx={listItemStyle('/admin/users')}>
                        <ListItemText primary="ניהול משתמשים" sx={{ textAlign: 'right' }} />
                      </ListItem>
                    </>
                  )}
                </List>

                <Divider sx={{ mt: 'auto', bgcolor: 'rgba(64, 224, 208, 0.2)' }} />

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', dir: 'rtl' }}>
                  {user ? (
                    <>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        שלום, <br/><Box component="span" sx={{ fontWeight: "bold", color: "white", fontSize: '1.1em' }}>{user.userName}</Box>
                      </Typography>
                      <Button 
                        onClick={() => { setDrawerOpen(false); handleLogout(); }} 
                        variant="outlined"
                        size="small"
                        sx={{ 
                          color: '#f44336', 
                          borderColor: 'rgba(244, 67, 54, 0.5)', 
                          borderRadius: "20px", 
                          '&:hover': { borderColor: '#f44336', bgcolor: 'rgba(244, 67, 54, 0.1)' } 
                        }}
                      >
                        התנתק
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        שלום, <br/><Box component="span" sx={{ fontWeight: "bold", color: "white", fontSize: '1.1em' }}>אורח!</Box>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          component={Link} 
                          to="/register" 
                          onClick={toggleDrawer(false)}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: '#40e0d0', 
                            borderColor: 'rgba(64, 224, 208, 0.5)', 
                            borderRadius: "20px", 
                            '&:hover': { borderColor: '#40e0d0', bgcolor: 'rgba(64, 224, 208, 0.1)' } 
                          }}
                        >
                          הרשמה
                        </Button>
                        <Button 
                          component={Link} 
                          to="/login" 
                          onClick={toggleDrawer(false)}
                          variant="contained"
                          size="small"
                          sx={{ 
                            bgcolor: '#40e0d0', 
                            color: '#020617', 
                            borderRadius: "20px", 
                            fontWeight: "bold", 
                            '&:hover': { bgcolor: '#2dd4bf' } 
                          }}
                        >
                          התחברות
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Drawer>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              
              <Button component={Link} to="/quizzes" sx={navButtonStyle('/quizzes')}>חידונים</Button>
              
              {/* התיקון: כפתור הציונים מופיע תמיד במחשב שולחני */}
              <Button onClick={handleMyScoresClick} sx={navButtonStyle('/my-scores')}>הציונים שלי</Button>
              
              {user?.role === 'admin' && (
                <>
                  <Button component={Link} to="/create-quiz" sx={navButtonStyle('/create-quiz')}>צור חידון</Button>
                  <Button component={Link} to="/admin/all-scores" sx={navButtonStyle('/admin/all-scores')}>כל הציונים</Button>
                  <Button component={Link} to="/admin/users" sx={navButtonStyle('/admin/users')}>ניהול משתמשים</Button>
                </>
              )}

              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }} dir="rtl">
                    שלום, <Box component="span" sx={{ fontWeight: "bold", color: "white" }}>{user.userName}</Box>
                  </Typography>
                  <Button 
                    onClick={handleLogout} 
                    variant="outlined" 
                    size="small" 
                    sx={{ borderColor: "rgba(255,255,255,0.3)", color: "white", borderRadius: "20px", '&:hover': { borderColor: '#f44336', color: '#f44336' } }}
                  >
                    התנתק
                  </Button>
                </Box>
               ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }} dir="rtl">
                    שלום, <Box component="span" sx={{ fontWeight: "bold", color: "white" }}>אורח!</Box>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      component={Link} 
                      to="/register" 
                      variant="outlined" 
                      size="small"
                      sx={{ borderColor: "#40e0d0", color: "#40e0d0", borderRadius: "20px", '&:hover': { borderColor: '#2dd4bf', color: '#2dd4bf', bgcolor: 'rgba(64, 224, 208, 0.1)' } }}
                    >
                      הרשמה
                    </Button>
                    <Button 
                      component={Link} 
                      to="/login" 
                      variant="contained" 
                      size="small"
                      sx={{ bgcolor: "#40e0d0", color: "#020617", borderRadius: "20px", fontWeight: "bold", '&:hover': { bgcolor: '#2dd4bf' } }}
                    >
                      התחברות
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* מודאל "תפריט רפאים" לאורחים */}
      <Dialog 
        open={guestModalOpen} 
        onClose={() => setGuestModalOpen(false)} 
        PaperProps={{ 
          sx: { 
            bgcolor: '#020617', 
            color: 'white', 
            border: '2px solid #40e0d0',
            borderRadius: 3,
            boxShadow: '0 0 20px rgba(64, 224, 208, 0.3)'
          } 
        }} 
        dir="rtl"
      >
        <DialogTitle sx={{ color: '#40e0d0', fontWeight: 'bold', textAlign: 'center', fontSize: '1.5rem', mt: 1 }}>
          רוצה לשמור את הציונים שלך?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', fontSize: '1.1rem', mb: 1 }}>
            הירשם עכשיו בחינם ותוכל לעקוב אחר ההתקדמות שלך, לראות את היסטוריית החידונים האישית שלך ולהשוות ציונים!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button onClick={() => setGuestModalOpen(false)} sx={{borderRadius : '15px',boxShadow: '0 0 5px #1e7869' , color: 'rgba(255, 255, 255, 0.87)' }}>
            אולי אחר כך
          </Button>
          <Button 
            component={Link} 
            to="/register" 
            onClick={() => setGuestModalOpen(false)} 
            variant="contained" 
            sx={{ 
              bgcolor: '#1e7869', // סגול ניאון בולט
              color: 'white', 
              fontWeight: 'bold', 
              borderRadius: '20px',
              padding: '6px 25px',
              '&:hover': { bgcolor: '#1e7869', boxShadow: '0 0 15px #1e7869' } 
            }}
          >
            להרשמה המהירה
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;