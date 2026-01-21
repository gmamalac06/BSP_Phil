
const fetch = require('node-fetch'); // Assuming node environment has fetch or using built-in in Node 18+

async function checkUrl() {
    const url = "https://euttajmsagfksgmoiciz.supabase.co/storage/v1/object/public/carousel-slides/carousel-1768745376196.jpg";
    console.log(`Checking URL: ${url}`);

    try {
        const response = await fetch(url);
        console.log(`Status Code: ${response.status}`);
        console.log(`Status Text: ${response.statusText}`);

        if (response.ok) {
            console.log("SUCCESS: Image is accessible publicly.");
        } else {
            console.log("FAILURE: Image is NOT accessible.");
            // Try to see if there's an error body
            try {
                const text = await response.text();
                console.log("Response Body:", text);
            } catch (e) { }
        }
    } catch (error) {
        console.error("Network Error:", error.message);
    }
}

// Node 18+ has native fetch. If on older node, might fail without polyfill, 
// but let's try assuming modern env or just standard http request if needed.
// actually, I'll use standard https module to be safe across node versions without dependencies.
const https = require('https');

function checkUrlNative() {
    const url = "https://euttajmsagfksgmoiciz.supabase.co/storage/v1/object/public/carousel-slides/carousel-1768745376196.jpg";
    console.log(`Checking URL (Native): ${url}`);

    https.get(url, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Status Message: ${res.statusMessage}`);

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            if (res.statusCode !== 200) {
                console.log("Response Body:", data);
            } else {
                console.log("SUCCESS: Image found (200 OK)");
                console.log("Content-Type:", res.headers['content-type']);
                console.log("Content-Length:", res.headers['content-length']);
            }
        });
    }).on('error', (e) => {
        console.error("Error:", e.message);
    });
}

checkUrlNative();
