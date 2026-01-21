
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://euttajmsagfksgmoiciz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dHRham1zYWdma3NnbW9pY2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTQ0NjcsImV4cCI6MjA4MDczMDQ2N30.7-oi9Y-G7KOAFTZx8_bPblN7zcFeTmATwa-OYNi4NuU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log("--- DEBUGGING CAROUSEL ---");

    // 1. List files in Bucket
    console.log("\n1. Listing Storage Bucket ('carousel-slides'):");
    const { data: files, error: storageError } = await supabase
        .storage
        .from("carousel-slides")
        .list(); // List root

    if (storageError) {
        console.error("Storage Error:", storageError);
    } else {
        console.log(`Found ${files.length} files at root:`);
        files.forEach(f => console.log(` - [${f.name}] (Size: ${f.metadata?.size})`));

        // Check subfolder if it exists
        const subfolder = files.find(f => f.name === 'carousel-slides');
        if (subfolder) {
            console.log("\nFound 'carousel-slides' subfolder. Listing contents:");
            const { data: subFiles } = await supabase.storage.from("carousel-slides").list("carousel-slides");
            if (subFiles) subFiles.forEach(f => console.log(` - carousel-slides/[${f.name}]`));
        }
    }

    // 2. List DB Records
    console.log("\n2. Listing DB Records ('carousel_slides'):");
    const { data: slides, error: dbError } = await supabase.from("carousel_slides").select("id, title, image_url");

    if (dbError) {
        console.error("DB Error:", dbError);
    } else {
        slides.forEach(s => {
            const urlObj = new URL(s.image_url);
            const path = urlObj.pathname.split('/carousel-slides/')[1]; // Extract path logic roughly
            console.log(` - ID: ${s.id}`);
            console.log(`   Title: ${s.title}`);
            console.log(`   Full URL: ${s.image_url}`);
            console.log(`   Estimated Path: ${path || 'Unknown'}`);
        });
    }
}

main();
