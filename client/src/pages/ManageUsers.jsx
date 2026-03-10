import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Tooltip, 
  Box, CircularProgress, Select, MenuItem, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock"; 
import adminService from "../services/adminService";

const SUPER_ADMIN_EMAIL = "admin10@gmail.com"; 

const ManageUsers = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  
  // הוספנו סטייט לחלון מחיקה מעוצב כמו בדף הציונים
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userObj: null });
  
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
      if (err.response?.status !== 503) {
        setNotification({ open: true, message: "שגיאה בטעינת המשתמשים", severity: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const currentUserData = users.find(u => u._id === currentUser?.userId || u._id === currentUser?._id);
  const isSuperAdmin = currentUserData?.email === SUPER_ADMIN_EMAIL || currentUser?.email === SUPER_ADMIN_EMAIL;

  const handleRoleChange = async (userId, newRole, userEmail) => {
    if (userEmail === SUPER_ADMIN_EMAIL) {
      return setNotification({ open: true, message: "לא ניתן לשנות את ההרשאה של מנהל העל!", severity: "warning" });
    }

    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setNotification({ open: true, message: "הרשאת המשתמש עודכנה בהצלחה", severity: "success" });
    } catch (err) {
      const errorMessage = err.response?.data || "שגיאה בעדכון הרשאה";
      setNotification({ open: true, message: errorMessage, severity: "error" });
    }
  };

  // פתיחת חלון אישור במקום ה- window.confirm המכוער
  const handleDeleteClick = (userObj) => {
    if (!isSuperAdmin) {
      return setNotification({ open: true, message: "רק מנהל-על מורשה למחוק משתמשים!", severity: "error" });
    }
    if (userObj.email === SUPER_ADMIN_EMAIL) {
      return setNotification({ open: true, message: "לא ניתן למחוק את מנהל העל של המערכת!", severity: "warning" });
    }
    setDeleteDialog({ open: true, userObj });
  };

  // ביצוע המחיקה בפועל
  const confirmDelete = async () => {
    try {
      await adminService.deleteUser(deleteDialog.userObj._id);
      setUsers(users.filter(u => u._id !== deleteDialog.userObj._id));
      setNotification({ open: true, message: "המשתמש נמחק בהצלחה", severity: "success" });
    } catch (err) {
      setNotification({ open: true, message: "שגיאה במחיקת משתמש", severity: "error" });
    } finally {
      setDeleteDialog({ open: false, userObj: null });
    }
  };

  const safeSearchTerm = (searchTerm || "").toLowerCase();
  const filteredUsers = users.filter(u => 
    (u.userName || "").toLowerCase().includes(safeSearchTerm) || 
    (u.email || "").toLowerCase().includes(safeSearchTerm)
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="inherit" /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'right', color: '#40e0d0', fontWeight: 'bold' }}>
        ניהול משתמשים במערכת
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)', 
          backdropFilter: 'blur(15px)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          borderRadius: 3, 
          color: 'white',
          overflow: 'hidden' 
        }}
      >
        <Table dir="rtl">
          <TableHead sx={{ bgcolor: 'rgba(64, 224, 208, 0.08)', borderBottom: '2px solid rgba(64, 224, 208, 0.3)' }}>
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
                    disabled={user.email === SUPER_ADMIN_EMAIL}
                    MenuProps={{
                      PaperProps: {
                        sx: { bgcolor: '#020617', color: 'white', border: '1px solid #40e0d0' }
                      }
                    }}
                    sx={{ 
                      color: 'white', 
                      minWidth: '120px',
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
                  {/* העתקנו את לוגיקת המנעול מדף הציונים */}
                  {isSuperAdmin ? (
                    <Tooltip title={user.email === SUPER_ADMIN_EMAIL ? "לא ניתן למחוק מנהל-על" : "מחק משתמש"}>
                      <span>
                        <IconButton 
                          onClick={() => handleDeleteClick(user)} 
                          sx={{ color: '#f44336' }} 
                          disabled={user.email === SUPER_ADMIN_EMAIL}
                        >
                          {user.email === SUPER_ADMIN_EMAIL ? <LockIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.3)' }} /> : <DeleteIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="מחיקה למנהל-על בלבד">
                      <Box sx={{ display: 'inline-flex', opacity: 0.5 }}>
                        <LockIcon fontSize="small" sx={{ color: 'white' }} />
                      </Box>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* חלון המחיקה המעוצב שלנו */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, userObj: null })} 
        PaperProps={{ sx: { bgcolor: '#020617', color: 'white', border: '1px solid #f44336' } }} 
        dir="rtl"
      >
        <DialogTitle sx={{ color: '#f44336', fontWeight: 'bold' }}>מחיקת משתמש לצמיתות</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את המשתמש <strong>{deleteDialog.userObj?.userName}</strong>?
            <br />פעולה זו אינה ניתנת לביטול!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, userObj: null })} sx={{ color: 'white' }}>ביטול</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: '#f44336', color: 'white', '&:hover': { bgcolor: '#d32f2f' } }}>מחק עכשיו</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
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