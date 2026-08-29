import { useEffect, useRef, useState, useCallback } from 'react';

export type TelemetryWSStatus = 'connected' | 'connecting' | 'disconnected';

export interface TelemetryWSEvent {
  type: string;
  [key: string]: any;
}

export function useTelemetryWebSocket(onEvent?: (event: TelemetryWSEvent) => void) {
  const [status, setStatus] = useState<TelemetryWSStatus>('connecting');
  const [lastEvent, setLastEvent] = useState<TelemetryWSEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    try {
      const isHttps = window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const host = window.location.port === '5173' ? 'localhost:8000' : window.location.host;
      const wsUrl = `${wsProtocol}//${host}/ws/telemetry`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      setStatus('connecting');

      ws.onopen = () => {
        setStatus('connected');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastEvent(data);
          if (onEventRef.current) {
            onEventRef.current(data);
          }
        } catch (e) {
          // ignore ping/string frames
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 4000);
      };

      ws.onerror = () => {
        setStatus('disconnected');
        ws.close();
      };
    } catch (err) {
      setStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((message: string | object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
    }
  }, []);

  return { status, send, lastEvent };
}
