/**
 * One-off script: regenerate UIDs for scouts so the birthday is encoded as
 * MMDDYY in its own block, with a 2-digit random suffix for uniqueness.
 *
 * New UID format: BSP-{regYear}-{MM}{DD}{YY}-{2 random digits}
 * Example: birthday 1995-04-24 -> BSP-2026-042495-87
 *
 * Usage:
 *   node regenerate_legacy_uids.js          # dry run, prints what would change
 *   node regenerate_legacy_uids.js --apply  # actually update the rows
 *
 * Requires SUPABASE_URL and a service-role key (SUPABASE_SERVICE_ROLE_KEY)
 * in .env. The anon key cannot bypass RLS so updates would silently fail.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Minimal .env loader so we don't need the `dotenv` package.
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        let value = line.slice(eq + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = value;
    }
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_ANON_KEY; // fallback (only works if RLS allows)

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or service key in environment.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
});

const APPLY = process.argv.includes('--apply');

function pad2(n) {
    return n.toString().padStart(2, '0');
}

function randomDigits(length) {
    let out = '';
    for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10);
    return out;
}

function buildUid(dob) {
    const regYear = new Date().getFullYear();
    const rand = randomDigits(2);
    const mm = pad2(dob.getMonth() + 1);
    const dd = pad2(dob.getDate());
    const yy = pad2(dob.getFullYear() % 100);
    return `BSP-${regYear}-${mm}${dd}${yy}-${rand}`;
}

/**
 * Returns true if the UID already follows the canonical
 * BSP-YYYY-MMDDYY-NN format for the given birth date.
 */
function uidEncodesBirthdate(uid, dob) {
    if (!uid) return false;
    const m = uid.match(/^BSP-\d{4}-(\d{6})-(\d{2})$/);
    if (!m) return false;
    const mm = pad2(dob.getMonth() + 1);
    const dd = pad2(dob.getDate());
    const yy = pad2(dob.getFullYear() % 100);
    return m[1] === `${mm}${dd}${yy}`;
}

async function main() {
    console.log(`Mode: ${APPLY ? 'APPLY (updates will be written)' : 'DRY RUN'}`);

    const { data: scouts, error } = await supabase
        .from('scouts')
        .select('id, name, uid, date_of_birth')
        .not('date_of_birth', 'is', null);

    if (error) {
        console.error('Failed to fetch scouts:', error.message);
        process.exit(1);
    }

    console.log(`Fetched ${scouts.length} scouts with a date_of_birth.`);

    const toUpdate = [];
    for (const s of scouts) {
        const dob = new Date(s.date_of_birth);
        if (isNaN(dob.getTime())) continue;
        if (uidEncodesBirthdate(s.uid, dob)) continue;
        const newUid = buildUid(dob);
        toUpdate.push({ id: s.id, name: s.name, oldUid: s.uid, newUid });
    }

    console.log(`${toUpdate.length} scouts need UID regeneration.`);
    for (const r of toUpdate) {
        console.log(`  ${r.name}: ${r.oldUid}  ->  ${r.newUid}`);
    }

    if (!APPLY) {
        console.log('\nDry run complete. Re-run with --apply to write changes.');
        return;
    }

    let ok = 0;
    let fail = 0;
    for (const r of toUpdate) {
        const { error: upErr } = await supabase
            .from('scouts')
            .update({ uid: r.newUid })
            .eq('id', r.id);
        if (upErr) {
            console.error(`  FAIL ${r.name} (${r.id}): ${upErr.message}`);
            fail++;
        } else {
            ok++;
        }
    }
    console.log(`\nDone. Updated: ${ok}, Failed: ${fail}.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
