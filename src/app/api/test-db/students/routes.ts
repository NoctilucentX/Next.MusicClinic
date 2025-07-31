import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const db = await mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'sernan',
  port: 3306,
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, instrument, instructor, dateEnrolled } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    await db.execute(
      'INSERT INTO students (name, email, instrument, instructor, dateEnrolled) VALUES (?, ?, ?, ?, ?)',
      [name, email, instrument, instructor, dateEnrolled]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
