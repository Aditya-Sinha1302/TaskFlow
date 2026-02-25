import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Sector,
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { CheckCircle, Clock, ListTodo, Target, BarChart2, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { tasks } = useStore();
    const [trendView, setTrendView] = useState('bar'); // 'bar' or 'line'
    const [activeIndex, setActiveIndex] = useState(-1);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(-1);
    };

    const productivityTrends = useMemo(() => {
        // Generate last 7 days of the week names in order
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        }

        const trends = days.map(name => ({ name, high: 0, medium: 0, low: 0 }));

        tasks.forEach(task => {
            // If no createdAt (like initial mock data), assume it was created today
            const taskDate = task.createdAt ? new Date(task.createdAt) : new Date();
            const dayName = taskDate.toLocaleDateString('en-US', { weekday: 'short' });

            const bucket = trends.find(t => t.name === dayName);
            if (bucket) {
                const prio = task.priority || 'medium';
                if (bucket[prio] !== undefined) {
                    bucket[prio]++;
                }
            }
        });

        return trends;
    }, [tasks]);

    const stats = useMemo(() => {
        const total = tasks.length;
        const todo = tasks.filter(t => t.columnId === 'todo').length;
        const inProgress = tasks.filter(t => t.columnId === 'in-progress').length;
        const done = tasks.filter(t => t.columnId === 'done').length;
        const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

        return { total, todo, inProgress, done, completionRate };
    }, [tasks]);

    const chartData = [
        { name: 'To Do', value: stats.todo, color: 'var(--vibrant-todo)' },
        { name: 'In Progress', value: stats.inProgress, color: 'var(--vibrant-progress)' },
        { name: 'Done', value: stats.done, color: 'var(--vibrant-done)' },
    ].filter(item => item.value > 0);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="var(--bg-primary)" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of your project progress</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card vibrant-total">
                    <div className="stat-icon">
                        <ListTodo size={24} color="white" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Tasks</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                </div>
                <div className="stat-card vibrant-todo">
                    <div className="stat-icon">
                        <Clock size={24} color="white" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">To Do</span>
                        <span className="stat-value">{stats.todo}</span>
                    </div>
                </div>
                <div className="stat-card vibrant-progress">
                    <div className="stat-icon">
                        <Clock size={24} color="white" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">In Progress</span>
                        <span className="stat-value">{stats.inProgress}</span>
                    </div>
                </div>
                <div className="stat-card vibrant-done">
                    <div className="stat-icon">
                        <CheckCircle size={24} color="white" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{stats.done}</span>
                    </div>
                </div>
                <div className="stat-card vibrant-rate">
                    <div className="stat-icon">
                        <Target size={24} color="white" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Completion Rate</span>
                        <span className="stat-value">{stats.completionRate}%</span>
                    </div>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-card glass p-relative">
                    <div className="chart-header">
                        <h3>Productivity Trends</h3>
                        <div className="chart-toggles">
                            <button
                                className={`icon-btn ${trendView === 'bar' ? 'active' : ''}`}
                                onClick={() => setTrendView('bar')}
                                title="Bar Chart"
                            >
                                <BarChart2 size={18} />
                            </button>
                            <button
                                className={`icon-btn ${trendView === 'line' ? 'active' : ''}`}
                                onClick={() => setTrendView('line')}
                                title="Line Chart"
                            >
                                <TrendingUp size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            {trendView === 'bar' ? (
                                <BarChart data={productivityTrends} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                                    <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} allowDecimals={false} />
                                    <RechartsTooltip
                                        cursor={false}
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="high" name="High Priority" stackId="a" fill="var(--priority-high)" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="medium" name="Medium Priority" stackId="a" fill="var(--priority-medium)" />
                                    <Bar dataKey="low" name="Low Priority" stackId="a" fill="var(--priority-low)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            ) : (
                                <AreaChart data={productivityTrends} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--priority-high)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--priority-high)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--priority-medium)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--priority-medium)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--priority-low)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--priority-low)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                                    <YAxis
                                        stroke="var(--text-secondary)"
                                        tick={{ fill: 'var(--text-secondary)' }}
                                        allowDecimals={false}
                                        domain={[0, dataMax => {
                                            const maxStacked = Math.max(...productivityTrends.map(d => d.high + d.medium + d.low));
                                            return Math.max(dataMax, maxStacked);
                                        }]}
                                    />
                                    <RechartsTooltip
                                        cursor={false}
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="high" name="High Priority" stroke="var(--priority-high)" fillOpacity={1} fill="url(#colorHigh)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Area type="monotone" dataKey="medium" name="Medium Priority" stroke="var(--priority-medium)" fillOpacity={1} fill="url(#colorMedium)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Area type="monotone" dataKey="low" name="Low Priority" stroke="var(--priority-low)" fillOpacity={1} fill="url(#colorLow)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass">
                    <h3>Current Task Distribution</h3>
                    <div className="chart-container">
                        {tasks.length === 0 ? (
                            <div className="empty-chart">No tasks to display</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <defs>
                                        <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="2" dy="6" stdDeviation="4" floodOpacity="0.3" />
                                            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
                                        </filter>
                                        <filter id="shadow3dHover" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="3" dy="10" stdDeviation="6" floodOpacity="0.4" />
                                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
                                        </filter>
                                    </defs>
                                    <Pie
                                        activeIndex={activeIndex}
                                        isAnimationActive={false}
                                        activeShape={(props) => {
                                            const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, percent } = props;
                                            const RADIAN = Math.PI / 180;
                                            const midAngle = startAngle + (endAngle - startAngle) / 2;

                                            // Calculate the same position as the default label
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                            return (
                                                <g>
                                                    <Sector
                                                        cx={cx}
                                                        cy={cy}
                                                        innerRadius={innerRadius}
                                                        outerRadius={outerRadius + 8}
                                                        startAngle={startAngle}
                                                        endAngle={endAngle}
                                                        fill={fill}
                                                        filter="url(#shadow3dHover)"
                                                    />
                                                    <text x={x} y={y} fill="var(--bg-primary)" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700}>
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                </g>
                                            );
                                        }}
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        stroke="none"
                                        onMouseEnter={onPieEnter}
                                        onMouseLeave={onPieLeave}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} filter="url(#shadow3d)" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
