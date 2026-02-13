import React from 'react';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';

const StatsCard = ({ icon: Icon, title, value, change, positive }) => {
    return (
        <div className="stat-card-wrapper bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100 group relative overflow-hidden">
            {/* Light overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300 floating-element">
                        <Icon className="text-white text-2xl" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full ${positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {positive ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                        <span>{change}</span>
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
                <p className="text-gray-600 text-sm font-medium">{title}</p>
            </div>
        </div>
    );
};

export default StatsCard;
