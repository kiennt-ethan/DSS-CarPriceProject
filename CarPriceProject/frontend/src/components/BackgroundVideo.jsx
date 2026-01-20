import React from 'react';
import carBgVideo from '../assets/car-bg.mp4';

const BackgroundVideo = ({ isDarkMode }) => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-100">
            <video
                autoPlay loop muted playsInline key="bg-video"
                className={`w-full h-full object-cover transition-opacity duration-700 ${isDarkMode ? 'opacity-40' : 'opacity-20' // Giảm opacity video ở Light mode
                    }`}
            >
                <source src={carBgVideo} type="video/mp4" />
            </video>

            {/* Lớp phủ Gradient */}
            <div className={`absolute inset-0 transition-all duration-700 ${isDarkMode
                    ? 'bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent'
                    : 'bg-white/60 backdrop-blur-[2px]' // Tăng độ trắng và blur nhẹ
                }`}></div>

            {/* Lớp phủ Gradient chéo nhẹ cho Light mode để tạo chiều sâu */}
            {!isDarkMode && (
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 via-transparent to-white/50 mix-blend-overlay"></div>
            )}
        </div>
    );
};

export default BackgroundVideo;