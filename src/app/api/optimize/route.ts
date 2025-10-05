
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

export async function POST(request: Request) {
  try {
    const { city, duration } = await request.json();

    if (!city || typeof city !== 'string' || !['1', '2', '3', '4', '5'].includes(city)) {
      return NextResponse.json({ error: 'Invalid "city" parameter. Must be a string from "1" to "5".' }, { status: 400 });
    }
    
    if (!duration || typeof duration !== 'number' || duration < 2 || duration > 12) {
      return NextResponse.json({ error: 'Invalid "duration" parameter. Must be a number between 2 and 12.' }, { status: 400 });
    }

    // Path to the Python executable and script
    const pythonExecutable = '/usr/bin/python3';
    const scriptPath = path.join(process.cwd(), 'src', 'server', 'dp_cli.py');
    const tempOutputFile = path.join(os.tmpdir(), `results-${Date.now()}.json`);
    const dateToday = new Date().toISOString().split('T')[0];

    // Arguments for the script
    const scriptArgs = [
      scriptPath,
      '--city', city,
      '--date', dateToday,
      '--duration', duration.toString(),
      '--compare-schedules',
      '--json', tempOutputFile
    ];

    const pythonProcess = spawn(pythonExecutable, scriptArgs);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const executionPromise = new Promise(async (resolve, reject) => {
      pythonProcess.on('close', async (code) => {
        if (code === 0) {
          try {
             // The script writes to a file, so we read it.
             const resultData = await fs.readFile(tempOutputFile, 'utf-8');
             await fs.unlink(tempOutputFile); // Clean up the temp file
             const result = JSON.parse(resultData);
             resolve(result);
          } catch (e: any) {
            console.error(`Failed to parse Python script output file: ${e.message}`);
            console.error(`stdout from script: ${stdout}`);
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
