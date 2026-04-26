import jwt from 'jsonwebtoken';
import { env } from '../../env';
import bcrypt from 'bcrypt';

export class AuthService {

    static async generateAccessToken(nombres: string, apellidos: string, email: string) {

        return jwt.sign(
            { nombres, apellidos, email },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
        );
    }

    static async verifyToken(token: string): Promise<boolean> {
        try {
            jwt.verify(token, env.JWT_SECRET);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async compareToPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}