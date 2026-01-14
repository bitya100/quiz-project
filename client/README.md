<!--
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

ייחודי: אם יש רק מנהל 1, הוא לא יוכל להפוך את עצמו למשתמש -->




פרויקט מסכם - מערכת חידונים אינטראקטיבית
#  אודות הפרויקט:   ##
מערכת לניהול וביצוע חידונים הכוללת ממשק ניהול מתקדם, אבטחת מידע ועיצוב רספונסיבי מלא.



# טכנולוגיות בשימוש ##

Backend: Node.js, Express, Mongoose, JWT, Bcrypt, Joi.





Frontend: React (Vite), Axios, React Router, MUI, Joy UI.





Database: MongoDB Atlas.

#  דרישות מרכזיות שמומשו בפרויקט  ##

ניהול משתמשים והרשאות: הפרדה מלאה בין משתמש רגיל למנהל מערכת.



אבטחה: הצפנת סיסמאות ב-Server Side באמצעות pre('save') של Mongoose.



אימות נתונים (Validation): שימוש ב-Joi בשרת ובדיקות תקינות בלקוח.


#  עיצוב:   ##
 תמיכה מלאה ב-RTL (עברית) וממשק רספונסיבי למובייל ולדסקטופ.


#  ארכיטקטורה:   ##
 חלוקה מודולרית ל-Routes, Controllers ו-Models

הוראות הפעלה
1. הגדרת שרת (Server)
היכנסו לתיקיית server.

הריצו את הפקודה npm install.

הפעילו את השרת: npm start או npm run dev.

2. הגדרת לקוח (Client)
היכנסו לתיקיית client.

הריצו את הפקודה npm install.

הפעילו את האפליקציה: npm run dev.


💡 הערות מיוחדות

#  ייחודיות המנהל:   ##
 המערכת מזהה את המנהל האחרון ולא מאפשרת לו לשנות את תפקידו למשתמש רגיל, כדי למנוע מצב של מערכת ללא מנהל.

#  אבטחה:   ##
 כל הנתיבים הרגישים (כמו ניהול משתמשים) מוגנים ע"י Middleware המוודא את תקינות ה-JWT והרשאות ה-Admin.