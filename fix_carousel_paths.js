
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://euttajmsagfksgmoiciz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dHRham1zYWdma3NnbW9pY2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTQ0NjcsImV4cCI6MjA4MDczMDQ2N30.7-oi9Y-G7KOAFTZx8_bPblN7zcFeTmATwa-OYNi4NuU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log("--- FIXING CAROUSEL PATHS ---");

    // 1. Get all slides
    const { data: slides, error: fetchError } = await supabase
        .from("carousel_slides")
        .select("*");

    if (fetchError) {
        console.error("Error fetching slides:", fetchError);
        return;
    }

    console.log(`Found ${slides.length} slides. Checking for double paths...`);

    let fixCount = 0;

    for (const slide of slides) {
        // Check for the double path pattern
        // Pattern: .../carousel-slides/carousel-slides/...
        if (slide.image_url && slide.image_url.includes("/carousel-slides/carousel-slides/")) {

            const newUrl = slide.image_url.replace("/carousel-slides/carousel-slides/", "/carousel-slides/");

            console.log(`\nFixing Slide ID: ${slide.id}`);
            console.log(` - Old: ${slide.image_url}`);
            console.log(` - New: ${newUrl}`);

            const { error: updateError } = await supabase
                .from("carousel_slides")
                .update({ image_url: newUrl })
                .eq("id", slide.id);

            if (updateError) {
                console.error(`Failed to update slide ${slide.id}:`, updateError);
            } else {
                console.log(" - Success!");
                fixCount++;
            }
        }
    }

    console.log(`\nFinished. Fixed ${fixCount} slides.`);
}

main();
