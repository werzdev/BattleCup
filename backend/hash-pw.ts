import * as bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  const saltRounds = 10; // Adjust as needed for security
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(`Hashed password: ${hashedPassword}`);
};

// Call with your desired password
hashPassword('PASSWORD');
