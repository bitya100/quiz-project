import { useForm } from 'react-hook-form';
import axios from 'axios';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log("שולח נתונים:", data); // לבדיקה ב-Console
    try {
      const response = await axios.post('http://localhost:3001/api/users/register', data);
      alert('נרשמת בהצלחה!');
    } catch (error) {
      console.error('שגיאה:', error);
      alert('שגיאה בחיבור לשרת');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>הרשמה</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input {...register("userName")} placeholder="שם משתמש" />
        <input {...register("email")} placeholder="אימייל" type="email" />
        <input {...register("password")} placeholder="סיסמה" type="password" />
        <button type="submit">שלח</button>
      </form>
    </div>
  );
}

export default Register;