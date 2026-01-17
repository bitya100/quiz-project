import React, { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Button, Typography, Container, Box, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade
} from '@mui/material';
import './ManageUsers.css';

// הגדרת אנימציית המעבר (Fade/Pop-in)
const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} timeout={400} />;
});

const ManageUsers = ({ searchTerm }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State לניהול חלונית האישור
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user => 
            user.userName?.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
            user.email?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/users/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setFilteredUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("שגיאה בטעינת משתמשים", err);
            setLoading(false);
        }
    };

    const openConfirmDialog = (userId, newRole, userName) => {
        setPendingAction({ userId, newRole, userName });
        setConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!pendingAction) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/users/update-role/${pendingAction.userId}`, 
                { role: pendingAction.newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConfirmOpen(false);
            fetchUsers();
        } catch (err) {
            console.error("שגיאה בעדכון", err);
            setConfirmOpen(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress sx={{ color: '#00c1ab' }} />
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }} dir="rtl">
            <Typography variant="h3" component="h1" className="admin-page-title" sx={{ mb: 4 }}>
                ניהול משתמשים 👥
            </Typography>

            <TableContainer component={Paper} className="scores-table-container" elevation={5}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">שם משתמש</TableCell>
                            <TableCell align="right">אימייל</TableCell>
                            <TableCell align="right">תפקיד</TableCell>
                            <TableCell align="center">פעולות</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user._id} className="user-row" hover>
                                    <TableCell align="right">{user.userName}</TableCell>
                                    <TableCell align="right">{user.email}</TableCell>
                                    <TableCell align="right">
                                        <span className={user.role === 'admin' ? 'role-admin' : 'role-user'}>
                                            {user.role === 'admin' ? 'מנהל ⭐' : 'משתמש'}
                                        </span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button 
                                            variant="contained" 
                                            className={user.role === 'admin' ? 'btn-to-user' : 'btn-to-admin'}
                                            sx={{ fontWeight: 'bold', borderRadius: '8px', minWidth: '120px' }}
                                            onClick={() => openConfirmDialog(user._id, user.role === 'admin' ? 'user' : 'admin', user.userName)}
                                        >
                                            {user.role === 'admin' ? 'הפוך למשתמש' : 'הפוך למנהל'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    לא נמצאו משתמשים
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* דיאלוג אישור מעוצב עם אנימציה */}
            <Dialog 
                open={confirmOpen} 
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setConfirmOpen(false)} 
                className="dark-dialog"
                dir="rtl"
            >
                <DialogTitle className="custom-dialog-title">
                     אישור שינוי הרשאה
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className="custom-dialog-text">
                        האם אתה בטוח שברצונך לשנות את הסטטוס של <strong>{pendingAction?.userName}</strong> ל-
                        <strong>{pendingAction?.newRole === 'admin' ? 'מנהל' : 'משתמש רגיל'}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
                    <Button onClick={() => setConfirmOpen(false)} className="dialog-cancel-btn">
                        ביטול
                    </Button>
                    <Button onClick={handleConfirmAction} variant="contained" className="dialog-confirm-btn">
                        כן, בצע שינוי
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageUsers;