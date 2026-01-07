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
            const res = await axios.get('http://localhost:3001/api/users/all');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("שגיאה בטעינת משתמשים", err);
            setLoading(false);
        }
    };

    const handleMakeAdmin = async (userId) => {
        if (!window.confirm("האם להפוך משתמש זה למנהל מערכת?")) return;
        try {
            await axios.put(`http://localhost:3001/api/users/make-admin/${userId}`);
            alert("המשתמש עודכן כמנהל!");
            fetchUsers(); // רענון הרשימה
        } catch (err) {
            alert("שגיאה בעדכון המשתמש");
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>טוען משתמשים...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: 'white' }}>ניהול משתמשים 👥</h1>
            <div className="table-container">
                <table>
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
                                <td>{user.role === 'admin' ? 'מנהל ⭐' : 'משתמש'}</td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => handleMakeAdmin(user._id)}
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
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default ManageUsers;