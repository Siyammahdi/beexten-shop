import { readFileSync } from "node:fs";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { neon } from "@neondatabase/serverless";
import { categories, detailedDescriptionFor, products } from "./seed-data.mjs";

setDefaultAutoSelectFamilyAttemptTimeout(1000);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
for (const statement of schema.split(";").map((s) => s.trim()).filter(Boolean)) {
  await sql.query(statement);
}
console.log("Schema ready.");

const migrations = ["migrate-bdt-and-details.sql", "migrate-invoice.sql"];
for (const file of migrations) {
  const migration = readFileSync(new URL(`../db/${file}`, import.meta.url), "utf8");
  for (const statement of migration.split(";").map((s) => s.trim()).filter(Boolean)) {
    await sql.query(statement);
  }
}
console.log("Migrations applied.");

const [{ count }] = await sql`select count(*)::int as count from products`;
if (count > 0) {
  console.log(`Skipping seed: ${count} products already exist.`);
  process.exit(0);
}

const lowStock = { "classic-leather-jacket": 3, "velvet-lounge-sofa": 2, "instant-film-camera": 0 };

await sql.transaction([
  ...categories.map(
    (c, i) => sql`
      insert into categories (slug, name, tagline, image, position)
      values (${c.slug}, ${c.name}, ${c.tagline}, ${c.image}, ${i})`,
  ),
  ...products.map(
    (p) => sql`
      insert into products
        (slug, name, category_slug, price, stock, image, description, detailed_description, highlights, featured)
      values
        (${p.slug}, ${p.name}, ${p.category}, ${p.price}, ${lowStock[p.slug] ?? 25},
         ${p.image}, ${p.description}, ${detailedDescriptionFor(p)}, ${p.highlights}, ${p.featured ?? false})`,
  ),
]);

console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
