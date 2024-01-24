import bcrypt from "bcrypt";
const saltRounds: number = 10;

async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Password hashing failed');
    }
}

async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}

export { hashPassword, comparePasswords };

