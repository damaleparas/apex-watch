import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface DataPoint {
  time: string;
  value: number;
  timestamp: number;
}

interface SensorChartProps {
  sensorId: string;
  currentValue: number;
  unit: string;
  thresholds: {
    warning: number;
    danger: number;
  };
}

const SensorChart = ({ sensorId, currentValue, unit, thresholds }: SensorChartProps) => {
  const [data, setData] = useState<DataPoint[]>([]);

  // Initialize with some mock historical data
  useEffect(() => {
    const now = Date.now();
    const initialData: DataPoint[] = [];
    
    // Generate last 30 data points (30 minutes of data)
    for (let i = 29; i >= 0; i--) {
      const timestamp = now - (i * 60 * 1000); // 1 minute intervals
      const time = new Date(timestamp);
      const baseValue = currentValue + (Math.random() - 0.5) * 4;
      
      initialData.push({
        time: time.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        value: Math.max(0, baseValue),
        timestamp
      });
    }
    
    setData(initialData);
  }, [sensorId]);

  // Add new data points in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newPoint: DataPoint = {
        time: new Date(now).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        value: currentValue,
        timestamp: now
      };

      setData(prev => {
        const newData = [...prev, newPoint];
        // Keep only last 30 points
        return newData.slice(-30);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentValue]);

  const getLineColor = () => {
    if (currentValue >= thresholds.danger) return "hsl(var(--destructive))";
    if (currentValue >= thresholds.warning) return "hsl(var(--warning))";
    return "hsl(var(--primary))";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg border border-border shadow-lg">
          <p className="text-sm">{`Time: ${label}`}</p>
          <p className="text-sm font-semibold">
            {`Value: ${payload[0].value.toFixed(2)} ${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Threshold lines */}
          <ReferenceLine 
            y={thresholds.warning} 
            stroke="hsl(var(--warning))" 
            strokeDasharray="5 5"
            strokeOpacity={0.8}
          />
          <ReferenceLine 
            y={thresholds.danger} 
            stroke="hsl(var(--destructive))" 
            strokeDasharray="5 5"
            strokeOpacity={0.8}
          />
          
          <Line
            type="monotone"
            dataKey="value"
            stroke={getLineColor()}
            strokeWidth={2}
            dot={false}
            activeDot={{ 
              r: 4, 
              fill: getLineColor(),
              stroke: "hsl(var(--background))",
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-warning"></div>
          <span>Warning Threshold ({thresholds.warning} {unit})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-destructive"></div>
          <span>Danger Threshold ({thresholds.danger} {unit})</span>
        </div>
      </div>
    </div>
  );
};

export default SensorChart;
