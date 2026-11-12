// Cria um usuário admin no banco. Roda uma vez por pessoa, no terminal do container (Dokploy) ou local:
//   npm run create-admin -- email@empresa.com.br
//   npm run create-admin -- admin@local.test --password 12345678
// Sem --password, gera uma senha temporária e mostra na tela. Em produção (NODE_ENV=production) o
// usuário troca a senha no primeiro acesso. Não mexe em usuário que já existe.
// Em JavaScript puro porque a imagem de produção não tem tsx nem as devDependencies.
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

try {
  process.loadEnvFile(".env");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const args = process.argv.slice(2);
const passwordFlag = args.indexOf("--password");
const givenPassword = passwordFlag === -1 ? null : args[passwordFlag + 1];
const email = args
  .find((arg, index) => !arg.startsWith("--") && (passwordFlag === -1 || index !== passwordFlag + 1))
  ?.trim()
  .toLowerCase();

if (!email || !email.includes("@") || (passwordFlag !== -1 && !givenPassword)) {
  console.error("Uso: npm run create-admin -- email@empresa.com.br [--password senha]");
  process.exit(1);
}
if (givenPassword && givenPassword.length < 8) {
  console.error("A senha precisa ter ao menos 8 caracteres.");
  process.exit(1);
}

// Senha temporária: 12 caracteres sem os que se confundem (0/O, 1/l/I).
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const password =
  givenPassword ?? Array.from(randomBytes(12), (byte) => ALPHABET[byte % ALPHABET.length]).join("");

let connectionString = `${process.env.DATABASE_URL}`;
if (process.env.RUNNING_IN_DOCKER === "true") {
  connectionString = connectionString
    .replace("://localhost:", "://db:")
    .replace("://127.0.0.1:", "://db:");
}

const pool = new pg.Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

try {
  if (await prisma.user.findUnique({ where: { email } })) {
    console.error(`Já existe um usuário com o e-mail ${email}. Nada foi alterado.`);
    process.exitCode = 1;
  } else {
    const mustChangePassword = process.env.NODE_ENV === "production";
    await prisma.user.create({
      data: { email, passwordHash: await bcrypt.hash(password, 12), role: "admin", mustChangePassword },
    });
    console.log(`Admin criado: ${email}`);
    if (!givenPassword) console.log(`Senha temporária: ${password}`);
    if (mustChangePassword) console.log("A troca de senha será pedida no primeiro acesso.");
  }
} finally {
  await prisma.$disconnect();
  await pool.end();
}
