import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { read } from 'fs';

// Create a MySQL connection pool
const db = await mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',       // Use your Laragon MySQL password if any
  database: 'sernan',
  port: 3306,
});


// add
export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      instrument,
      experience,
      certifications,
      students,
      available,
      dateJoined,
    } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    await db.execute(
      `INSERT INTO instructors 
        (name, email, instrument, experience, certifications, students, available, dateJoined) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        instrument,
        parseInt(experience),
        certifications,
        parseInt(students),
        !!available,
        dateJoined,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// read
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM instructors ORDER BY id DESC');
    return NextResponse.json({ success: true, instructors: rows });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
