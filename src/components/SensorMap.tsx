import { useEffect, useRef } from "react";

interface Sensor {
  id: string;
  name: string;
  status: "safe" | "warning" | "danger";
  coordinates: [number, number];
}

interface SensorMapProps {
  sensors: Sensor[];
}

const SensorMap = ({ sensors }: SensorMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock map with sensor pins - in real app would integrate with Mapbox/Google Maps
  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-secondary/30 to-secondary/50 rounded-lg border border-border/30 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map placeholder with styling */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-4">Interactive Map View</div>
          <div className="text-xs text-muted-foreground/60">
            Real deployment would integrate with Mapbox or Google Maps
          </div>
        </div>
      </div>

      {/* Sensor Pins - positioned absolutely to simulate map locations */}
      {sensors.map((sensor, index) => {
        const positions = [
          { top: "25%", left: "20%" },
          { top: "35%", left: "60%" },
          { top: "65%", left: "30%" },
          { top: "45%", left: "75%" }
        ];
        
        const position = positions[index] || positions[0];
        
        return (
          <div
            key={sensor.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ top: position.top, left: position.left }}
          >
            <div
              className={`sensor-pin ${
                sensor.status === "safe" 
                  ? "sensor-pin-safe" 
                  : sensor.status === "danger"
                  ? "sensor-pin-danger"
                  : "bg-warning"
              }`}
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-popover text-popover-foreground px-3 py-2 rounded shadow-lg text-sm whitespace-nowrap border border-border">
                <div className="font-semibold">{sensor.id}</div>
                <div className="text-xs text-muted-foreground">{sensor.name}</div>
                <div className="text-xs">
                  Status: <span className={`font-semibold ${
                    sensor.status === "safe" ? "text-primary" :
                    sensor.status === "warning" ? "text-warning" : "text-destructive"
                  }`}>{sensor.status.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="text-xs font-semibold mb-2">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Safe</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
            <span>Danger</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorMap;