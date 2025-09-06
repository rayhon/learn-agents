import 'dotenv/config';

// Pass the file you want to run as argument
const file = process.argv[2];

if (!file) {
  console.error("❌ Please provide a file to run: npm run ts samples/hello.ts");
  process.exit(1);
}

// Dynamically import the file
import(`./${file}`).catch(err => {
  console.error("Error running file:", err);
});