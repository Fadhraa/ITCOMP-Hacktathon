export type SensorStatus = 'SAFE' | 'WARNING' | 'DANGER';
export type IncidentStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED';
export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SensorNode {
  id: string;
  sensor_code: string;
  location_name: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: string;
  latest_telemetry?: SensorTelemetry;
}

export interface SensorTelemetry {
  id: string;
  sensor_id: string;
  ph_level: number;
  water_level_cm: number;
  salinity_ppt: number;
  status: SensorStatus;
  action_directive: string;
  recorded_at: string;
}

export interface IncidentReport {
  id: string;
  ticket_code: string;
  reporter_phone: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  priority: IncidentPriority;
  correlation_score: number;
  correlated_sensor_id?: string | null;
  officer_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlertSubscription {
  id: string;
  phone_number?: string | null;
  push_token?: string | null;
  coastal_sector: string;
  is_active: boolean;
  created_at: string;
}

export interface SimulationTriggerPayload {
  scenario: 'ACID_SPILL_ROB' | 'HIGH_TIDE_ROB' | 'NORMAL_RESET';
  sensor_code?: string;
  ph_override?: number;
  water_level_override?: number;
}
