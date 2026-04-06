import bcrypt from "bcryptjs";

const password = "Stgeorge@$123";
const hashedPassword = await bcrypt.hash(password, 12);

console.log(hashedPassword);


