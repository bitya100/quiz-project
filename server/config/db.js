const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // כאן הוא מושך את הכתובת מהקובץ .env
    await mongoose.connect(process.env.MONGO_URI); 
    console.log("✅ מחובר למונגו בהצלחה!");
  } catch (err) {
    console.error("❌ שגיאה בחיבור למונגו:", err.message);
    process.exit(1); // עוצר את התהליך אם אין חיבור
  }
};

module.exports = connectDB;