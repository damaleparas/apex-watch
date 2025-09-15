import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";

interface Alert {
  id: string;
  sensorId: string;
  message: string;
  timestamp: string;
  severity: "warning" | "danger";
}

const AlertHistory = () => {
  const alerts: Alert[] = [
    {
      id: "A001",
      sensorId: "S003",
      message: "Vibration levels exceeded threshold (0.8 > 0.5)",
      timestamp: "2024-01-15 14:32:15",
      severity: "danger"
    },
    {
      id: "A002",
      sensorId: "S004", 
      message: "Chemical concentration approaching warning level",
      timestamp: "2024-01-15 14:15:42",
      severity: "warning"
    },
    {
      id: "A003",
      sensorId: "S003",
      message: "Abnormal vibration pattern detected",
      timestamp: "2024-01-15 13:58:21",
      severity: "danger"
    },
    {
      id: "A004",
      sensorId: "S002",
      message: "Pressure reading fluctuation detected",
      timestamp: "2024-01-15 13:45:07",
      severity: "warning"
    },
    {
      id: "A005",
      sensorId: "S001",
      message: "Temperature spike resolved",
      timestamp: "2024-01-15 13:22:33",
      severity: "warning"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    return severity === "danger" 
      ? "bg-destructive text-destructive-foreground"
      : "bg-warning text-warning-foreground";
  };

  return (
    <Card className="card-dashboard">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <span>Alert History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start space-x-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/20"
            >
              <div className="flex-shrink-0 pt-1">
                <Badge className={getSeverityBadge(alert.severity)}>
                  {alert.sensorId}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {alert.message}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {alert.timestamp}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Badge
                  variant="outline"
                  className={
                    alert.severity === "danger"
                      ? "border-destructive/50 text-destructive"
                      : "border-warning/50 text-warning"
                  }
                >
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertHistory;