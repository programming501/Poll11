import React from 'react';
import { useSponsors } from '../hooks/useResults';
import { Skeleton } from '@/components/ui/skeleton';

const SponsorSection = () => {
  const { data: sponsors, isLoading } = useSponsors();

  if (isLoading) return <Skeleton className="h-24 w-full rounded-3xl bg-secondary/30" />;
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">Partners</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-8">
        {sponsors.map(sponsor => (
          <a 
            key={sponsor.id} 
            href={sponsor.link_url || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
          >
            {sponsor.image_url ? (
              <img 
                src={sponsor.image_url} 
                alt={sponsor.name || 'Sponsor'} 
                className="h-20 max-w-[240px] object-contain shadow-lg rounded-xl border border-white/10 bg-white/5"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            {/* Fallback text if image fails */}
            <span className="hidden text-sm font-bold text-white/60">
              {sponsor.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SponsorSection;
