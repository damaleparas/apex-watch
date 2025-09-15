import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Activity, History, Shield } from "lucide-react";
import SensorMap from "@/components/SensorMap";
import AlertHistory from "@/components/AlertHistory";

interface Sensor {
  id: string;
  name: string;
  location: string;
  currentValue: number;
  status: "safe" | "warning" | "danger";
  lastUpdate: string;
  coordinates: [number, number];
}

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState<"safe" | "danger">("safe");
  const [sensors, setSensors] = useState<Sensor[]>([
    {
      id: "S001",
      name: "Temperature Sensor Alpha",
      location: "Building A - Floor 1",
      currentValue: 22.5,
      status: "safe",
      lastUpdate: "2 mins ago",
      coordinates: [40.7589, -73.9851]
    },
    {
      id: "S002", 
      name: "Pressure Monitor Beta",
      location: "Building B - Floor 3",
      currentValue: 1.2,
      status: "safe",
      lastUpdate: "1 min ago",
      coordinates: [40.7614, -73.9776]
    },
    {
      id: "S003",
      name: "Vibration Detector Gamma",
      location: "Building C - Basement",
      currentValue: 0.8,
      status: "danger",
      lastUpdate: "30 secs ago",
      coordinates: [40.7505, -73.9934] 
    },
    {
      id: "S004",
      name: "Chemical Sensor Delta",
      location: "Building A - Floor 2", 
      currentValue: 15.3,
      status: "warning",
      lastUpdate: "5 mins ago",
      coordinates: [40.7549, -73.9840]
    }
  ]);

  const [showAlertHistory, setShowAlertHistory] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => ({
        ...sensor,
        currentValue: sensor.currentValue + (Math.random() - 0.5) * 2,
        lastUpdate: "Just now"
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update system status based on sensor statuses
  useEffect(() => {
    const hasDanger = sensors.some(sensor => sensor.status === "danger");
    setSystemStatus(hasDanger ? "danger" : "safe");
  }, [sensors]);

  const getStatusBadge = (status: string) => {
    const variants = {
      safe: "bg-status-safe text-primary-foreground",
      warning: "bg-status-warning text-warning-foreground",
      danger: "bg-status-danger text-destructive-foreground animate-pulse"
    };
    return variants[status as keyof typeof variants] || variants.safe;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-glow">Risk Monitor Dashboard</h1>
          </div>
          <button
            onClick={() => setShowAlertHistory(!showAlertHistory)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>Alert History</span>
          </button>
        </header>

        {/* System Status */}
        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className={`status-indicator ${systemStatus === "safe" ? "status-safe" : "status-danger"}`}>
                {systemStatus === "safe" ? (
                  <Shield className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-xl font-bold">
                  System Status: {systemStatus === "safe" ? "STABLE" : "HIGH-RISK"}
                </span>
                <p className="text-sm text-muted-foreground font-normal">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Map */}
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Sensor Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SensorMap sensors={sensors} />
            </CardContent>
          </Card>

          {/* Current Sensor Overview */}
          <Card className="card-dashboard">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>Live Sensor Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensors.map((sensor) => (
                  <Link
                    key={sensor.id}
                    to={`/sensor/${sensor.id}`}
                    className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors border border-border/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusBadge(sensor.status)}>
                            {sensor.id}
                          </Badge>
                          <h3 className="font-semibold">{sensor.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {sensor.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono font-bold">
                          {sensor.currentValue.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sensor.lastUpdate}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert History Panel */}
        {showAlertHistory && <AlertHistory />}
      </div>
    </div>
  );
};

export default Dashboard;