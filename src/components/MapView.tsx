import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Search,
  Activity,
  Filter,
  CheckSquare,
  Square,
  Compass,
  AlertTriangle,
  Flame,
  Droplets,
  Zap,
  Wifi,
  Building2,
  Info,
  Maximize2,
  ArrowRight,
} from 'lucide-react';
import { UtilityItem, LocationPreset, UtilityType } from '../types';
import { SAMPLE_LOCATIONS } from '../data/sampleData';
import { getMinimumDistanceToUtility } from '../utils/riskEngine';

interface MapViewProps {
  utilities: UtilityItem[];
  onSelectCoordinatesForRisk: (lat: number, lng: number, name: string) => void;
  isDarkMode: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  utilities,
  onSelectCoordinatesForRisk,
  isDarkMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // Map state
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset>(SAMPLE_LOCATIONS[1]);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'dark'>('street');
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Active Category Toggles
  const [activeCategories, setActiveCategories] = useState<Record<UtilityType, boolean>>({
    water: true,
    gas: true,
    electric: true,
    fiber: true,
    sewer: true,
  });

  // Selected excavation point on map
  const [activePin, setActivePin] = useState<{ lat: number; lng: number; name: string } | null>({
    lat: SAMPLE_LOCATIONS[1].lat,
    lng: SAMPLE_LOCATIONS[1].lng,
    name: SAMPLE_LOCATIONS[1].name,
  });

  // Scan radius for nearby utilities
  const [scanRadiusMeters, setScanRadiusMeters] = useState<number>(25);

  // Selected utility for detail popup/card
  const [selectedUtility, setSelectedUtility] = useState<UtilityItem | null>(null);

  // Utility color mapping
  const UTILITY_COLORS: Record<UtilityType, string> = {
    water: '#3b82f6', // Blue
    gas: '#eab308', // Yellow
    electric: '#ef4444', // Red
    fiber: '#22c55e', // Green
    sewer: '#a16207', // Brown
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [activePin?.lat || 37.7882, activePin?.lng || -122.3980],
        zoom: 16,
        zoomControl: true,
      });

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);

      // Handle map click to drop excavation pin
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setActivePin({
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
          name: `Custom Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (mapStyle === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (mapStyle === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO';
    }

    L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);
  }, [mapStyle]);

  // Render Utilities Polylines & Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    utilities.forEach((util) => {
      if (!activeCategories[util.type]) return;

      const color = UTILITY_COLORS[util.type] || '#3b82f6';

      if (util.coordinates && util.coordinates.length > 0) {
        const latLngs = util.coordinates.map((c) => [c.lat, c.lng] as [number, number]);

        // Draw line string for pipeline/cable
        const polyline = L.polyline(latLngs, {
          color: color,
          weight: util.type === 'gas' || util.type === 'electric' ? 5 : 4,
          opacity: 0.85,
          dashArray: util.status === 'Under Maintenance' ? '6, 6' : undefined,
        });

        // Click on polyline to view utility info card
        polyline.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedUtility(util);
        });

        polyline.bindTooltip(
          `<strong>${util.name}</strong><br/>Type: ${util.type.toUpperCase()}<br/>Depth: ${util.depthMeters}m<br/>Specs: ${util.voltageOrPressure}`,
          { sticky: true }
        );

        layerGroup.addLayer(polyline);

        // Add start and end node markers
        latLngs.forEach((coord) => {
          const nodeMarker = L.circleMarker(coord, {
            radius: 4,
            fillColor: color,
            color: '#ffffff',
            weight: 1.5,
            fillOpacity: 1,
          });
          nodeMarker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedUtility(util);
          });
          layerGroup.addLayer(nodeMarker);
        });
      }
    });

    // Render active pin & scan radius circle
    if (activePin) {
      if (pinMarkerRef.current) map.removeLayer(pinMarkerRef.current);
      if (radiusCircleRef.current) map.removeLayer(radiusCircleRef.current);

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-pin-icon',
        html: `
          <div style="position: relative; display: flex; items-center; justify-content: center;">
            <div class="radar-marker"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const pinMarker = L.marker([activePin.lat, activePin.lng], { icon: customIcon }).addTo(map);
      pinMarker.bindPopup(
        `<div style="font-family: sans-serif; padding: 4px;">
          <strong style="color: #ef4444;">📍 Excavation Target Pin</strong><br/>
          <span>${activePin.name}</span><br/>
          <small>LAT: ${activePin.lat.toFixed(5)} | LNG: ${activePin.lng.toFixed(5)}</small>
        </div>`
      );

      const circle = L.circle([activePin.lat, activePin.lng], {
        radius: scanRadiusMeters,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);

      pinMarkerRef.current = pinMarker;
      radiusCircleRef.current = circle;
    }
  }, [utilities, activeCategories, activePin, scanRadiusMeters]);

  // Address Search Handler (Nominatim Geocoding with fallback)
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        setActivePin({
          lat,
          lng: lon,
          name: data[0].display_name.split(',')[0],
        });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lon], 17);
        }
      } else {
        alert('Location address not found. Try selecting one of the preset locations.');
      }
    } catch (err) {
      console.warn('Geocoding search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select Preset Location
  const handleSelectPreset = (preset: LocationPreset) => {
    setSelectedLocation(preset);
    setActivePin({
      lat: preset.lat,
      lng: preset.lng,
      name: preset.name,
    });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([preset.lat, preset.lng], 17);
    }
  };

  // Nearby detected utilities calculation
  const detectedNearbyUtilities = activePin
    ? utilities
        .map((u) => ({
          utility: u,
          distanceMeters: Math.round(
            getMinimumDistanceToUtility({ lat: activePin.lat, lng: activePin.lng }, u) * 10
          ) / 10,
        }))
        .filter((item) => item.distanceMeters <= scanRadiusMeters)
        .sort((a, b) => a.distanceMeters - b.distanceMeters)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Map Control Toolbar */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 text-white shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Preset Location Picker */}
        <div className="flex flex-wrap items-center gap-3">
          <Compass className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-xs font-bold text-slate-300">PRESET LOCATIONS:</span>
          <select
            value={selectedLocation.name}
            onChange={(e) => {
              const found = SAMPLE_LOCATIONS.find((l) => l.name === e.target.value);
              if (found) handleSelectPreset(found);
            }}
            className="bg-[#0f172a] text-xs text-white border border-[#334155] rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {SAMPLE_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Address Search Form */}
        <form onSubmit={handleAddressSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Search address (e.g. 420 Engineering Dr, Silicon Valley)..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-full pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Go'}
          </button>
        </form>

        {/* Tile Style Picker */}
        <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-lg text-xs border border-[#334155]">
          <button
            onClick={() => setMapStyle('street')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              mapStyle === 'street' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Street Map
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              mapStyle === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapStyle('dark')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              mapStyle === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dark Mode
          </button>
        </div>
      </div>

      {/* Main Map Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive Leaflet Canvas */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="relative rounded-xl border border-[#334155] bg-grid-pattern overflow-hidden shadow-2xl h-[560px]">
            {/* The Leaflet Div */}
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Floating Map Category Layer Toggles */}
            <div className="absolute top-4 right-4 z-20 bg-[#0f172a]/90 backdrop-blur-md border border-[#334155] rounded-xl p-3 shadow-xl space-y-2 text-xs text-white max-w-xs">
              <div className="font-bold text-slate-200 flex items-center justify-between pb-1 border-b border-[#334155]">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  UTILITY LEGEND
                </span>
                <span className="text-[10px] text-slate-400">Toggle View</span>
              </div>

              <div className="space-y-1.5">
                {(['water', 'gas', 'electric', 'fiber', 'sewer'] as UtilityType[]).map((type) => {
                  const isActive = activeCategories[type];
                  return (
                    <button
                      key={type}
                      onClick={() =>
                        setActiveCategories((prev) => ({ ...prev, [type]: !prev[type] }))
                      }
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#1e293b] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-md shrink-0"
                          style={{ backgroundColor: UTILITY_COLORS[type] }}
                        />
                        <span className="capitalize font-medium text-slate-200">{type} Line</span>
                      </div>
                      {isActive ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instruction Banner overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-[#0f172a]/90 backdrop-blur-md border border-[#334155] rounded-xl px-3 py-2 text-[11px] text-slate-300 shadow-xl flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500 animate-bounce" />
              <span>Click anywhere on map to drop target excavation pin</span>
            </div>
          </div>
        </div>

        {/* Right Side: Proximity Inspector & Detected Utilities */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Pin Coordinates & Action Card */}
          {activePin && (
            <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">{activePin.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      LAT: {activePin.lat.toFixed(5)} | LNG: {activePin.lng.toFixed(5)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Radius Filter Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Subterranean Radar Radius:</span>
                  <span className="text-cyan-400 font-mono font-bold">{scanRadiusMeters} meters</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={scanRadiusMeters}
                  onChange={(e) => setScanRadiusMeters(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Detected Lines Summary */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Buried Utilities Detected ({detectedNearbyUtilities.length})</span>
                  <span className="text-[10px] text-slate-400">Within {scanRadiusMeters}m</span>
                </div>

                {detectedNearbyUtilities.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center text-xs text-slate-400 space-y-1">
                    <Info className="w-4 h-4 mx-auto text-slate-500" />
                    <p>No mapped utilities within {scanRadiusMeters}m radius of this target pin.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {detectedNearbyUtilities.map(({ utility, distanceMeters }) => (
                      <div
                        key={utility.id}
                        onClick={() => setSelectedUtility(utility)}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition-colors text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: UTILITY_COLORS[utility.type] }}
                          />
                          <div>
                            <div className="font-semibold text-slate-200">{utility.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {utility.voltageOrPressure} • {utility.depthMeters}m depth
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${
                              distanceMeters <= 5
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-blue-500/20 text-cyan-300'
                            }`}
                          >
                            {distanceMeters}m away
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button: Prefill Risk Predictor */}
              <button
                onClick={() =>
                  onSelectCoordinatesForRisk(activePin.lat, activePin.lng, activePin.name)
                }
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <Activity className="w-4 h-4 text-cyan-300" />
                <span>Run AI Risk Analysis Here</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Selected Utility Detail Card */}
          {selectedUtility && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl space-y-3 relative">
              <button
                onClick={() => setSelectedUtility(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Info className="w-4 h-4" />
                <span>Selected Utility Specification</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold text-slate-200">{selectedUtility.name}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Code:</span>
                  <span className="font-mono text-cyan-300">{selectedUtility.code}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Type:</span>
                  <span className="capitalize font-bold" style={{ color: UTILITY_COLORS[selectedUtility.type] }}>
                    {selectedUtility.type}
                  </span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Buried Depth:</span>
                  <span className="font-mono font-bold text-amber-300">{selectedUtility.depthMeters} meters</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Specs / Pressure:</span>
                  <span className="font-semibold text-slate-200">{selectedUtility.voltageOrPressure}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Material:</span>
                  <span className="text-slate-300">{selectedUtility.material}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Soil Condition:</span>
                  <span className="text-slate-300">{selectedUtility.soilType}</span>
                </div>
                {selectedUtility.notes && (
                  <div className="p-2 rounded-lg bg-slate-800 text-[11px] text-slate-300 italic">
                    "{selectedUtility.notes}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
