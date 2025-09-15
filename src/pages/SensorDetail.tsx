import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, TrendingUp, Activity } from "lucide-react";
import SensorChart from "@/components/SensorChart";

interface SensorData {
  id: string;
  name: string;
  location: string;
  currentValue: number;
  status: "safe" | "warning" | "danger";
  lastUpdate: string;
  averageValue24h: number;
  unit: string;
  thresholds: {
    warning: number;
    danger: number;
  };
}

const SensorDetail = () => {
  const { sensorId } = useParams<{ sensorId: string }>();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  // Mock sensor data - in real app would fetch from API
  useEffect(() => {
    const mockData: Record<string, SensorData> = {
      "S001": {
        id: "S001",
        name: "Temperature Sensor Alpha",
        location: "Building A - Floor 1",
        currentValue: 22.5,
        status: "safe",
        lastUpdate: "2 mins ago",
        averageValue24h: 21.8,
        unit: "°C",
        thresholds: { warning: 25, danger: 30 }
      },
      "S002": {
        id: "S002",
        name: "Pressure Monitor Beta", 
        location: "Building B - Floor 3",
        currentValue: 1.2,
        status: "safe",
        lastUpdate: "1 min ago", 
        averageValue24h: 1.15,
        unit: "bar",
        thresholds: { warning: 1.5, danger: 2.0 }
      },
      "S003": {
        id: "S003",
        name: "Vibration Detector Gamma",
        location: "Building C - Basement",
        currentValue: 0.8,
        status: "danger",
        lastUpdate: "30 secs ago",
        averageValue24h: 0.3,
        unit: "g",
        thresholds: { warning: 0.5, danger: 0.7 }
      },
      "S004": {
        id: "S004",
        name: "Chemical Sensor Delta",
        location: "Building A - Floor 2",
        currentValue: 15.3,
        status: "warning", 
        lastUpdate: "5 mins ago",
        averageValue24h: 12.1,
        unit: "ppm",
        thresholds: { warning: 15, danger: 20 }
      }
    };

    if (sensorId && mockData[sensorId]) {
      setSensorData(mockData[sensorId]);
    }
  }, [sensorId]);

  // Real-time updates simulation
  useEffect(() => {
    if (!sensorData) return;

    const interval = setInterval(() => {
      setSensorData(prev => {
        if (!prev) return null;
        
        const newValue = prev.currentValue + (Math.random() - 0.5) * 2;
        let newStatus: "safe" | "warning" | "danger" = "safe";
        
        if (newValue >= prev.thresholds.danger) {
          newStatus = "danger";
        } else if (newValue >= prev.thresholds.warning) {
          newStatus = "warning";
        }

        return {
          ...prev,
          currentValue: Math.max(0, newValue),
          status: newStatus,
          lastUpdate: "Just now"
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [sensorData]);

  if (!sensorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sensor Not Found</h2>
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusBadge(sensorData.status)}>
                  {sensorData.id}
                </Badge>
                <h1 className="text-2xl font-bold">{sensorData.name}</h1>
              </div>
              <p className="text-muted-foreground">{sensorData.location}</p>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-dashboard">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sensorData.currentValue.toFixed(2)} {sensorData.unit}
              </div>
              <p className="text-xs text-muted-foreground">
                Updated {sensorData.lastUpdate}
              </p>
            </CardContent>
          </Card>

          <Card className="card-dashboard">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                24h Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sensorData.averageValue24h.toFixed(2)} {sensorData.unit}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="card-dashboard">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold">
                {sensorData.location}
              </div>
              <p className="text-xs text-muted-foreground">
                Physical location
              </p>
            </CardContent>
          </Card>

          <Card className="card-dashboard">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-xs flex justify-between">
                  <span className="text-warning">Warning:</span>
                  <span>{sensorData.thresholds.warning} {sensorData.unit}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-destructive">Danger:</span>
                  <span>{sensorData.thresholds.danger} {sensorData.unit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Chart */}
        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle>Live Data Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <SensorChart 
              sensorId={sensorData.id}
              currentValue={sensorData.currentValue}
              unit={sensorData.unit}
              thresholds={sensorData.thresholds}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SensorDetail;