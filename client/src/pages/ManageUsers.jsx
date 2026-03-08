import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Box, CircularProgress, Select, MenuItem, Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import adminService from "../services/adminService";

const SUPER_ADMIN_EMAIL = "admin10@gmail.com"; 

const ManageUsers = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const currentUserData = users.find(u => u._id === currentUser?.userId);
  const isSuperAdmin = currentUserData?.email === SUPER_ADMIN_EMAIL;

const handleRoleChange = async (userId, newRole, userEmail) => {
    if (userEmail === SUPER_ADMIN_EMAIL) {
      return setNotification({ open: true, message: "לא ניתן לשנות את ההרשאה של מנהל העל!", severity: "warning" });
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3001/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setNotification({ open: true, message: "הרשאת המשתמש עודכנה בהצלחה", severity: "success" });
    } catch (err) {
      // התיקון: משיכת השגיאה האמיתית מהשרת (כמו "גישה נדחתה") במקום טקסט גנרי
      const errorMessage = err.response?.data || "שגיאה בעדכון הרשאה";
      setNotification({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const handleDelete = async (userObj) => {
    // מחיקה נשארת חסומה רק למנהל על
    if (!isSuperAdmin) {
      return setNotification({ open: true, message: "רק מנהל-על מורשה למחוק משתמשים!", severity: "error" });
    }
    if (userObj.email === SUPER_ADMIN_EMAIL) {
      return setNotification({ open: true, message: "לא ניתן למחוק את מנהל העל של המערכת!", severity: "warning" });
    }

    if (window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש ${userObj.userName} לצמיתות?`)) {
      try {
        await adminService.deleteUser(userObj._id);
        setUsers(users.filter(u => u._id !== userObj._id));
        setNotification({ open: true, message: "המשתמש נמחק בהצלחה", severity: "success" });
      } catch (err) {
        setNotification({ open: true, message: "שגיאה במחיקת משתמש", severity: "error" });
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'right', color: '#40e0d0', fontWeight: 'bold' }}>
        ניהול משתמשים במערכת
      </Typography>

      <TableContainer component={Paper} sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64, 224, 208, 0.2)', color: 'white' }}>
        <Table dir="rtl">
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.5)' }}>
            <TableRow>
              <TableCell align="right" sx={{ color: '#40e0d0', fontWeight: 'bold' }}>שם משתמש</TableCell>
              <TableCell align="right" sx={{ color: '#40e0d0', fontWeight: 'bold' }}>אימייל</TableCell>
              <TableCell align="right" sx={{ color: '#40e0d0', fontWeight: 'bold' }}>תפקיד</TableCell>
              <TableCell align="center" sx={{ color: '#40e0d0', fontWeight: 'bold' }}>מחיקה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                <TableCell align="right" sx={{ color: 'white' }}>
                  {user.userName} {user.email === SUPER_ADMIN_EMAIL && "👑"}
                </TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>{user.email}</TableCell>
                
                <TableCell align="right">
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value, user.email)}
                    size="small"
                    // התיקון: כולם יכולים לשנות, אלא אם זה מנהל העל
                    disabled={user.email === SUPER_ADMIN_EMAIL}
                    sx={{ 
                      color: 'white', 
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(64, 224, 208, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#40e0d0' },
                      '& .MuiSvgIcon-root': { color: 'white' },
                      '&.Mui-disabled': { color: 'rgba(255,255,255,0.5)' }
                    }}
                  >
                    <MenuItem value="user">משתמש (user)</MenuItem>
                    <MenuItem value="admin">מנהל (admin)</MenuItem>
                  </Select>
                </TableCell>
                
                <TableCell align="center">
                  <Tooltip title={isSuperAdmin ? "מחק משתמש" : "מחיקה למנהל-על בלבד"}>
                    <span>
                      <IconButton 
                        onClick={() => handleDelete(user)} 
                        color="error" 
                        // מחיקה נשארת חסומה למי שאינו מנהל על
                        disabled={!isSuperAdmin || user.email === SUPER_ADMIN_EMAIL}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={() => setNotification({ ...notification, open: false })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 10 }}
      >
        <Alert severity={notification.severity} sx={{ width: '100%', bgcolor: '#020617', color: '#40e0d0', border: `1px solid ${notification.severity === 'error' ? '#f44336' : '#40e0d0'}` }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageUsers;