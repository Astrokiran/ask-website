'use client';

import { useState } from 'react';

// Add your YouTube video IDs here
// To get the video ID: From URL https://www.youtube.com/watch?v=s5X7OdoOzhA -> use "s5X7OdoOzhA"
const videos = [
  {
    id: "s5X7OdoOzhA",
    title: "🔥 Shiva Tandava Stotram | Most Powerful Shiva Mantra | Har Har Mahadev 🙏",
    description: "🔥 Shiva Tandava Stotram 🔥🙏 Composed by Ravana, the great devotee of Lord Shiva 🕉️ This powerful stotram describes the cosmic dance (Tandava) of Lord Shiva — the dance of creation 🌍, preservation ✨, and destruction 🔥."
  },
  {
    id: "X_oNX3Fu_xc",
    title: "🌺 Kamakhya Devi | Goddess of Desire, Power & Fertility 🙏 | Jai Maa Kamakhya 🕉️",
    description: "🌺 Dive into the divine energy of Kamakhya Devi, the revered Goddess of Desire, Power, and Fertility. This spiritual video offers a glimpse into her sacred abode in Assam, India, and highlights her significance in Hindu mythology. Experience the powerful chants and hymns dedicated to Maa Kamakhya, invoking her blessings for prosperity, strength, and spiritual growth. 🙏🕉️"
  },
  {
    id: "o_STTTD78cU",
    title: "Shani Mantra 108 Times | Om Praam Preem Praum | Powerful Chanting",
    description: "🕉️ Experience the transformative power of the Shani Beej Mantra chanted 108 times. This ancient Vedic mantra (Om Praam Preem Praum Sah Shanaischaraya Namah) brings relief from Saturn's challenges, removes obstacles, and attracts divine blessings."
  },
  {
    id: "-bt2D1QP9Jc",
    title: "Chandra Beej Mantra 108 Times | Om Shraam Shreem Shraum | Moon Mantra for Peace",
    description: "🌙 Experience the soothing power of the Chandra Beej Mantra chanted 108 times. This sacred Moon mantra (Om Shraam Shreem Shraum Sah Chandraya Namah) brings emotional balance, mental peace, and divine lunar blessings into your life."
  },
  // Add more videos here
  // {
  //   id: "YOUR_VIDEO_ID",
  //   title: "Video Title",
  //   description: "Video Description"
  // },
];

export function MusicPlayer() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Video Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No videos available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
