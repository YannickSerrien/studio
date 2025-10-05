
import { NextResponse } from 'next/server';

// --- Hardcoded Data ---
const cityData: Record<string, { name: string; hotspot: string }> = {
  '1': { name: 'Amsterdam', hotspot: 'De Pijp' },
  '2': { name: 'Rotterdam', hotspot: 'Witte de Withstraat' },
  '3': { name: 'Utrecht', hotspot: 'Neude' },
  '4': { name: 'Eindhoven', hotspot: 'Stratumseind' },
  '5': { name: 'Den Haag', hotspot: 'Plein' },
};

// Represents typical busy periods. Intensity is on a scale of 1-10.
const busyHoursData: { hour: number; intensity: number; description: string }[] = [
  { hour: 7, intensity: 7, description: 'Morning Commute' },
  { hour: 8, intensity: 8, description: 'Morning Peak' },
  { hour: 9, intensity: 7, description: 'Morning Commute' },
  { hour: 12, intensity: 6, description: 'Lunch Hour' },
  { hour: 13, intensity: 6, description: 'Lunch Hour' },
  { hour: 17, intensity: 8, description: 'Evening Commute' },
  { hour: 18, intensity: 9, description: 'Evening Peak' },
  { hour: 19, intensity: 8, description: 'Evening Commute' },
  { hour: 21, intensity: 7, description: 'Nightlife Start' },
  { hour: 22, intensity: 9, description: 'Nightlife Peak' },
  { hour: 23, intensity: 10, description: 'Nightlife Peak' },
  { hour: 0, intensity: 9, description: 'Nightlife End' },
  { hour: 1, intensity: 8, description: 'Nightlife End' },
];
// --- End Hardcoded Data ---

export async function POST(request: Request) {
  try {
    const { city, startHour, endHour } = await request.json();

    if (!city || startHour === undefined || endHour === undefined) {
      return NextResponse.json({ error: 'Missing required parameters: city, startHour, endHour' }, { status: 400 });
    }

    // Create a range of hours to check
    let hoursInRange = [];
    if (startHour <= endHour) {
      for (let i = startHour; i <= endHour; i++) {
        hoursInRange.push(i);
      }
    } else { // Handle overnight ranges (e.g., 22:00 to 02:00)
      for (let i = startHour; i < 24; i++) {
        hoursInRange.push(i);
      }
      for (let i = 0; i <= endHour; i++) {
        hoursInRange.push(i);
      }
    }

    // Find the busiest hour within the selected range
    const bestHour = busyHoursData
      .filter(busyHour => hoursInRange.includes(busyHour.hour))
      .reduce((best, current) => (current.intensity > best.intensity ? current : best), { hour: -1, intensity: -1, description: 'N/A' });

    if (bestHour.intensity === -1) {
      return NextResponse.json({ suggestion: null }, { status: 200 });
    }

    const suggestion = {
      start_hour: bestHour.hour,
      description: bestHour.description,
      hotspot: cityData[city]?.hotspot || 'City Center',
    };

    return NextResponse.json({ suggestion }, { status: 200 });

  } catch (error) {
    console.error('Error in optimize API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
