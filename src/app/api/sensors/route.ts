import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { SensorNode } from '@/types/database';

export const dynamic = 'force-dynamic';

const fallbackSensors: SensorNode[] = [
  {
    id: 'node-01',
    sensor_code: 'NODE-A04',
    location_name: 'Muara Tambak Delta Timur',
    latitude: -7.1245,
    longitude: 112.7891,
    is_active: true,
    created_at: new Date().toISOString(),
    latest_telemetry: {
      id: 'tel-01',
      sensor_id: 'node-01',
      ph_level: 5.4,
      water_level_cm: 138.0,
      salinity_ppt: 22.5,
      status: 'WARNING',
      action_directive: 'Tindakan Segera: Tutup pintu air primer tambak! Terdeteksi anomali keasaman air laut mendekati batas toleransi benur.',
      recorded_at: new Date().toISOString(),
    }
  },
  {
    id: 'node-02',
    sensor_code: 'NODE-B01',
    location_name: 'Estuari Pesisir Sektor Tengah',
    latitude: -7.1180,
    longitude: 112.7950,
    is_active: true,
    created_at: new Date().toISOString(),
    latest_telemetry: {
      id: 'tel-02',
      sensor_id: 'node-02',
      ph_level: 7.4,
      water_level_cm: 85.0,
      salinity_ppt: 24.0,
      status: 'SAFE',
      action_directive: 'Kondisi air normal. Pintu air aman dibuka sesuai jadwal pasang surut.',
      recorded_at: new Date().toISOString(),
    }
  },
  {
    id: 'node-03',
    sensor_code: 'NODE-C02',
    location_name: 'Kanal Outfall Industri Barat',
    latitude: -7.1310,
    longitude: 112.7810,
    is_active: true,
    created_at: new Date().toISOString(),
    latest_telemetry: {
      id: 'tel-03',
      sensor_id: 'node-03',
      ph_level: 6.8,
      water_level_cm: 95.0,
      salinity_ppt: 23.0,
      status: 'SAFE',
      action_directive: 'Parameter dalam batas ambang toleransi lingkungan.',
      recorded_at: new Date().toISOString(),
    }
  }
];

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data: nodes, error } = await supabase
        .from('sensor_nodes')
        .select(`
          id, sensor_code, location_name, latitude, longitude, is_active, created_at,
          sensor_telemetry_logs (
            id, sensor_id, ph_level, water_level_cm, salinity_ppt, status, action_directive, recorded_at
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && nodes && nodes.length > 0) {
        const formatted: SensorNode[] = nodes.map((node: any) => ({
          id: node.id,
          sensor_code: node.sensor_code,
          location_name: node.location_name,
          latitude: node.latitude,
          longitude: node.longitude,
          is_active: node.is_active,
          created_at: node.created_at,
          latest_telemetry: node.sensor_telemetry_logs?.[0] || undefined
        }));
        return NextResponse.json({ status: 'success', data: formatted });
      }
    }

    return NextResponse.json({ status: 'success', data: fallbackSensors, source: 'offline_mock' });
  } catch (err: any) {
    return NextResponse.json({ status: 'success', data: fallbackSensors, error: err.message });
  }
}
