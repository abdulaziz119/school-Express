import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export class AuthorizationService {
  async sign(user: any,): Promise<string> {
    const data = {
      email: user.email,
      phone: user.pthone
    };
    return jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
  }
}