import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// 必要なChart.jsのモジュールを登録
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export function StatsCharts() {
    // 人気の仮眠スタイルデータ (Doughnut)
    const doughnutData = {
        labels: ['デスク突っ伏し', '背もたれ120度', '背もたれ150度', '腕などクッション代わり', 'その他'],
        datasets: [
            {
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.9)',   // indigo-500
                    'rgba(59, 130, 246, 0.9)',   // blue-500
                    'rgba(16, 185, 129, 0.9)',   // emerald-500
                    'rgba(245, 158, 11, 0.9)',   // amber-500
                    'rgba(156, 163, 175, 0.9)',  // gray-400
                ],
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    // 仮眠時間とリフレッシュ度の相関 (Bar)
    const barData = {
        labels: ['10~15分', '15~20分', '20~30分', '30~60分', '1時間以上'],
        datasets: [
            {
                label: 'リフレッシュ実感度 (%)',
                data: [70, 95, 85, 40, 20],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderRadius: 6,
                barPercentage: 0.6,
            },
        ],
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: { family: "'Inter', sans-serif" }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                padding: 12,
                titleFont: { size: 14, family: "'Inter', sans-serif" },
                bodyFont: { size: 13, family: "'Inter', sans-serif" },
                cornerRadius: 8,
            }
        },
    };

    const barOptions = {
        ...commonOptions,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(243, 244, 246, 1)' }, // border-gray-100
                border: { dash: [4, 4] }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 mt-12 mb-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 flex flex-col items-center transition-transform hover:-translate-y-1 duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-indigo-600">💺</span> 人気の仮眠スタイル
                </h3>
                <div className="w-full h-[280px] relative">
                    <Doughnut data={doughnutData} options={commonOptions} />
                </div>
                <p className="text-sm xl:text-base text-gray-500 mt-6 text-center leading-relaxed">
                    「デスクに突っ伏す」スタイルが依然として人気ですが、最近は「背もたれ120度」で首枕を使ったリラックス姿勢の投稿も急増中です！
                </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 flex flex-col items-center transition-transform hover:-translate-y-1 duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-blue-500">⚡️</span> 仮眠時間とリフレッシュ度
                </h3>
                <div className="w-full h-[280px] relative">
                    <Bar data={barData} options={barOptions} />
                </div>
                <p className="text-sm xl:text-base text-gray-500 mt-6 text-center leading-relaxed">
                    15分〜20分の「パワーナップ」が最も高いリフレッシュ効果を生み出し、深い眠りに入りすぎるのを防ぐ最適解のようです。
                </p>
            </div>
        </div>
    );
}
