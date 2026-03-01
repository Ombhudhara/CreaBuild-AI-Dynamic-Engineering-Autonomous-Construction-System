import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { Thermometer, Activity, Droplets, Weight, Settings } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataCard from '../components/DataCard';
import ThreeDBuilding from '../components/ThreeDBuilding';
import { motion } from 'framer-motion';
import api from '../services/api';

const MAX_DATA_POINTS = 30;

export default function DashboardPage() {
    const [mlStats, setMlStats] = useState({
        confidence: 99.9,
        riskLevel: 0,
        importance: null
    });
    const [data, setData] = useState(
        Array.from({ length: MAX_DATA_POINTS }, (_, i) => ({ time: i, vibration: 20, load: 30 }))
    );

    // Dashboard Status: 'normal' | 'anomaly' | 'recalibrating'
    const [status, setStatus] = useState('normal');
    const isAnomaly = status === 'anomaly';

    // Sensor Values
    const [sensors, setSensors] = useState({
        temp: { value: 24, trend: 1.2, status: 'normal' },
        vib: { value: 0.2, trend: 0.1, status: 'normal' },
        hum: { value: 45, trend: -2.0, status: 'normal' },
        load: { value: 120, trend: 5.4, status: 'normal' }
    });

    const [configData, setConfigData] = useState(null);

    // The WOW Factor Demo Hooks
    useEffect(() => {
        const savedConfig = localStorage.getItem('configData');
        if (savedConfig) {
            try {
                setConfigData(JSON.parse(savedConfig));
            } catch (e) {
                console.error("Failed to parse config string", e);
            }
        }

        let interval;
        let timeTicker = MAX_DATA_POINTS;
        let tickCount = 0;

        const startSimulation = () => {
            interval = setInterval(async () => {
                timeTicker++;
                tickCount++;

                // Generate random data
                let newTemp = 24 + Math.random() * 2;
                let newVib = Math.random() * 1.5;
                let newHum = 45 + Math.random() * 5;
                let newLoad = 100 + Math.random() * 40;

                // Sometimes trigger a random spike (2% chance each second) to see ML work
                if (Math.random() > 0.98) {
                    newVib = Math.random() * 80 + 100;
                    newLoad = Math.random() * 60 + 120;
                }

                setData(prev => {
                    const newData = [...prev.slice(1), { time: timeTicker, vibration: newVib, load: newLoad }];
                    return newData;
                });

                setSensors(prev => ({
                    temp: { value: newTemp, trend: 1.2, status: newTemp > 28 ? 'warning' : 'normal' },
                    vib: { value: newVib.toFixed(2), trend: 0.1, status: newVib > 2.0 ? 'critical' : 'normal' },
                    hum: { value: Math.floor(newHum), trend: -2.0, status: 'normal' },
                    load: { value: Math.floor(newLoad), trend: 5.4, status: newLoad > 140 ? 'critical' : 'normal' }
                }));

                // Call ML API every 5 seconds
                if (tickCount % 5 === 0) {
                    try {
                        const res = await api.post('/ml/predict', {
                            temperature: newTemp,
                            vibration: newVib,
                            humidity: newHum,
                            loadStress: newLoad
                        });

                        const { riskLevel, confidence, featureImportance } = res.data;

                        setMlStats({ riskLevel, confidence, importance: featureImportance });

                        setStatus(prevStatus => {
                            let nextStatus = prevStatus;
                            if (riskLevel === 2) {
                                if (prevStatus !== 'anomaly') {
                                    toast.error(`⚠ Warning: High Risk Predicted (${confidence.toFixed(1)}%)`, {
                                        style: { border: '1px solid #ef4444', backgroundColor: 'rgba(50, 0, 0, 0.8)' }
                                    });
                                }
                                nextStatus = 'anomaly';
                            } else if (riskLevel === 1) {
                                if (prevStatus !== 'warning' && prevStatus !== 'anomaly') {
                                    toast('Caution: Moderate Risk. Monitoring closely.', { icon: '⚠️' });
                                }
                                nextStatus = 'warning';
                            } else {
                                if (prevStatus === 'anomaly' || prevStatus === 'warning') {
                                    toast("All safe now. AI confirms normal status.", {
                                        icon: '🟢',
                                        style: { color: '#4ade80', borderColor: '#4ade80' }
                                    });
                                }
                                nextStatus = 'normal';
                            }
                            return nextStatus;
                        });

                    } catch (error) {
                        console.error("ML Prediction Failed:", error);
                    }
                }
            }, 1000);
        };

        startSimulation();
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden text-white font-sans antialiased relative">
            {/* Absolute Background Effects */}
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
            <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            {status === 'anomaly' && (
                <div className="absolute inset-0 z-0 bg-red-900/20 blur-[50px] pointer-events-none transition-all duration-300"></div>
            )}

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 z-10">
                <Header status={status === 'normal' ? 'active' : 'warning'} />

                <main className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Live 3D Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Monitor</span></h2>
                            <p className="text-gray-400 text-xs sm:text-sm font-medium">Watching Building Health and Weight Balance.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 h-auto lg:h-[calc(100vh-180px)] lg:min-h-[600px]">

                        {/* Left Panel: Sensor Metrics */}
                        <div className="lg:col-span-3 flex flex-col gap-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Live Sensor Data</h4>
                            <DataCard title="Temperature" value={`${Number(sensors.temp.value).toFixed(1)}`} unit="°C" icon={Thermometer} colorClass="text-orange-400" status={sensors.temp.status} trend={sensors.temp.trend} />
                            <DataCard title="Shaking (Hz)" value={sensors.vib.value} unit="Hz" icon={Activity} colorClass="text-cyan-400" status={sensors.vib.status} trend={sensors.vib.trend} />
                            <DataCard title="Moisture" value={sensors.hum.value} unit="%" icon={Droplets} colorClass="text-blue-400" status={sensors.hum.status} trend={sensors.hum.trend} />
                            <DataCard title="Weight Pressure" value={sensors.load.value} unit="kN/m²" icon={Weight} colorClass="text-purple-400" status={sensors.load.status} trend={sensors.load.trend} />

                            {configData && (
                                <div className="mt-4 glassmorphism rounded-2xl p-5 border border-cyan-500/20 bg-cyan-950/20">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Settings className="w-4 h-4 text-cyan-400" />
                                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Project Rules</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-xs text-gray-500 uppercase">Budget</span>
                                            <span className="text-sm font-mono text-cyan-300">${Number(configData.budget).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-xs text-gray-500 uppercase">Area</span>
                                            <span className="text-sm font-mono text-gray-200">{Number(configData.landSize).toLocaleString()} sqft</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-xs text-gray-500 uppercase">Material</span>
                                            <span className="text-sm font-bold text-gray-200">{configData.materialType}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500 uppercase">Load Type</span>
                                            <span className="text-sm font-bold text-gray-200">{configData.loadRequirements}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Center Panel: 3D Visualization */}
                        <div className={`lg:col-span-5 glassmorphism rounded-[2rem] border relative overflow-hidden transition-all duration-500 shadow-2xl flex flex-col
              ${status === 'anomaly' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}
                        >
                            <div className="absolute top-4 left-6 z-10">
                                <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/30">
                                    Live 3D Structure View
                                </span>
                            </div>
                            <ThreeDBuilding isAnomaly={isAnomaly} />
                            <div className="absolute bottom-4 right-6 pointer-events-none text-xs text-gray-400 opacity-50 font-mono text-right">
                                Live.3D.View <br /> v4.5.1
                            </div>
                        </div>

                        {/* Right Panel: Analytics Chart */}
                        <div className="lg:col-span-4 flex flex-col gap-6">

                            <div className={`flex-1 glassmorphism rounded-3xl p-6 border relative transition-colors duration-500 ${isAnomaly ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-gray-900/60' : 'border-white/10 bg-gray-950/60'}`}>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-bold tracking-widest uppercase text-white">Stress & Risk Charts</h3>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Past 60 Seconds Data</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                    </div>
                                </div>

                                <div className="w-full h-[300px] xl:h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={isAnomaly ? "#ef4444" : "#06b6d4"} stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor={isAnomaly ? "#ef4444" : "#06b6d4"} stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="time" hide={true} />
                                            <YAxis stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="load"
                                                stroke="#8b5cf6"
                                                fillOpacity={1}
                                                fill="url(#colorLoad)"
                                                isAnimationActive={false}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="vibration"
                                                stroke={isAnomaly ? "#ef4444" : "#06b6d4"}
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorVib)"
                                                isAnimationActive={false}
                                                className={isAnomaly ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {isAnomaly && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-6 left-6 right-6 glassmorphism bg-red-950/80 border border-red-500/50 p-4 rounded-xl flex items-center justify-between z-20"
                                    >
                                        <div>
                                            <h5 className="font-bold tracking-widest text-red-400 text-sm">AI FIXING PROBLEM</h5>
                                            <p className="text-red-300 text-xs font-medium">Adjusting building design to fix the issue...</p>
                                        </div>
                                        <div className="w-6 h-6 border-t-2 border-r-2 border-red-400 rounded-full animate-spin"></div>
                                    </motion.div>
                                )}
                            </div>

                            {/* ML Prediction Output */}
                            <div className="glassmorphism rounded-2xl p-5 border border-slate-700 flex flex-col gap-3 bg-slate-900/40">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mlStats.riskLevel === 2 ? 'bg-red-500/20 border-red-500/30' :
                                        mlStats.riskLevel === 1 ? 'bg-orange-500/20 border-orange-500/30' :
                                            'bg-sky-500/20 border-sky-500/30'
                                        } border`}>
                                        <Activity className={`w-5 h-5 ${mlStats.riskLevel === 2 ? 'text-red-400' :
                                            mlStats.riskLevel === 1 ? 'text-orange-400' :
                                                'text-sky-400'
                                            }`} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-300 text-sm uppercase tracking-wider">ML Prediction Engine</h4>
                                        <p className="text-slate-500 text-xs">
                                            Status: <span className={
                                                mlStats.riskLevel === 2 ? 'text-red-500 font-bold' :
                                                    mlStats.riskLevel === 1 ? 'text-orange-500 font-bold' :
                                                        'text-sky-400 font-bold'
                                            }>
                                                {mlStats.riskLevel === 2 ? 'HIGH RISK' : mlStats.riskLevel === 1 ? 'MEDIUM RISK' : 'LOW RISK'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg">
                                    <span className="text-xs text-slate-400 uppercase tracking-widest">Confidence</span>
                                    <span className="text-sm font-bold text-white">{mlStats.confidence.toFixed(1)}%</span>
                                </div>
                                {mlStats.importance && (
                                    <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                                        <span>Top Risk Factor:</span>
                                        <span className="text-orange-400 uppercase">
                                            {Object.entries(mlStats.importance).sort((a, b) => b[1] - a[1])[0][0]}
                                        </span>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
