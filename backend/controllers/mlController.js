import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pythonDaemon = null;
let isReady = false;
const requestQueue = [];

// Initialize Python model into memory once and communicate interactively
const startDaemon = () => {
    const scriptPath = path.join(__dirname, '../ml-service/predict_daemon.py');
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

    pythonDaemon = spawn(pythonCommand, [scriptPath]);

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
            const { res } = requestQueue.shift();
            try {
                const result = JSON.parse(cleanLine);
                if (result.error) {
                    res.status(500).json({ message: 'ML Logic Error', error: result.error });
                } else {
                    res.status(200).json(result);
                }
            } catch (err) {
                res.status(500).json({ message: 'Failed to parse ML output', raw: cleanLine });
            }
        }
    });

    pythonDaemon.stderr.on('data', (data) => {
        console.error("ML Daemon Warning:", data.toString());
    });

    pythonDaemon.on('close', (code) => {
        console.log(`ML Daemon disconnected. Reconnecting in 5 seconds...`);
        isReady = false;
        setTimeout(startDaemon, 5000);
    });
};

// Start immediately when the server boots
startDaemon();

// @desc    Predict structural risk using fast persistent Python Daemon
// @route   POST /api/ml/predict
// @access  Private
export const predictRisk = (req, res) => {
    try {
        if (!isReady || !pythonDaemon) {
            return res.status(503).json({ message: 'ML Engine is still loading into memory. Please wait a few seconds.' });
        }

        const { temperature, vibration, humidity, loadStress } = req.body;

        const inputData = JSON.stringify({
            temperature: parseFloat(temperature) || 25,
            vibration: parseFloat(vibration) || 0.5,
            humidity: parseFloat(humidity) || 50,
            loadStress: parseFloat(loadStress) || 100
        });

        // Push response object to queue and write to Python stdin instantaneously
        requestQueue.push({ res });
        pythonDaemon.stdin.write(inputData + '\n');

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
