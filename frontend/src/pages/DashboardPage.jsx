import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { Thermometer, Activity, Droplets, Weight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DataCard from '../components/DataCard';
import ThreeDBuilding from '../components/ThreeDBuilding';
import { motion } from 'framer-motion';

const MAX_DATA_POINTS = 30;

export default function DashboardPage() {
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

    // The WOW Factor Demo Hooks
    useEffect(() => {
        let interval;
        let timeTicker = MAX_DATA_POINTS;

        // Timer intervals
        const phaseNormalInterval = 1000;
        const phaseAnomalyStart = 10000; // T+10s
        const phaseRecalibrate = 14000; // T+14s
        const phaseRecovered = 15000;   // T+15s

        const startSimulation = () => {
            let isSimulatedAnomaly = false;

            // Update Chart Data loop
            interval = setInterval(() => {
                timeTicker++;

                // Generate random realistic waves
                let newVib = isSimulatedAnomaly ? Math.random() * 80 + 100 : Math.random() * 15 + 20;
                let newLoad = isSimulatedAnomaly ? Math.random() * 60 + 120 : Math.random() * 20 + 30;

                setData(prev => {
                    const newData = [...prev.slice(1), { time: timeTicker, vibration: newVib, load: newLoad }];
                    return newData;
                });

                // Update live stats text
                setSensors(prev => ({
                    temp: { value: isSimulatedAnomaly ? 28 : (24 + Math.random()), trend: 1.2, status: isSimulatedAnomaly ? 'warning' : 'normal' },
                    vib: { value: parseFloat(newVib / 100).toFixed(2), trend: isSimulatedAnomaly ? 45 : 0.1, status: isSimulatedAnomaly ? 'critical' : 'normal' },
                    hum: { value: Math.floor(45 + Math.random() * 5), trend: -2.0, status: 'normal' },
                    load: { value: Math.floor(newLoad * 1.5), trend: isSimulatedAnomaly ? 80 : 5.4, status: isSimulatedAnomaly ? 'critical' : 'normal' }
                }));

            }, phaseNormalInterval);

            // Trigger Anomaly
            setTimeout(() => {
                isSimulatedAnomaly = true;
                setStatus('anomaly');
                toast.error("⚠ Risk Detected: Excessive structural vibration.", {
                    duration: 5000,
                    style: { border: '1px solid #ef4444', backgroundColor: 'rgba(50, 0, 0, 0.8)' }
                });
            }, phaseAnomalyStart);

            // AI Recalibrates
            setTimeout(() => {
                setStatus('recalibrating');
                toast.success("✅ AI Recalibration: Thicker beam design applied.", {
                    duration: 4000,
                    icon: '🤖',
                });
            }, phaseRecalibrate);

            // Recovered
            setTimeout(() => {
                isSimulatedAnomaly = false;
                setStatus('normal');
                toast("System Stabilized. Re-engaging standard monitoring.", {
                    icon: '🟢',
                    style: { color: '#4ade80', borderColor: '#4ade80' }
                });
            }, phaseRecovered);
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

                <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">

                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">Real-Time Twin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Monitor</span></h2>
                            <p className="text-gray-400 text-sm font-medium">Monitoring Structural Integrity & Load Distribution.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">

                        {/* Left Panel: Sensor Metrics */}
                        <div className="lg:col-span-3 flex flex-col gap-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Live Node Feed</h4>
                            <DataCard title="Temperature" value={`${Number(sensors.temp.value).toFixed(1)}`} unit="°C" icon={Thermometer} colorClass="text-orange-400" status={sensors.temp.status} trend={sensors.temp.trend} />
                            <DataCard title="Vibration (Hz)" value={sensors.vib.value} unit="Hz" icon={Activity} colorClass="text-cyan-400" status={sensors.vib.status} trend={sensors.vib.trend} />
                            <DataCard title="Humidity" value={sensors.hum.value} unit="%" icon={Droplets} colorClass="text-blue-400" status={sensors.hum.status} trend={sensors.hum.trend} />
                            <DataCard title="Load Stress" value={sensors.load.value} unit="kN/m²" icon={Weight} colorClass="text-purple-400" status={sensors.load.status} trend={sensors.load.trend} />
                        </div>

                        {/* Center Panel: 3D Visualization */}
                        <div className={`lg:col-span-5 glassmorphism rounded-[2rem] border relative overflow-hidden transition-all duration-500 shadow-2xl flex flex-col
              ${status === 'anomaly' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}
                        >
                            <div className="absolute top-4 left-6 z-10">
                                <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/30">
                                    BIM Wireframe Render
                                </span>
                            </div>
                            <ThreeDBuilding isAnomaly={isAnomaly} />
                            <div className="absolute bottom-4 right-6 pointer-events-none text-xs text-gray-400 opacity-50 font-mono text-right">
                                System.Render.Wireframe <br /> v4.5.1
                            </div>
                        </div>

                        {/* Right Panel: Analytics Chart */}
                        <div className="lg:col-span-4 flex flex-col gap-6">

                            <div className={`flex-1 glassmorphism rounded-3xl p-6 border relative transition-colors duration-500 ${isAnomaly ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-gray-900/60' : 'border-white/10 bg-gray-950/60'}`}>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-bold tracking-widest uppercase text-white">Stress Analytics</h3>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">L60s Window Array</p>
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
                                            <h5 className="font-bold tracking-widest text-red-400 text-sm">MITIGATION AI ENGAGED</h5>
                                            <p className="text-red-300 text-xs font-medium">Recalibrating structural coefficients...</p>
                                        </div>
                                        <div className="w-6 h-6 border-t-2 border-r-2 border-red-400 rounded-full animate-spin"></div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Smaller bottom card */}
                            <div className="glassmorphism rounded-2xl p-5 border border-white/5 flex gap-4 items-center bg-gray-900/40">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-300 text-sm uppercase tracking-wider">Predictive Engine</h4>
                                    <p className="text-gray-500 text-xs">Processing 1.4B parameters <span className="text-cyan-400">@ 4ms latency</span></p>
                                </div>
                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
