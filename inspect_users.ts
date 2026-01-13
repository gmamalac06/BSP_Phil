
import { db } from "./server/db";
import { users } from "./shared/schema";

async function main() {
    console.log("Fetching all users...");
    const allUsers = await db.select().from(users);
    console.log(`Found ${allUsers.length} users.`);

    allUsers.forEach(u => {
        console.log(`User: ${u.username}, Email: ${u.email}, Role: '${u.role}', isApproved: ${u.isApproved}`);
    });

    process.exit(0);
}

main().catch(console.error);
