import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Limpiando tokens corruptos...');

    const tokens = await prisma.token.findMany();

    for (const token of tokens) {
      console.log(`Eliminando token: ${token.id} - ${token.email}`);
      await prisma.token.delete({
        where: { id: token.id }
      });
    }

    console.log('Todos los tokens corruptos han sido eliminados.');
    console.log('El sistema está listo para añadir tokens válidos.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
