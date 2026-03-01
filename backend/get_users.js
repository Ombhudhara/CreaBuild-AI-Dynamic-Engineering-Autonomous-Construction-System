import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    const db = mongoose.connection.useDb(mongoose.connection.name);
    // User collection is likely 'users'
    const users = await db.collection('users').find({}).toArray();

    console.log("=========================================");
    console.log("       USER IDS FOR ASSIGNMENT           ");
    console.log("=========================================");

    const viewers = users.filter(u => u.role === 'Viewer');
    const engineers = users.filter(u => u.role === 'Engineer');
    const admins = users.filter(u => u.role === 'Admin');

    console.log("\n👀 VIEWERS (You should paste these IDs into the assignment box):");
    if (viewers.length === 0) {
        console.log("  No viewers found in the database. You need to register one!");
    } else {
        viewers.forEach(v => {
            console.log(`  Name: ${v.name}`);
            console.log(`  Email: ${v.email}`);
            console.log(`  >>> ID: ${v._id}`);
            console.log("  -----------------------------");
        });
    }

    console.log("\n⚙️ ENGINEERS (For reference):");
    engineers.forEach(e => console.log(`  ${e.name} (${e.email}) - ID: ${e._id}`));

    console.log("\n👑 ADMINS (For reference):");
    admins.forEach(a => console.log(`  ${a.name} (${a.email}) - ID: ${a._id}`));

    console.log("\n=========================================");
    mongoose.disconnect();
}).catch(err => {
    console.error("Database connection failed", err);
    process.exit(1);
});
