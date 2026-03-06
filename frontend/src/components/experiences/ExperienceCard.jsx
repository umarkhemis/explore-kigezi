

import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';

export default function ExperienceCard({ experience }) {
  const {
    id, title, category, location, district,
    duration_display, price_formatted, cover_image,
    average_rating, total_reviews, host_name, host_photo,
  } = experience;

  return (
    <Link to={`/experiences/${id}`} className="card group overflow-hidden block hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={cover_image || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80'; }}
        />
        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-kigezi-text text-xs font-semibold px-3 py-1 rounded-full">
            {category.icon} {category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1 text-kigezi-muted text-xs mb-2">
          <span>📍</span>
          <span>{location || district}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-kigezi-text text-lg leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Host + Duration */}
        <div className="flex items-center gap-2 mb-3">
          {host_photo
            ? <img src={host_photo} alt={host_name} className="w-6 h-6 rounded-full object-cover" />
            : <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                {(host_name?.[0] || 'H').toUpperCase()}
              </div>
          }
          <span className="text-kigezi-muted text-xs">{host_name}</span>
          <span className="text-kigezi-border">•</span>
          <span className="text-kigezi-muted text-xs">⏱ {duration_display}</span>
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between pt-3 border-t border-kigezi-border">
          <div className="flex items-center gap-1">
            <StarRating value={average_rating} size="sm" showValue={false} />
            <span className="text-sm font-semibold text-kigezi-text">{Number(average_rating).toFixed(1)}</span>
            <span className="text-kigezi-muted text-xs">({total_reviews})</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-primary text-sm">{price_formatted}</div>
            <div className="text-kigezi-muted text-xs">per person</div>
          </div>
        </div>
      </div>
    </Link>
  );
}