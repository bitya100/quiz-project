# טכנולוגיות בשימוש ##

Backend: Node.js, Express, Mongoose, JWT, Bcrypt, Joi.

Frontend: React (Vite), Axios, React Router.

Database: MongoDB Atlas.

מכיוון שהפרויקט משתמש במשתני סביבה מאובטחים, יש לבצע את השלבים הבאים כדי להפעיל אותו בהצלחה:

1. הגדרת שרת (Server)
היכנסו לתיקיית server.

הריצו את הפקודה npm install להתקנה.

שלב קריטי: צרו קובץ חדש בתיקיית ה-server וקראו לו בשם .env.

העתיקו את התוכן מקובץ ה-.env.example והדביקו אותו בתוך ה-.env החדש שיצרתם.

הזנת נתונים: בשדה MONGO_URI, הזינו את קישור ההתחברות שלכם ל-MongoDB Atlas. בשדה JWT_SECRET, הזינו קוד סודי כלשהו (למשל: mySecret123)

הריצו את השרת בעזרת הפקודה: npm start

2. הגדרת לקוח (Client)
היכנסו לתיקיית client

הריצו את הפקודה npm install

הריצו את האפליקציה בעזרת הפקודה: npm run dev

ייחודי: אם יש רק מנהל 1, הוא לא יוכל להפוך את עצמו למשתמש