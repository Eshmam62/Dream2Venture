const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const ideas = await prisma.idea.findMany();
  console.log(ideas.map(i => ({id: i.id, deck: i.deckUrl})));
}
main().catch(console.error).finally(() => prisma.$disconnect());
