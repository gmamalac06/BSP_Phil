
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://euttajmsagfksgmoiciz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dHRham1zYWdma3NnbW9pY2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTQ0NjcsImV4cCI6MjA4MDczMDQ2N30.7-oi9Y-G7KOAFTZx8_bPblN7zcFeTmATwa-OYNi4NuU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log("--- FINAL STORAGE CHECK ---");

    // 1. Check carousel-slides (target: files at root, no 'carousel-slides' folder)
    console.log("\n[carousel-slides] Checking root:");
    const { data: carouselFiles } = await supabase.storage.from("carousel-slides").list();

    if (carouselFiles) {
        const rootFiles = carouselFiles.filter(f => f.name !== ".emptyFolderPlaceholder" && !f.id /* folders don't have id in some responses, or metadata is different */);
        // Actually list returns folders as well.
        carouselFiles.forEach(f => {
            if (!f.id) console.log(` - (Folder) ${f.name}`);
            else console.log(` - (File)   ${f.name} [${(f.metadata?.size / 1024).toFixed(1)} KB]`);
        });
    }

    // 2. Check activity-photos (checking for misplaced 'carousel' folder)
    console.log("\n[activity-photos] Checking root:");
    const { data: activityFiles } = await supabase.storage.from("activity-photos").list();
    if (activityFiles) {
        activityFiles.forEach(f => {
            if (!f.id) console.log(` - (Folder) ${f.name}`);
            else console.log(` - (File)   ${f.name}`);
        });
    }
}

main();
