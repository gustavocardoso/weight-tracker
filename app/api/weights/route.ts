import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const stmt = db.prepare(`
      SELECT id, date, weight, notes, created_at
      FROM weights
      WHERE user_id = ?
      ORDER BY date DESC
    `);
    const weights = stmt.all(user.id);

    return NextResponse.json({ weights });
  } catch (error) {
    console.error('Get weights error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pesos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { date, weight, notes } = await request.json();

    if (!date || !weight) {
      return NextResponse.json(
        { error: 'Data e peso são obrigatórios' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO weights (user_id, date, weight, notes)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, date) DO UPDATE SET
        weight = excluded.weight,
        notes = excluded.notes
    `);

    const result = stmt.run(user.id, date, weight, notes || null);

    return NextResponse.json({
      id: result.lastInsertRowid,
      date,
      weight,
      notes,
    });
  } catch (error) {
    console.error('Add weight error:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar peso' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      );
    }

    const stmt = db.prepare('DELETE FROM weights WHERE id = ? AND user_id = ?');
    stmt.run(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete weight error:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar peso' },
      { status: 500 }
    );
  }
}
