import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>טוען...</div>;

    return (
        <div className="manage-users-page" dir="rtl">
            <h1 className="admin-title">ניהול משתמשים 👥</h1>
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>שם משתמש</th>
                            <th>אימייל</th>
                            <th>תפקיד</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td data-label="שם משתמש">{user.userName}</td>
                                <td data-label="אימייל">{user.email}</td>
                                <td data-label="תפקיד">
                                    <span style={{ color: user.role === 'admin' ? '#a333c8' : '#333', fontWeight: 'bold' }}>
                                        {user.role === 'admin' ? 'מנהל ⭐' : 'משתמש'}
                                    </span>
                                </td>
                                <td data-label="פעולות">
                                    <button 
                                        onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin', user.userName)}
                                        className={`admin-btn ${user.role === 'admin' ? 'btn-remove' : 'btn-add'}`}
                                    >
                                        {user.role === 'admin' ? 'הפוך למשתמש' : 'הפוך למנהל'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;