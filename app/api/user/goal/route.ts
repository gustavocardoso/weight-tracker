import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = db.prepare('SELECT goal_weight FROM users WHERE id = ?').get(session.id) as { goal_weight: number | null };

    return NextResponse.json({ goalWeight: user.goal_weight });
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { goalWeight } = await request.json();

    if (goalWeight !== null && (typeof goalWeight !== 'number' || goalWeight <= 0)) {
      return NextResponse.json({ error: 'Invalid goal weight' }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE users SET goal_weight = ? WHERE id = ?');
    stmt.run(goalWeight, session.id);

    return NextResponse.json({ success: true, goalWeight });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}
