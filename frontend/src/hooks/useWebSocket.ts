'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface MarketTick {
  instrument_token: number;
  last_price: number;
  volume: number;
  buy_quantity: number;
  sell_quantity: number;
  change: number;
  timestamp: Date;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  connected: boolean;
  subscribe: (tokens: number[]) => void;
  unsubscribe: (tokens: number[]) => void;
  onTicks: (callback: (ticks: MarketTick[]) => void) => void;
  onPositionUpdate: (callback: (position: any) => void) => void;
  onOrderUpdate: (callback: (order: any) => void) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const tickCallbacksRef = useRef<((ticks: MarketTick[]) => void)[]>([]);
  const positionCallbacksRef = useRef<((position: any) => void)[]>([]);
  const orderCallbacksRef = useRef<((order: any) => void)[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socket.on('reconnect', (attemptNumber: number) => {
      console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
      setConnected(true);
    });

    socket.on('reconnect_error', (error: Error) => {
      console.error('WebSocket reconnection error:', error);
    });

    // Market data handlers
    socket.on('market:ticks', (ticks: MarketTick[]) => {
      tickCallbacksRef.current.forEach(callback => callback(ticks));
    });

    socket.on('market:subscribed', (data: { tokens: number[] }) => {
      console.log('Subscribed to tokens:', data.tokens);
    });

    socket.on('market:unsubscribed', (data: { tokens: number[] }) => {
      console.log('Unsubscribed from tokens:', data.tokens);
    });

    socket.on('market:error', (error: { message: string }) => {
      console.error('Market data error:', error.message);
    });

    // Position update handler
    socket.on('position:update', (position: any) => {
      positionCallbacksRef.current.forEach(callback => callback(position));
    });

    // Order update handler
    socket.on('order:update', (order: any) => {
      orderCallbacksRef.current.forEach(callback => callback(order));
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribe = (tokens: number[]) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('market:subscribe', tokens);
    }
  };

  const unsubscribe = (tokens: number[]) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('market:unsubscribe', tokens);
    }
  };

  const onTicks = (callback: (ticks: MarketTick[]) => void) => {
    tickCallbacksRef.current.push(callback);
  };

  const onPositionUpdate = (callback: (position: any) => void) => {
    positionCallbacksRef.current.push(callback);
  };

  const onOrderUpdate = (callback: (order: any) => void) => {
    orderCallbacksRef.current.push(callback);
  };

  return {
    socket: socketRef.current,
    connected,
    subscribe,
    unsubscribe,
    onTicks,
    onPositionUpdate,
    onOrderUpdate,
  };
}
