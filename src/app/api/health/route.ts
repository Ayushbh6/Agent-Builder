import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db/index';

export async function GET() {
  try {
    const dbStatus = await testConnection();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV,
    }, { 
      status: dbStatus.success ? 200 : 503 
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { 
      status: 500 
    });
  }
}