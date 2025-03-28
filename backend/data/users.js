import bcrypt from "bcryptjs";

const users = [
  {
    name: "Caleb Selormey",
    email: "admin@email.com",
    password: bcrypt.hashSync("testuser123", 10),
    isAdmin: true,
  },
  {
    name: "Ama Martha",
    email: "myadmin@email.com",
    password: bcrypt.hashSync("testuser123", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@email.com",
    password: bcrypt.hashSync("testuser123", 10),
  },
  {
    name: "Jane Doe",
    email: "jane@email.com",
    password: bcrypt.hashSync("testuser123", 10),
  },
  {
    name: "James Brown",
    email: "jbrown@email.com",
    password: bcrypt.hashSync("testuser123", 10),
  },
];

export default users;
