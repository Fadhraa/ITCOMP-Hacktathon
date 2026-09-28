import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { status: 'error', message: 'Supabase belum dikonfigurasi.' },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'ID laporan wajib disertakan.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, officer_notes, priority } = body;

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    } else {
      // Default set to INVESTIGATING if status not explicitly specified
      updateData.status = 'INVESTIGATING';
    }

    if (officer_notes !== undefined) {
      updateData.officer_notes = officer_notes;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    console.log(`[PATCH /api/reports/${id}] Updating:`, updateData);

    const { data, error } = await supabase
      .from('incident_reports')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`[PATCH /api/reports/${id}] DB Error:`, error);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    console.error(`[PATCH /api/reports Exception]:`, err);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
