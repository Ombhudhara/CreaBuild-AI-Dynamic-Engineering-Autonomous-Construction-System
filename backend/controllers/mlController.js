import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pythonDaemon = null;
let isReady = false;
const requestQueue = [];

// Initialize Python model into memory once and communicate interactively
const startDaemon = () => {
    const scriptPath = path.join(__dirname, '../ml-service/predict_daemon.py');
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

    try {
        pythonDaemon = spawn(pythonCommand, [scriptPath]);
    } catch (err) {
        console.error("❌ Failed to spawn ML Daemon:", err.message);
        pythonDaemon = null;
        isReady = false;
        return; // Don't retry if spawn itself fails
    }

    // Handle spawn errors (e.g., python3 not found on system)
    pythonDaemon.on('error', (err) => {
        console.error("❌ ML Daemon spawn error:", err.message);
        pythonDaemon = null;
        isReady = false;
        // Don't retry — Python is likely not installed
    });

    // Use readline to perfectly parse JSON objects separated by newlines
    const rl = readline.createInterface({
        input: pythonDaemon.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        const cleanLine = line.trim();
        if (cleanLine === 'READY') {
            isReady = true;
            console.log("✅ ML Engine Daemon loaded into memory. Risk Engine online.");
            return;
        }

        if (requestQueue.length > 0) {
            const { res, timeout } = requestQueue.shift();
            if (timeout) clearTimeout(timeout);
            try {
                const result = JSON.parse(cleanLine);
                if (result.error) {
                    res.status(500).json(new ApiError(500, 'ML Logic Error', [result.error]));
                } else {
                    res.status(200).json(new ApiResponse(200, result, 'Prediction generated successfully'));
                }
            } catch (err) {
                res.status(500).json(new ApiError(500, 'Failed to parse ML output', [cleanLine]));
            }
        }
    });

    pythonDaemon.stderr.on('data', (data) => {
        console.error("ML Daemon Warning:", data.toString());
    });

    pythonDaemon.on('close', (code) => {
        console.log(`ML Daemon disconnected (code: ${code}). Will use fallback predictions.`);
        isReady = false;
        pythonDaemon = null;
        // Only retry if it previously worked (was ready)
    });
};

// Start immediately when the server boots
startDaemon();

// Fallback heuristic prediction when Python daemon is unavailable
const fallbackPredict = (temperature, vibration, humidity, loadStress) => {
    let riskScore = 0;

    // Temperature risk (normal: 20-30°C)
    if (temperature > 35) riskScore += 30;
    else if (temperature > 28) riskScore += 15;

    // Vibration risk (normal: < 2 Hz)
    if (vibration > 50) riskScore += 35;
    else if (vibration > 2) riskScore += 20;

    // Humidity risk (normal: 30-60%)
    if (humidity > 80 || humidity < 20) riskScore += 15;

    // Load stress risk (normal: < 140 kN/m²)
    if (loadStress > 150) riskScore += 30;
    else if (loadStress > 140) riskScore += 20;

    let riskLevel = 0; // Low
    if (riskScore >= 50) riskLevel = 2; // High
    else if (riskScore >= 25) riskLevel = 1; // Medium

    const confidence = Math.min(95, 70 + riskScore * 0.3);

    return {
        riskLevel,
        confidence,
        probabilities: riskLevel === 2 ? [0.1, 0.2, 0.7] : riskLevel === 1 ? [0.2, 0.6, 0.2] : [0.8, 0.15, 0.05],
        featureImportance: {
            temperature: 0.2,
            vibration: 0.35,
            humidity: 0.1,
            loadStress: 0.35
        }
    };
};

// @desc    Predict structural risk using fast persistent Python Daemon
// @route   POST /api/ml/predict
// @access  Private
export const predictRisk = asyncHandler(async (req, res) => {
    const { temperature, vibration, humidity, loadStress } = req.body;

    const temp = parseFloat(temperature) || 25;
    const vib = parseFloat(vibration) || 0.5;
    const hum = parseFloat(humidity) || 50;
    const load = parseFloat(loadStress) || 100;

    // If Python daemon is not ready, use fallback heuristic prediction
    if (!isReady || !pythonDaemon) {
        const result = fallbackPredict(temp, vib, hum, load);
        return res.status(200).json(new ApiResponse(200, result, 'Prediction generated (fallback mode)'));
    }

    const inputData = JSON.stringify({
        temperature: temp,
        vibration: vib,
        humidity: hum,
        loadStress: load
    });

    // Add a timeout to prevent hanging if daemon crashes mid-request
    const timeout = setTimeout(() => {
        const idx = requestQueue.findIndex(item => item.res === res);
        if (idx !== -1) {
            requestQueue.splice(idx, 1);
            const result = fallbackPredict(temp, vib, hum, load);
            res.status(200).json(new ApiResponse(200, result, 'Prediction generated (fallback - timeout)'));
        }
    }, 5000);

    // Push response object to queue and write to Python stdin instantaneously
    requestQueue.push({ res, timeout });
    pythonDaemon.stdin.write(inputData + '\n');
});
