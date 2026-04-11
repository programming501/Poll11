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
      
      <div className="flex flex-wrap justify-center gap-6">
        {sponsors.map(sponsor => (
          <a 
            key={sponsor.id} 
            href={sponsor.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-40 hover:opacity-100 transition-opacity duration-300"
          >
            <img 
              src={sponsor.image_url} 
              alt={sponsor.name} 
              className="h-8 object-contain grayscale"
              referrerPolicy="no-referrer"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SponsorSection;
