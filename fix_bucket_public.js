
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://euttajmsagfksgmoiciz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dHRham1zYWdma3NnbW9pY2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTQ0NjcsImV4cCI6MjA4MDczMDQ2N30.7-oi9Y-G7KOAFTZx8_bPblN7zcFeTmATwa-OYNi4NuU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log("--- FIXING BUCKET PRIVACY ---");

    // 1. UPDATE BUCKET TO PUBLIC
    console.log("Updating 'carousel-slides' bucket to PUBLIC...");
    const { data: bucket, error: bucketError } = await supabase
        .storage
        .updateBucket('carousel-slides', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
            fileSizeLimit: 5242880
        });

    if (bucketError) {
        console.error("Error updating bucket:", bucketError);
    } else {
        console.log("Bucket updated successfully:", bucket);
    }

    // 2. VERIFY FILE EXISTS
    const fileName = "carousel-1768745376196.jpg";
    console.log(`\nVerifying file '${fileName}' exists...`);

    const { data: files } = await supabase.storage.from('carousel-slides').list();
    const fileExists = files?.find(f => f.name === fileName);

    if (fileExists) {
        console.log("✅ File FOUND in bucket root.");
        // Generate a fresh public URL
        const { data: publicUrlData } = supabase.storage.from('carousel-slides').getPublicUrl(fileName);
        console.log("Generated Public URL:", publicUrlData.publicUrl);
    } else {
        console.error("❌ File NOT FOUND in bucket root.");
    }
}

main();
