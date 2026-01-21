import { connectDatabase, disconnectDatabase, orm } from './src/config/database';
import { User } from './src/models/User';

async function createUsers() {
  await connectDatabase();
  const em = orm.em.fork();

  const users = [
    { username: 'admin@example.com', password: 'Admin123!', role: 'admin' as const },
    { username: 'user@example.com', password: 'User123!', role: 'user' as const }
  ];

  for (const userData of users) {
    try {
      const existingUser = await em.findOne(User, { username: userData.username });
      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping.`);
        continue;
      }

      const user = em.create(User, userData);
      await em.persistAndFlush(user);
      console.log(`Created user: ${userData.username}`);
    } catch (error) {
      console.error(`Error creating user ${userData.username}:`, error);
    }
  }

  await disconnectDatabase();
  console.log('User creation script completed.');
}

createUsers().catch(console.error);