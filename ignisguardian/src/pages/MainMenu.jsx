import React, { useState, useEffect } from 'react';
import { Flame, Bell, Thermometer, Wind, MapPin, AlertTriangle, CheckCircle, Activity, Settings, Users, Home } from 'lucide-react';

export default function FireAlarmDashboard() {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Phòng khách', location: 'Tầng 1', temp: 25, smoke: 15, status: 'normal', battery: 85 },
    { id: 2, name: 'Phòng ngủ', location: 'Tầng 2', temp: 23, smoke: 10, status: 'normal', battery: 92 },
    { id: 3, name: 'Nhà bếp', location: 'Tầng 1', temp: 45, smoke: 65, status: 'warning', battery: 78 },
    { id: 4, name: 'Garage', location: 'Tầng 1', temp: 28, smoke: 20, status: 'normal', battery: 88 }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, device: 'Nhà bếp', message: 'Phát hiện khói bất thường', time: '2 phút trước', type: 'warning' },
    { id: 2, device: 'Phòng khách', message: 'Pin yếu cần thay', time: '1 giờ trước', type: 'info' }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        temp: device.temp + (Math.random() - 0.5) * 2,
        smoke: Math.max(0, Math.min(100, device.smoke + (Math.random() - 0.5) * 5))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'normal': return 'An toàn';
      case 'warning': return 'Cảnh báo';
      case 'danger': return 'Nguy hiểm';
      default: return 'Không rõ';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl shadow-lg shadow-orange-500/50">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Hệ Thống Cảnh Báo Cháy</h1>
                <p className="text-sm text-gray-300">Giám sát từ xa IoT</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex gap-2">
            {['dashboard', 'devices', 'alerts', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-all ${
                  activeTab === tab 
                    ? 'text-white border-b-2 border-orange-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'dashboard' && 'Tổng quan'}
                {tab === 'devices' && 'Thiết bị'}
                {tab === 'alerts' && 'Cảnh báo'}
                {tab === 'settings' && 'Cài đặt'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/30 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
              <span className="text-3xl font-bold text-white">{devices.filter(d => d.status === 'normal').length}</span>
            </div>
            <p className="text-green-200 font-medium">Thiết bị an toàn</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500/30 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-yellow-300" />
              </div>
              <span className="text-3xl font-bold text-white">{devices.filter(d => d.status === 'warning').length}</span>
            </div>
            <p className="text-yellow-200 font-medium">Cảnh báo</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/30 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-blue-300" />
              </div>
              <span className="text-3xl font-bold text-white">{devices.length}</span>
            </div>
            <p className="text-blue-200 font-medium">Tổng thiết bị</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/30 p-3 rounded-xl">
                <Home className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-3xl font-bold text-white">2</span>
            </div>
            <p className="text-purple-200 font-medium">Địa điểm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Devices List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Thiết bị giám sát</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.map(device => (
                <div key={device.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{device.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{device.location}</span>
                      </div>
                    </div>
                    <div className={`${getStatusColor(device.status)} px-3 py-1 rounded-full text-white text-xs font-medium`}>
                      {getStatusText(device.status)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-orange-400" />
                        <span className="text-gray-300">Nhiệt độ</span>
                      </div>
                      <span className="text-white font-bold text-lg">{device.temp.toFixed(1)}°C</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">Khói</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${device.smoke > 50 ? 'bg-red-500' : device.smoke > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${device.smoke}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-bold">{device.smoke.toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-sm text-gray-400">Pin</span>
                      <span className="text-sm text-white font-medium">{device.battery}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Panel */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Thông báo gần đây</h2>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-xl border ${
                    alert.type === 'warning' 
                      ? 'bg-yellow-500/20 border-yellow-500/50' 
                      : 'bg-blue-500/20 border-blue-500/50'
                  }`}>
                    <div className="flex items-start gap-3">
                      {alert.type === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Bell className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">{alert.device}</p>
                        <p className="text-gray-300 text-sm mb-2">{alert.message}</p>
                        <p className="text-gray-400 text-xs">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all">
                Xem tất cả thông báo
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Hành động nhanh</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl text-white font-medium transition-all shadow-lg">
                  Kiểm tra tất cả thiết bị
                </button>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all">
                  Tắt âm thanh cảnh báo
                </button>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all">
                  Xuất báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}