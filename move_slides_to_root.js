
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://euttajmsagfksgmoiciz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dHRham1zYWdma3NnbW9pY2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTQ0NjcsImV4cCI6MjA4MDczMDQ2N30.7-oi9Y-G7KOAFTZx8_bPblN7zcFeTmATwa-OYNi4NuU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log("--- MOVING SLIDES TO ROOT ---");

    const BUCKET = "carousel-slides";
    const FOLDER = "carousel-slides"; // The subfolder name

    // 1. List files in the subfolder
    const { data: files, error: listError } = await supabase
        .storage
        .from(BUCKET)
        .list(FOLDER);

    if (listError) {
        console.error("Error listing files:", listError);
        return;
    }

    if (!files || files.length === 0) {
        console.log("No files found in 'carousel-slides' subfolder.");
        return;
    }

    console.log(`Found ${files.length} files in '${FOLDER}/' subfolder.`);

    // 2. Move each file to root
    for (const file of files) {
        if (file.name === ".emptyFolderPlaceholder") continue; // Skip placeholder

        const oldPath = `${FOLDER}/${file.name}`;
        const newPath = file.name;

        console.log(`Moving: ${oldPath} -> ${newPath}`);

        const { data, error: moveError } = await supabase
            .storage
            .from(BUCKET)
            .move(oldPath, newPath);

        if (moveError) {
            console.error(`Failed to move ${file.name}:`, moveError.message);
        } else {
            console.log(" - Success!");
        }
    }

    console.log("Done moving files.");
}

main();
