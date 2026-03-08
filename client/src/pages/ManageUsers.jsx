import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Box, CircularProgress, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import adminService from "../services/adminService";

// הגדרת מנהל העל של המערכת לפי אימייל
const SUPER_ADMIN_EMAIL = "mmm@gmail.com"; 

const ManageUsers = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // משיכת פרטי המשתמש המחובר מה-Redux כדי לדעת מי מנסה למחוק
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

  // פונקציה לשינוי תפקיד המשתמש
  const handleRoleChange = async (userId, newRole, userEmail) => {
    if (userEmail === SUPER_ADMIN_EMAIL) {
      return alert("לא ניתן לשנות את ההרשאה של מנהל העל!");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3001/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("שגיאה בעדכון הרשאה. ודא שהוספת את הראוט בשרת.");
      console.error(err);
    }
  };

  const handleDelete = async (userObj) => {
    // 1. הגנה על מנהל העל
    if (userObj.email === SUPER_ADMIN_EMAIL) {
      return alert("לא ניתן למחוק את מנהל העל של המערכת!");
    }

    // 2. בדיקה האם מי שלחץ על הכפתור הוא מנהל העל בעצמו
    const currentUserData = users.find(u => u._id === currentUser?.userId);
    const isSuperAdmin = currentUserData?.email === SUPER_ADMIN_EMAIL;

    if (!isSuperAdmin) {
      return alert("פעולה נדחתה: רק מנהל-על מורשה למחוק משתמשים. באפשרותך לשנות הרשאות חשבון בלבד.");
    }

    // 3. מחיקה בפועל
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את ${userObj.userName}?`)) {
      try {
        await adminService.deleteUser(userObj._id);
        setUsers(users.filter(u => u._id !== userObj._id));
      } catch (err) {
        alert("שגיאה במחיקת משתמש");
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
                <TableCell align="right" sx={{ color: 'white' }}>{user.userName}</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>{user.email}</TableCell>
                
                {/* תיבת בחירה לשינוי תפקיד */}
                <TableCell align="right">
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value, user.email)}
                    size="small"
                    sx={{ 
                      color: 'white', 
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(64, 224, 208, 0.3)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#40e0d0' },
                      '& .MuiSvgIcon-root': { color: 'white' }
                    }}
                  >
                    <MenuItem value="user">משתמש (user)</MenuItem>
                    <MenuItem value="admin">מנהל (admin)</MenuItem>
                  </Select>
                </TableCell>
                
                {/* כפתור מחיקה */}
                <TableCell align="center">
                  <Tooltip title="מחק משתמש (למנהל-על בלבד)">
                    <IconButton onClick={() => handleDelete(user)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageUsers;