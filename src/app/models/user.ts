import mongoose from '../../database';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    senha: {
        type: String,
        require: true,
        select: false
        
    },

    favoritos: {
        type: Array
    },

    createdAt:{
        type: Date,
        default: Date.now,
    }

});

UserSchema.pre("save", async function(next){
    if (!this.senha) {
        return next();
      }
    
    try {
        const hash = await bcrypt.hash(this.senha!, 10);
        this.senha = hash;
        next();
    } catch (err) {
        next(err as any);
    }
});

const User = mongoose.model('User', UserSchema);

export default User;