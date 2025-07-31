// app/api/test-db/route.ts
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });

    const [rows] = await connection.execute('SELECT DATABASE() as db');
    return NextResponse.json({ success: true, database: rows[0].db });
  } catch (err) {
    console.error('❌ DB Connection Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
