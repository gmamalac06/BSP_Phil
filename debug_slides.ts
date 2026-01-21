
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://euttajmsagfksgmoiciz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dHRham1zYWdma3NnbW9pY2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTQ0NjcsImV4cCI6MjA4MDczMDQ2N30.7-oi9Y-G7KOAFTZx8_bPblN7zcFeTmATwa-OYNi4NuU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log("Fetching carousel slides...");
    const { data, error } = await supabase.from("carousel_slides").select("*");

    if (error) {
        console.error("Error fetching slides:", error);
        return;
    }

    if (data) {
        console.log(`Found ${data.length} slides.`);
        data.forEach((slide) => {
            console.log(`\nSlide ID: ${slide.id}`);
            console.log(`Title: ${slide.title}`);
            console.log(`Image URL: ${slide.image_url}`);

            // Basic check if URL looks right
            if (slide.image_url.includes("carousel-slides/carousel-slides")) {
                console.warn("⚠️ WARNING: URL contains double 'carousel-slides' path!");
            }
        });
    }
}

main();
