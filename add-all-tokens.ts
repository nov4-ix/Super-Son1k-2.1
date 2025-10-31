import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Añadiendo tokens desde SUNO_TOKENS...');

    const sunoTokens = process.env.SUNO_TOKENS;

    if (!sunoTokens) {
      console.error('❌ SUNO_TOKENS no encontrado en el .env');
      return;
    }

    const tokens = sunoTokens.split(',');

    console.log(`Encontrados ${tokens.length} tokens`);

    // Limpiar tokens existentes
    console.log('Limpiando tokens existentes...');
    await prisma.token.deleteMany({});

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();

      if (!token) continue;

      const tokenRecord = await prisma.token.create({
        data: {
          hash: `sunov2-token-${i + 1}`,
          email: `user${i + 1}@example.com`,
          isActive: true,
          isValid: true, // Los marcamos como válidos sin validar
          usageCount: 0,
          rateLimit: 10,
          tier: 'FREE',
          encryptedToken: Buffer.from(token).toString('base64'),
          metadata: JSON.stringify({
            source: 'env_SUNO_TOKENS',
            addedAt: new Date().toISOString(),
            index: i + 1
          })
        }
      });

      console.log(`✅ Token ${i + 1} añadido: ${tokenRecord.id}`);
    }

    console.log(`\n🎉 ¡Todos los tokens añadidos exitosamente!`);
    console.log(`📊 Total: ${tokens.length} tokens`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
