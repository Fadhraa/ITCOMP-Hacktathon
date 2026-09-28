import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { status: 'error', message: 'Supabase belum dikonfigurasi.' },
      { status: 503 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', data: data ?? [] });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { status: 'error', message: 'Supabase belum dikonfigurasi.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { reporter_phone, description, image_url, latitude, longitude } = body;

    if (!reporter_phone || !description) {
      return NextResponse.json(
        { status: 'error', message: 'Nomor kontak dan deskripsi wajib diisi.' },
        { status: 400 }
      );
    }

    // Generate ticket code: TK-YYYY-MMDD-XXXX
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticket_code = `TK-${datePart}-${randomSuffix}`;

    const { data, error } = await supabase
      .from('incident_reports')
      .insert({
        ticket_code,
        reporter_phone,
        description,
        image_url: image_url ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        status: 'PENDING',
        priority: 'MEDIUM',
        correlation_score: 0,
      })
      .select('id, ticket_code, status, created_at')
      .single();

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
