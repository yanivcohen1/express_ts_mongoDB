import { connectDatabase, disconnectDatabase, orm } from './src/config/database';
import { User } from './src/models/User';
import { hashPassword } from './src/lib/password';
import { env } from './src/config/env';

async function createUsers() {
  await connectDatabase();
  const em = orm.em.fork();

  const users = env.credentials;

  for (const userData of users) {
    try {
      const existingUser = await em.findOne(User, { username: userData.username });
      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping.`);
        continue;
      }

      const hashedPassword = await hashPassword(userData.password);
      const user = em.create(User, { ...userData, password: hashedPassword });
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