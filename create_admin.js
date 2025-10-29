const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Crear o actualizar usuario admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@son1kvers3.com' },
      update: { isAdmin: true, tier: 'ENTERPRISE' },
      create: {
        email: 'admin@son1kvers3.com',
        username: 'admin',
        tier: 'ENTERPRISE',
        isAdmin: true,
        userTier: {
          create: {
            tier: 'ENTERPRISE',
            monthlyGenerations: 9999,
            dailyGenerations: 999,
            maxDuration: 600,
            quality: 'premium',
            features: 'all'
          }
        }
      }
    });

    console.log('✅ Usuario admin creado:', admin);
    console.log('Email: admin@son1kvers3.com');
    console.log('Usuario puede resetear la contraseña en Supabase');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
