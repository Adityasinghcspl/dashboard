const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of salt rounds

async function hashPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }
  
  async function comparePasswords(plainPassword, hashedPassword) {
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      return match;
    } catch (error) {
      throw new Error('Password comparison failed');
    }
  }

module.exports = { hashPassword, comparePasswords };
