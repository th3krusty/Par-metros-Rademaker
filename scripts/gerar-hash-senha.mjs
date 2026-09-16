// Gera o hash SHA-256 de uma senha para usar na tabela `admin_config`.
// Uso: node scripts/gerar-hash-senha.mjs "minhaSenhaNova"
import { createHash } from "node:crypto";

const senha = process.argv[2];
if (!senha) {
  console.error('Uso: node scripts/gerar-hash-senha.mjs "minhaSenhaNova"');
  process.exit(1);
}

const hash = createHash("sha256").update(senha).digest("hex");
console.log("\nHash gerado:\n");
console.log(hash);
console.log("\nRode no SQL Editor do Supabase:\n");
console.log(`update admin_config set password_hash = '${hash}' where id = 1;\n`);
