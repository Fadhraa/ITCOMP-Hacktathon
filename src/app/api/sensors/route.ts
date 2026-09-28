import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { SensorNode } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { status: 'error', message: 'Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local' },
      { status: 503 }
    );
  }

  try {
    const { data: nodes, error } = await supabase
      .from('sensor_nodes')
      .select(`
        id, sensor_code, location_name, latitude, longitude, is_active, created_at,
        sensor_telemetry_logs (
          id, sensor_id, ph_level, water_level_cm, salinity_ppt, status, action_directive, recorded_at
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    const formatted: SensorNode[] = (nodes ?? []).map((node: any) => ({
      id: node.id,
      sensor_code: node.sensor_code,
      location_name: node.location_name,
      latitude: node.latitude,
      longitude: node.longitude,
      is_active: node.is_active,
      created_at: node.created_at,
      // Ambil telemetry terbaru (diurutkan descending dari DB)
      latest_telemetry: node.sensor_telemetry_logs?.[0] ?? undefined,
    }));

    return NextResponse.json({ status: 'success', data: formatted });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
