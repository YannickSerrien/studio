
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

export async function POST(request: Request) {
  try {
    const { city, startHour, duration } = await request.json();

    if (!city || typeof city !== 'string' || !['1', '2', '3', '4', '5'].includes(city)) {
      return NextResponse.json({ error: 'Invalid "city" parameter. Must be a string from "1" to "5".' }, { status: 400 });
    }
    
    if (startHour === undefined || typeof startHour !== 'number' || startHour < 0 || startHour > 23) {
      return NextResponse.json({ error: 'Invalid "startHour" parameter. Must be a number between 0 and 23.' }, { status: 400 });
    }
    
    if (!duration || typeof duration !== 'number' || duration <= 0 || duration > 24) {
      return NextResponse.json({ error: 'Invalid "duration" parameter. Must be a positive number up to 24.' }, { status: 400 });
    }

    const pythonExecutable = 'python3';
    const scriptPath = path.join(process.cwd(), 'src', 'server', 'dp_cli.py');
    const tempOutputFile = path.join(os.tmpdir(), `results-${Date.now()}.json`);
    const dateToday = new Date().toISOString().split('T')[0];

    // For a specific time slot, we need to find the best cluster to start in.
    // So we use `--best-positions`
    const scriptArgs = [
        scriptPath,
        '--city', city,
        '--date', dateToday,
        '--hour', startHour.toString(),
        '--duration', duration.toString(),
        '--best-positions',
        '--top-k', '1', // We only need the single best one
        '--json', tempOutputFile,
    ];
    
    const pythonProcess = spawn(pythonExecutable, scriptArgs, {
        cwd: path.join(process.cwd(), 'src', 'server'),
        env: {
          ...process.env,
          PYTHONPATH: path.join(process.cwd(), 'src', 'server'),
        }
    });

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
             const resultData = await fs.readFile(tempOutputFile, 'utf-8');
             await fs.unlink(tempOutputFile); 
             const result = JSON.parse(resultData);
             // Since we are asking for the best position, the result is in a different format.
             // We will extract the first (and only) result to match the old `cluster_analysis` format
             // for frontend compatibility.
             if (result.analysis?.best_positions && result.analysis.best_positions.length > 0) {
                const bestPosition = result.analysis.best_positions[0];
                resolve({
                    cluster_analysis: {
                        cluster: bestPosition.cluster,
                        total_earnings: bestPosition.earnings,
                        hourly_rate: bestPosition.earnings / duration,
                        optimal_path: bestPosition.path
                    }
                });
             } else {
                reject(new Error('No best position found in algorithm output.'));
             }

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
