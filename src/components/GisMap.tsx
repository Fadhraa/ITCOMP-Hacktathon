'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SensorNode, IncidentReport } from '@/types/database';

interface GisMapProps {
  sensors: SensorNode[];
  reports: IncidentReport[];
  selectedReportId?: string | null;
  onSelectReport?: (reportId: string) => void;
  showSensors?: boolean;
  showReports?: boolean;
  showRiskZones?: boolean;
}

export default function GisMap({
  sensors,
  reports,
  selectedReportId,
  onSelectReport,
  showSensors = true,
  showReports = true,
  showRiskZones = true,
}: GisMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{
    sensors: L.LayerGroup;
    reports: L.LayerGroup;
    riskZones: L.LayerGroup;
  } | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center around Gresik coastal coordinates by default
    const map = L.map(mapContainerRef.current, {
      center: [-6.95, 112.58],
      zoom: 12,
      zoomControl: true,
    });

    // Clean OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const sensorsGroup = L.layerGroup().addTo(map);
    const reportsGroup = L.layerGroup().addTo(map);
    const riskZonesGroup = L.layerGroup().addTo(map);

    layersGroupRef.current = {
      sensors: sensorsGroup,
      reports: reportsGroup,
      riskZones: riskZonesGroup,
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layersGroupRef.current = null;
    };
  }, []);

  // Update Layers & Markers when data or toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const groups = layersGroupRef.current;
    if (!map || !groups) return;

    // 1. Clear old markers
    groups.sensors.clearLayers();
    groups.reports.clearLayers();
    groups.riskZones.clearLayers();

    const allLatLngs: L.LatLngExpression[] = [];

    // 2. Render Sensors
    if (showSensors) {
      sensors.forEach((s) => {
        if (s.latitude == null || s.longitude == null) return;
        const latLng: [number, number] = [Number(s.latitude), Number(s.longitude)];
        allLatLngs.push(latLng);

        const status = s.latest_telemetry?.status ?? 'SAFE';
        const isDanger = status === 'DANGER';
        const isWarning = status === 'WARNING';

        const colorHex = isDanger ? '#dc2626' : isWarning ? '#d97706' : '#059669';
        const bgHex = isDanger ? '#fee2e2' : isWarning ? '#fef3c7' : '#d1fae5';

        // Custom DivIcon for crisp industrial appearance
        const sensorIcon = L.divIcon({
          className: 'custom-sensor-icon',
          html: `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
              ${isDanger ? `
                <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: rgba(220, 38, 38, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              ` : ''}
              <div style="width: 28px; height: 28px; border-radius: 4px; background: ${bgHex}; border: 2px solid ${colorHex}; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 10px; font-weight: bold; color: ${colorHex}; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                ${s.sensor_code ? s.sensor_code.slice(-3) : 'IOT'}
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker(latLng, { icon: sensorIcon });

        // Popup Content
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
              <span style="font-family: monospace; font-weight: bold; color: #102e91; font-size: 11px;">${s.sensor_code}</span>
              <span style="font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 2px; background: ${bgHex}; color: ${colorHex};">${status}</span>
            </div>
            <div style="font-weight: bold; font-size: 12px; color: #0f172a; margin-bottom: 6px;">${s.location_name}</div>
            
            <div style="display: grid; grid-cols: 3; gap: 4px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px; border-radius: 2px; font-size: 11px; margin-bottom: 6px;">
              <div>
                <span style="color: #64748b; font-size: 9px; display: block;">KEASAMAN</span>
                <strong style="color: ${s.latest_telemetry && s.latest_telemetry.ph_level < 6.5 ? '#dc2626' : '#102e91'}; font-size: 13px;">${s.latest_telemetry?.ph_level?.toFixed(1) ?? '—'} pH</strong>
              </div>
              <div style="margin-top: 4px;">
                <span style="color: #64748b; font-size: 9px; display: block;">PASANG ROB</span>
                <strong style="color: #102e91; font-size: 13px;">${s.latest_telemetry?.water_level_cm ?? '—'} cm</strong>
              </div>
              <div style="margin-top: 4px;">
                <span style="color: #64748b; font-size: 9px; display: block;">SALINITAS</span>
                <strong style="color: #102e91; font-size: 13px;">${s.latest_telemetry?.salinity_ppt ?? '—'} ppt</strong>
              </div>
            </div>

            ${s.latest_telemetry?.action_directive ? `
              <div style="font-size: 10px; color: #475569; border-left: 2px solid ${colorHex}; padding-left: 6px; font-style: italic;">
                "${s.latest_telemetry.action_directive}"
              </div>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        groups.sensors.addLayer(marker);

        // 3. Render Risk Zone around warning/danger sensor
        if (showRiskZones && (isWarning || isDanger)) {
          const radiusMeters = isDanger ? 2500 : 1500;
          const circle = L.circle(latLng, {
            radius: radiusMeters,
            color: colorHex,
            fillColor: colorHex,
            fillOpacity: isDanger ? 0.22 : 0.15,
            weight: 2,
            dashArray: isDanger ? undefined : '5, 5',
          });

          circle.bindPopup(`
            <div style="font-size: 11px; font-family: system-ui, sans-serif;">
              <strong style="color: ${colorHex}; display: block; margin-bottom: 2px;">
                ${isDanger ? 'ZONA BAHAYA LIMBAH & ROB' : 'ZONA WASPADA PESISIR'}
              </strong>
              <span>Radius sebaran: ${radiusMeters / 1000} km dari ${s.location_name}</span>
            </div>
          `);

          groups.riskZones.addLayer(circle);
        }
      });
    }

    // 4. Render Incident Reports
    if (showReports) {
      reports.forEach((r) => {
        if (r.latitude == null || r.longitude == null) return;
        const latLng: [number, number] = [Number(r.latitude), Number(r.longitude)];
        allLatLngs.push(latLng);

        const isSelected = r.id === selectedReportId;
        const isHigh = r.priority === 'HIGH';
        const isMedium = r.priority === 'MEDIUM';
        const colorHex = isHigh ? '#dc2626' : isMedium ? '#d97706' : '#2563eb';

        const reportIcon = L.divIcon({
          className: 'custom-report-icon',
          html: `
            <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="width: 24px; height: 24px; border-radius: 9999px; background: #ffffff; border: 2.5px solid ${colorHex}; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: ${colorHex}; box-shadow: 0 2px 4px rgba(0,0,0,0.3); ${isSelected ? 'transform: scale(1.25); border-width: 3px;' : ''}">
                !
              </div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker(latLng, { icon: reportIcon });

        const reportPopup = `
          <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 4px;">
            <div style="font-family: monospace; font-weight: bold; color: #102e91; font-size: 11px; margin-bottom: 4px;">
              ${r.ticket_code}
            </div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">
              Pelapor: <strong>${r.reporter_phone}</strong>
            </div>
            <div style="font-size: 11px; color: #1e293b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px; border-radius: 2px; margin-bottom: 6px; font-style: italic;">
              "${r.description}"
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px;">
              <span style="font-weight: bold; color: ${colorHex};">Prioritas: ${r.priority}</span>
              <span style="color: #64748b;">${r.status}</span>
            </div>
          </div>
        `;

        marker.bindPopup(reportPopup);
        marker.on('click', () => {
          if (onSelectReport) {
            onSelectReport(r.id);
          }
        });

        groups.reports.addLayer(marker);
      });
    }

    // 5. Fit Bounds if there are coordinates
    if (allLatLngs.length > 0) {
      try {
        const bounds = L.latLngBounds(allLatLngs);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (e) {
        console.warn('Could not fit bounds on map:', e);
      }
    }
  }, [sensors, reports, showSensors, showReports, showRiskZones, selectedReportId, onSelectReport]);

  // Center/Fly to selected report when selected in list
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedReportId) return;

    const report = reports.find((r) => r.id === selectedReportId);
    if (report && report.latitude != null && report.longitude != null) {
      map.flyTo([Number(report.latitude), Number(report.longitude)], 14, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedReportId, reports]);

  return (
    <div className="relative w-full h-full min-h-[360px] bg-[#f8fafc] overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full min-h-[360px] z-0" />
      {/* Map Legend Overlay */}
      <div className="absolute bottom-2 left-2 z-[400] bg-white/95 border border-[#cbd5e1] rounded-sm p-2 text-[10px] font-mono shadow-sm flex flex-col gap-1 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#059669] border border-[#047857]"></span>
          <span>Sensor Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#d97706] border border-[#b45309]"></span>
          <span>Sensor Waspada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#dc2626] border border-[#b91c1c]"></span>
          <span>Sensor Bahaya / Anomali</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#dc2626] text-center font-bold text-[8px] leading-[8px] flex items-center justify-center">!</span>
          <span>Titik Laporan Warga</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 bg-[#dc2626]/20 border border-[#dc2626] border-dashed"></span>
          <span>Radius Sebaran Limbah</span>
        </div>
      </div>
    </div>
  );
}
