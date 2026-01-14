import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Button, Typography, Container, Box, CircularProgress 
} from '@mui/material';
import './ManageUsers.css';

const ManageUsers = ({ searchTerm }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleRoleChange = async (userId, newRole, userName) => {
        const actionText = newRole === 'admin' ? "להפוך למנהל" : "להחזיר למשתמש רגיל";
        if (!window.confirm(`האם אתה בטוח שברצונך ${actionText} את ${userName}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/users/update-role/${userId}`, 
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
            <CircularProgress sx={{ color: '#00c1ab' }} />
        </Box>
    );

    return (
        /* שינוי: maxWidth וביטול Padding ידני שמתנגש */
        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }} dir="rtl">
            <Typography 
                variant="h3" 
                component="h1" 
                className="admin-page-title" 
                sx={{ 
                    mb: 4, 
                    fontFamily: 'Assistant, sans-serif', 
                    fontWeight: 800,
                    width: '100%'
                }}
            >
                ניהול משתמשים 👥
            </Typography>

            <TableContainer 
                component={Paper} 
                className="scores-table-container" 
                elevation={5}
                sx={{ 
                    overflowX: 'auto', 
                    width: '100%', // מבטיח שהטבלה לא תצא מהקונטיינר
                    maxWidth: '1200px'
                }}
            >
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#34495e' }}>
                            <TableCell align="right" sx={{ color: 'white', fontFamily: 'Assistant', fontWeight: 'bold' }}>שם משתמש</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontFamily: 'Assistant', fontWeight: 'bold' }}>אימייל</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontFamily: 'Assistant', fontWeight: 'bold' }}>תפקיד</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontFamily: 'Assistant', fontWeight: 'bold' }}>פעולות</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user._id} className="user-row" hover>
                                    <TableCell align="right" sx={{ fontFamily: 'Assistant' }}>{user.userName}</TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'Assistant' }}>{user.email}</TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'Assistant' }}>
                                        <span className={user.role === 'admin' ? 'role-admin' : 'role-user'}>
                                            {user.role === 'admin' ? 'מנהל ⭐' : 'משתמש'}
                                        </span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button 
                                            variant="contained" 
                                            className={user.role === 'admin' ? 'btn-to-user' : 'btn-to-admin'}
                                            sx={{ fontFamily: 'Assistant', fontWeight: 'bold', borderRadius: '8px', minWidth: '120px' }}
                                            onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin', user.userName)}
                                        >
                                            {user.role === 'admin' ? 'הפוך למשתמש' : 'הפוך למנהל'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" sx={{ fontFamily: 'Assistant', color: 'gray' }}>
                                        לא נמצאו משתמשים התואמים לחיפוש "{searchTerm}"
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ManageUsers;