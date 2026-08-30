import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-card border border-navy/15 p-6 rounded-md shadow-sm space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-navy/10 rounded w-24"></div>
        <div className="h-5 bg-navy/10 rounded w-20"></div>
      </div>
      <div className="h-6 bg-navy/15 rounded w-3/4"></div>
      <div className="h-16 bg-paper rounded border border-navy/10"></div>
      <div className="space-y-2">
        <div className="h-4 bg-navy/10 rounded w-full"></div>
        <div className="h-4 bg-navy/10 rounded w-5/6"></div>
      </div>
      <div className="pt-4 border-t border-navy/10 flex justify-between">
        <div className="h-8 bg-navy/10 rounded w-20"></div>
        <div className="h-8 bg-navy/15 rounded w-28"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
