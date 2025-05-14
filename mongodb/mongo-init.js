db.createCollection('users');

db.users.insertMany([
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2b$10$DrR3pxnUJmppl8t7oQYnj.NZ8bBs3YN1onmvvSpamb3fsjcxITp9K', // hashed 'password123'
    role: 'admin',
    createdAt: new Date(),
    isActive: true,
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: '$2b$10$DrR3pxnUJmppl8t7oQYnj.NZ8bBs3YN1onmvvSpamb3fsjcxITp9K', // hashed 'password123'
    role: 'user',
    createdAt: new Date(),
    isActive: true,
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '$2b$10$DrR3pxnUJmppl8t7oQYnj.NZ8bBs3YN1onmvvSpamb3fsjcxITp9K',
    role: 'user',
    createdAt: new Date(),
    isActive: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: '$2b$10$DrR3pxnUJmppl8t7oQYnj.NZ8bBs3YN1onmvvSpamb3fsjcxITp9K',
    role: 'user',
    createdAt: new Date(),
    isActive: true,
  },
  {
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: '$2b$10$DrR3pxnUJmppl8t7oQYnj.NZ8bBs3YN1onmvvSpamb3fsjcxITp9K',
    role: 'admin',
    createdAt: new Date(),
    isActive: true,
  },
]);
