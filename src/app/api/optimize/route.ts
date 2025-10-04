
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { hours, city } = await request.json();

    if (!hours || typeof hours !== 'number' || hours < 1 || hours > 24) {
      return NextResponse.json({ error: 'Invalid "hours" parameter. Must be a number between 1 and 24.' }, { status: 400 });
    }

    if (!city || typeof city !== 'number' || city < 1 || city > 5) {
      return NextResponse.json({ error: 'Invalid "city" parameter. Must be a number between 1 and 5.' }, { status: 400 });
    }

    // Path to the Python executable and script
    const pythonExecutable = process.env.NODE_ENV === 'production' ? 'python3' : 'python3';
    const scriptPath = path.join(process.cwd(), 'src', 'server', 'dp_cli.py');

    // Arguments for the script
    const scriptArgs = [
      '--city', city.toString(),
      '--duration', hours.toString(),
      '--best-positions',
      '--json-output',
      '--top-k', '1'
    ];

    const pythonProcess = spawn(pythonExecutable, [scriptPath, ...scriptArgs]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const executionPromise = new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (e) {
            reject(new Error('Failed to parse Python script output.'));
          }
        } else {
            console.error(`Python script stderr: ${stderr}`);
            reject(new Error(`Python script exited with code ${code}: ${stderr}`));
        }
      });

      pythonProcess.on('error', (err) => {
        reject(new Error(`Failed to start Python script: ${err.message}`));
      });
    });

    const result = await executionPromise;
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
