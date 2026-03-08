import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";
import { 
  AppBar, Toolbar, Typography, Button, InputBase, Box, 
  IconButton, Menu, MenuItem, useMediaQuery, useTheme 
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
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
          <>
            <IconButton onClick={handleMenuOpen} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { bgcolor: "#020617", color: "white", border: "1px solid #40e0d0" }
              }}
            >
              <MenuItem onClick={handleMenuClose} component={Link} to="/quizzes">חידונים</MenuItem>
              {user && <MenuItem onClick={handleMenuClose} component={Link} to="/my-scores">הציונים שלי</MenuItem>}
              
              {/* תפריט מנהלים למובייל */}
              {user?.role === 'admin' && (
                [
                  <MenuItem key="create" onClick={handleMenuClose} component={Link} to="/create-quiz">צור חידון</MenuItem>,
                  <MenuItem key="scores" onClick={handleMenuClose} component={Link} to="/admin/all-scores">כל הציונים</MenuItem>,
                  <MenuItem key="users" onClick={handleMenuClose} component={Link} to="/admin/users" sx={{ color: '#40e0d0' }}>ניהול משתמשים</MenuItem>
                ]
              )}

              {user ? (
                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>התנתק</MenuItem>
              ) : (
                <MenuItem onClick={handleMenuClose} component={Link} to="/login">התחבר</MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button component={Link} to="/quizzes" sx={{ color: "white" }}>חידונים</Button>
            {user && <Button component={Link} to="/my-scores" sx={{ color: "white" }}>הציונים שלי</Button>}
            
            {/* תפריט מנהלים לדסקטופ */}
            {user?.role === 'admin' && (
              <>
                <Button component={Link} to="/create-quiz" sx={{ color: "#40e0d0" }}>צור חידון</Button>
                <Button component={Link} to="/admin/all-scores" sx={{ color: "#40e0d0" }}>כל הציונים</Button>
                <Button component={Link} to="/admin/users" sx={{ color: "#40e0d0", fontWeight: "bold" }}>ניהול משתמשים</Button>
              </>
            )}

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }} dir="rtl">
                  שלום, <Box component="span" sx={{ fontWeight: "bold" }}>{user.userName}</Box>
                </Typography>
                <Button 
                  onClick={handleLogout} 
                  variant="outlined" 
                  size="small" 
                  sx={{ borderColor: "#40e0d0", color: "#40e0d0", borderRadius: "20px" }}
                >
                  התנתק
                </Button>
              </Box>
           ) : (
              // התיקון: הורדנו את ה-bgcolor והריווחים המיותרים
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }} dir="rtl">
                  שלום, <Box component="span" sx={{ fontWeight: "bold" }}>אורח!</Box>
                </Typography>
                <Button 
                  component={Link} 
                  to="/login" 
                  variant="contained" 
                  size="small"
                  sx={{ bgcolor: "#40e0d0", color: "#020617", borderRadius: "20px", fontWeight: "bold" }}
                >
                  התחבר
                </Button>
              </Box>
            )}
            
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;