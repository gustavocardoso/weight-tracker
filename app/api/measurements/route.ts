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
      SELECT id, date, chest, waist, hips, thigh, arm, notes, created_at
      FROM measurements
      WHERE user_id = ?
      ORDER BY date DESC
    `);
    const measurements = stmt.all(user.id);

    return NextResponse.json({ measurements });
  } catch (error) {
    console.error('Get measurements error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar medidas' },
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

    const { date, chest, waist, hips, thigh, arm, notes } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: 'Data é obrigatória' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO measurements (user_id, date, chest, waist, hips, thigh, arm, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, date) DO UPDATE SET
        chest = excluded.chest,
        waist = excluded.waist,
        hips = excluded.hips,
        thigh = excluded.thigh,
        arm = excluded.arm,
        notes = excluded.notes
    `);

    const result = stmt.run(
      user.id,
      date,
      chest || null,
      waist || null,
      hips || null,
      thigh || null,
      arm || null,
      notes || null
    );

    return NextResponse.json({
      id: result.lastInsertRowid,
      date,
      chest,
      waist,
      hips,
      thigh,
      arm,
      notes,
    });
  } catch (error) {
    console.error('Add measurement error:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar medidas' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { id, date, chest, waist, hips, thigh, arm, notes } = await request.json();

    if (!id || !date) {
      return NextResponse.json(
        { error: 'ID e data são obrigatórios' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      UPDATE measurements 
      SET date = ?, chest = ?, waist = ?, hips = ?, thigh = ?, arm = ?, notes = ?
      WHERE id = ? AND user_id = ?
    `);
    
    stmt.run(
      date,
      chest || null,
      waist || null,
      hips || null,
      thigh || null,
      arm || null,
      notes || null,
      id,
      user.id
    );

    return NextResponse.json({
      id,
      date,
      chest,
      waist,
      hips,
      thigh,
      arm,
      notes,
    });
  } catch (error) {
    console.error('Update measurement error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar medidas' },
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

    const stmt = db.prepare('DELETE FROM measurements WHERE id = ? AND user_id = ?');
    stmt.run(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete measurement error:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar medidas' },
      { status: 500 }
    );
  }
}
