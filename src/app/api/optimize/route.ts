
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function will proxy requests to the Python FastAPI backend
export async function POST(request: NextRequest) {
  try {
    const { city, startHour, duration } = await request.json();

    if (!city || typeof city !== 'string' || !['1', '2', '3', '4', '5'].includes(city)) {
      return NextResponse.json({ error: 'Invalid "city" parameter.' }, { status: 400 });
    }
    
    if (startHour === undefined || typeof startHour !== 'number' || startHour < 0 || startHour > 23) {
      return NextResponse.json({ error: 'Invalid "startHour" parameter.' }, { status: 400 });
    }
    
    if (duration === undefined || typeof duration !== 'number' || duration <= 0) {
      return NextResponse.json({ error: 'Invalid "duration" parameter.' }, { status: 400 });
    }
    
    const pythonApiUrl = `http://127.0.0.1:8000/api/v1/optimize/best_start_cluster?city_id=${city}&start_hour=${startHour}&duration=${duration}`;

    const response = await fetch(pythonApiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'The optimization algorithm failed on the Python server.');
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
