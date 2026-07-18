import bcrypt from "bcryptjs";

export class ZonasService {
    static generateCode(): string {
        const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        for (let i = digits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [digits[i], digits[j]] = [digits[j], digits[i]];
        }

        return `Z-${digits.slice(0, 4).join('')}`;
    }

    static async crypt(data: string): Promise<string> {
        return await bcrypt.hash(data, 6);
    }
}