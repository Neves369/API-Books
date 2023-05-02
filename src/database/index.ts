import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.DATABASE_URL || "DEFAULT_VALUE";
const options: any = { useNewUrlParser: true, useUnifiedTopology: true };

try {
     mongoose.connect(url, options);

  } catch (e) {
    console.log(e);
  }

mongoose.Promise = global.Promise;

export default mongoose;