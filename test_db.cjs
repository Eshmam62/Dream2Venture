const { Client } = require('pg');

async function testConnection(url) {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log(`Successfully connected to: ${url}`);
    await client.end();
  } catch (err) {
    console.error(`Failed to connect to ${url}:`, err.message);
  }
}

async function run() {
  await testConnection("postgresql://postgres.dvdzpcrgrtocmbvgecmr:D2V-database%400162@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres");
  await testConnection("postgresql://postgres.dvdzpcrgrtocmbvgecmr:D2V-database%400162@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres");
}

run();
