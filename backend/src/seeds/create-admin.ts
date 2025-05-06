import { AppDataSource } from '../data-source';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function createAdmin() {
  await AppDataSource.initialize();
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPass = process.env.ADMIN_PASSWORD

  const userRepository = AppDataSource.getRepository(User);
  const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

  if (existingAdmin) {
    console.log('👤 Admin already exists, skipping creation.');
    return;
  }

  const admin = userRepository.create({
    email: adminEmail,
    password: await bcrypt.hash(adminPass, 10),
    roles: ['ADMIN', 'MANAGER'], // или isAdmin: true — в зависимости от твоей схемы
  });

  await userRepository.save(admin);
  console.log('✅ Superadmin created: admin@example.com / supersecurepassword');

  await AppDataSource.destroy();
}

createAdmin().catch((err) => {
  console.error('❌ Failed to create admin', err);
});
