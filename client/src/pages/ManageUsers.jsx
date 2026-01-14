import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Button, Typography, Container, Box, CircularProgress 
} from '@mui/material';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/users/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("שגיאה בטעינת משתמשים", err);
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole, userName) => {
        const actionText = newRole === 'admin' ? "להפוך למנהל" : "להחזיר למשתמש רגיל";
        if (!window.confirm(`האם אתה בטוח שברצונך ${actionText} את ${userName}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/api/users/update-role/${userId}`, 
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers(); 
        } catch (err) {
            alert("שגיאה בעדכון התפקיד");
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Container maxWidth="lg" className="manage-users-page" sx={{ py: 4 }} dir="rtl">
            {/* הכותרת הותאמה בדיוק למראה של דף הציונים */}
            <Typography 
                variant="h3" 
                component="h1" 
                className="admin-page-title" 
                sx={{ 
                    mb: 4, 
                    fontFamily: 'Assistant, sans-serif', 
                    fontWeight: 800 
                }}
            >
                ניהול משתמשים 👥
            </Typography>

            <TableContainer component={Paper} className="scores-table-container">
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{ fontFamily: 'inherit', fontWeight: 'bold' }}>שם משתמש</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'inherit', fontWeight: 'bold' }}>אימייל</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'inherit', fontWeight: 'bold' }}>תפקיד</TableCell>
                            <TableCell align="center" sx={{ fontFamily: 'inherit', fontWeight: 'bold' }}>פעולות</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} className="user-row">
                                <TableCell align="right" sx={{ fontFamily: 'inherit' }}>{user.userName}</TableCell>
                                <TableCell align="right" sx={{ fontFamily: 'inherit' }}>{user.email}</TableCell>
                                <TableCell align="right" sx={{ fontFamily: 'inherit' }}>
                                    <span className={user.role === 'admin' ? 'role-admin' : 'role-user'}>
                                        {user.role === 'admin' ? 'מנהל ⭐' : 'משתמש'}
                                    </span>
                                </TableCell>
                                <TableCell align="center">
                                    <Button 
                                        variant="contained" 
                                        className={user.role === 'admin' ? 'btn-to-user' : 'btn-to-admin'}
                                        sx={{ fontFamily: 'inherit', fontWeight: 'bold' }}
                                        onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin', user.userName)}
                                    >
                                        {user.role === 'admin' ? 'הפוך למשתמש' : 'הפוך למנהל'}
                                    </Button>
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