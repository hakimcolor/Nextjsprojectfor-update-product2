const bcrypt = require('bcryptjs');

// Mock database for users
const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
  },
];

let nextUserId = 3;

module.exports = {
  getAllUsers: () =>
    users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }),
  getUserById: (id) => {
    const user = users.find((user) => user.id === parseInt(id));
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  getUserByEmail: (email) => users.find((user) => user.email === email),
  addUser: (userData) => {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const newUser = {
      id: nextUserId++,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  updateUser: (id, updateData) => {
    const index = users.findIndex((user) => user.id === parseInt(id));
    if (index === -1) return null;

    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }

    users[index] = {
      ...users[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Return user without password
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  },
  deleteUser: (id) => {
    const index = users.findIndex((user) => user.id === parseInt(id));
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  },
  getUsersCount: () => users.length,
  validatePassword: (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },
};
