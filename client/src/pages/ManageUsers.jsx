import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
            alert("התפקיד עודכן בהצלחה!");
            fetchUsers(); 
        } catch (err) {
            alert("שגיאה בעדכון התפקיד");
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px', color: 'white'}}>טוען משתמשים...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: 'white', marginBottom: '30px' }}>ניהול משתמשים 👥</h1>
            <div className="table-container">
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
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td style={{ color: user.role === 'admin' ? 'var(--neon-purple)' : 'white' }}>
                                    {user.role === 'admin' ? 'מנהל ⭐' : 'משתמש'}
                                </td>
                                <td>
                                    {user.role === 'admin' ? (
                                        <button 
                                            onClick={() => handleRoleChange(user._id, 'user', user.userName)}
                                            style={{...adminBtnStyle, backgroundColor: '#8c44ffff'}}
                                        >
                                            הפוך למשתמש
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleRoleChange(user._id, 'admin', user.userName)}
                                            style={adminBtnStyle}
                                        >
                                            הפוך למנהל
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const adminBtnStyle = {
    backgroundColor: 'var(--neon-purple)',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
};

export default ManageUsers;