/**
 * One-time backfill: stamp the denormalized `slug` field onto existing brand
 * documents so the brand detail page resolves with a single-document query
 * (see src/hooks/useBrand.js — the legacy scan fallback can be removed once
 * every document has a slug).
 *
 * Usage:
 *   1. npm i firebase-admin --no-save --legacy-peer-deps   (not a app dependency)
 *   2. Download a service-account key from Firebase Console
 *      (Project settings → Service accounts → Generate new private key)
 *   3. Dry run (default, writes nothing):
 *        GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/backfill-brand-slugs.mjs
 *   4. Apply:
 *        GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json node scripts/backfill-brand-slugs.mjs --apply
 */

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Must match generateBrandSlug in src/utils/brandUtils.js
const generateBrandSlug = (brandName) => {
  if (!brandName) return "";
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const apply = process.argv.includes("--apply");

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const snapshot = await db.collection("brands").get();
console.log(`Scanning ${snapshot.size} brand documents (${apply ? "APPLY" : "dry run"})…`);

let updated = 0;
let skipped = 0;
let missingName = 0;
const seenSlugs = new Map();

const batchSize = 400; // Firestore batch limit is 500
let batch = db.batch();
let pendingInBatch = 0;

for (const doc of snapshot.docs) {
  const data = doc.data();
  const slug = generateBrandSlug(data.brandName);

  if (!slug) {
    missingName += 1;
    console.warn(`  ! ${doc.id}: no brandName, skipping`);
    continue;
  }

  // Flag duplicate slugs — two brands with the same name would collide.
  if (seenSlugs.has(slug)) {
    console.warn(`  ! Duplicate slug "${slug}": ${seenSlugs.get(slug)} and ${doc.id}`);
  }
  seenSlugs.set(slug, doc.id);

  if (data.slug === slug) {
    skipped += 1;
    continue;
  }

  updated += 1;
  console.log(`  ${apply ? "✓" : "→"} ${doc.id}: "${data.brandName}" → slug "${slug}"`);

  if (apply) {
    batch.update(doc.ref, { slug });
    pendingInBatch += 1;
    if (pendingInBatch >= batchSize) {
      await batch.commit();
      batch = db.batch();
      pendingInBatch = 0;
    }
  }
}

if (apply && pendingInBatch > 0) {
  await batch.commit();
}

console.log(
  `\nDone. ${updated} ${apply ? "updated" : "would be updated"}, ${skipped} already correct, ${missingName} missing brandName.`
);
if (!apply && updated > 0) {
  console.log("Re-run with --apply to write the changes.");
}
