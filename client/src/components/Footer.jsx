import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography, Box, CircularProgress, 
  Snackbar, Alert 
} from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [guestName, setGuestName] = useState(''); 
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, msg: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // בונים את אובייקט הנתונים הבסיסי
    const formData = {
      name: user ? user.userName : guestName, 
      message: message,
      userRole: user ? user.role : 'אורח לא רשום'
    };

    // התיקון הקריטי לשגיאת 422:
    // מוסיפים את שדה ה-email *רק* אם באמת יש כתובת אימייל חוקית
    const actualEmail = user ? user.email : guestEmail;
    if (actualEmail) {
        formData.email = actualEmail;
    } else {
        // אם אין אימייל, נשלח את ההודעה בשדה עם שם אחר כדי לא לעצבן את הוולידציה של Formspree
        formData.contact_info = 'המשתמש בחר לא להשאיר כתובת אימייל';
    }

    try {
      // ⚠️ להדביק פה את הכתובת האמיתית שלך מ-Formspree! ⚠️
      const response = await fetch("https://formspree.io/f/mgonypvo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setNotification({ open: true, msg: 'ההודעה נשלחה אליי בהצלחה! תודה רבה.', severity: 'success' });
        setOpen(false);
        setMessage('');
        setGuestName('');
        setGuestEmail('');
      } else {
        setNotification({ open: true, msg: 'אופס.. משהו השתבש בשליחה.', severity: 'error' });
      }
    } catch (error) {
      setNotification({ open: true, msg: 'שגיאת רשת. בדוק את החיבור לאינטרנט.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer style={{ 
        width: '100%', padding: '20px 0', textAlign: 'center',
        background: 'rgba(2, 6, 23, 0.9)', borderTop: '1px solid rgba(64, 224, 208, 0.2)',
        color: '#40e0d0', position: 'relative', zIndex: 10, marginTop: 'auto' 
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>
          כל הזכויות שמורות &copy; {currentYear} 
          <Box 
            component="span" 
            onClick={() => setOpen(true)}
            sx={{ 
              mx: 1, cursor: 'pointer', textDecoration: 'underline',
              transition: '0.2s', '&:hover': { color: '#bc13fe', textShadow: '0 0 8px #bc13fe' }
            }}
          >
            ביתיה
          </Box>
        </p>
      </footer>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        dir="rtl"
        PaperProps={{ sx: { bgcolor: '#020617', color: 'white', border: '1px solid #40e0d0', borderRadius: 3, minWidth: { xs: '90vw', sm: '400px' } } }}
      >
        <DialogTitle sx={{ color: '#40e0d0', fontWeight: 'bold' }}>
          רוצים לדבר איתי? 👋
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3, opacity: 0.8 }}>
            אשמח לשמוע מה דעתכם על האתר, הצעות לשיפור או סתם לומר שלום!
          </Typography>
          
          <form id="contact-form" onSubmit={handleSubmit}>
            {!user && (
              <>
                <TextField
                  fullWidth
                  label="איך קוראים לכם?"
                  required 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  InputLabelProps={{ style: { color: '#40e0d0' } }}
                  sx={{ mb: 3, mt: 1, input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(64, 224, 208, 0.5)' }, '&:hover fieldset': { borderColor: '#40e0d0' } } }}
                />
                <TextField
                  fullWidth
                  label="אימייל (אופציונלי - כדי שאוכל לחזור אליכם)"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  InputLabelProps={{ style: { color: '#40e0d0' } }}
                  sx={{ mb: 3, input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(64, 224, 208, 0.5)' }, '&:hover fieldset': { borderColor: '#40e0d0' } } }}
                />
              </>
            )}
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="ההודעה שלכם..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              InputLabelProps={{ style: { color: '#40e0d0' } }}
              sx={{ mt: user ? 1 : 0, textarea: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(64, 224, 208, 0.5)' }, '&:hover fieldset': { borderColor: '#40e0d0' } } }}
            />
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'white' }}>
            ביטול
          </Button>
          <Button 
            type="submit" 
            form="contact-form" 
            variant="contained" 
            disabled={loading}
            sx={{ bgcolor: '#bc13fe', fontWeight: 'bold', borderRadius: '20px', '&:hover': { bgcolor: '#a00bd9' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'שליחה'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={5000} onClose={() => setNotification({ ...notification, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={notification.severity} sx={{ bgcolor: '#020617', color: '#40e0d0', border: '1px solid #40e0d0' }}>
          {notification.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Footer;