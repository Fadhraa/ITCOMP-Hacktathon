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
      .select(`
        *,
        sensor_nodes!correlated_sensor_id ( location_name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/reports] Supabase error:', error.message, error.details);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', data: data ?? [] });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// Helper: Calculate Haversine distance in KM
function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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

    // --- ALGORITMA CORRELATION ENGINE ---
    let computedScore = 45;
    let computedPriority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    let matchedSensorId: string | null = null;

    // Fetch active sensor nodes & latest telemetry logs
    const { data: nodes } = await supabase
      .from('sensor_nodes')
      .select(`
        id, latitude, longitude, is_active,
        sensor_telemetry_logs ( status, recorded_at )
      `)
      .eq('is_active', true);

    if (nodes && nodes.length > 0) {
      let maxNodeScore = 0;
      let bestSensorId: string | null = null;

      for (const node of nodes) {
        const telemetry = node.sensor_telemetry_logs?.[0];
        const status = telemetry?.status ?? 'SAFE';

        // 1. Distance Score (60% weight)
        let distanceScore = 70; // default if user coordinates missing
        if (latitude != null && longitude != null && node.latitude != null && node.longitude != null) {
          const distKm = getHaversineDistanceKm(
            Number(latitude),
            Number(longitude),
            Number(node.latitude),
            Number(node.longitude)
          );

          if (distKm <= 1.5) distanceScore = 95;
          else if (distKm <= 4.0) distanceScore = 80;
          else if (distKm <= 10.0) distanceScore = 60;
          else if (distKm <= 20.0) distanceScore = 40;
          else distanceScore = 20;
        }

        // 2. Telemetry Anomaly Score (40% weight)
        let telemetryScore = 30;
        if (status === 'DANGER') telemetryScore = 100;
        else if (status === 'WARNING') telemetryScore = 75;
        else if (status === 'SAFE') telemetryScore = 35;

        // Composite Score
        const compositeScore = distanceScore * 0.6 + telemetryScore * 0.4;

        if (compositeScore > maxNodeScore) {
          maxNodeScore = compositeScore;
          bestSensorId = node.id;
        }
      }

      if (bestSensorId) {
        matchedSensorId = bestSensorId;
        computedScore = Math.min(99, Math.round(maxNodeScore));
      }
    }

    // Determine priority from correlation score
    if (computedScore >= 78) {
      computedPriority = 'HIGH';
    } else if (computedScore >= 50) {
      computedPriority = 'MEDIUM';
    } else {
      computedPriority = 'LOW';
    }

    console.log(`[CorrelationEngine] Calculated Score: ${computedScore}%, Priority: ${computedPriority}, CorrelatedSensor: ${matchedSensorId}`);

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
        priority: computedPriority,
        correlation_score: computedScore,
        correlated_sensor_id: matchedSensorId,
      })
      .select('id, ticket_code, status, priority, correlation_score, created_at')
      .single();

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

