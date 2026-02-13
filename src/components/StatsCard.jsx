import React from 'react';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';

const StatsCard = ({ icon: Icon, title, value, change, positive }) => {
    return (
        <div className="bg-gradient-to-br from-navy-800 to-navy-700 border-2 border-navy-600 rounded-2xl p-6 hover:border-primary-purple transition-all duration-300 hover:shadow-xl hover:shadow-primary-purple/30 group">
            <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-purple to-primary-blue rounded-xl flex items-center justify-center shadow-lg shadow-primary-purple/40 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white text-2xl" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full ${positive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {positive ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                    <span>{change}</span>
                </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-gray-300 text-sm font-medium">{title}</p>
        </div>
    );
};

export default StatsCard;
