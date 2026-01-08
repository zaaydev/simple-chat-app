import React from "react";

const SkeletonContactCard = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-zinc-800/60 sm:flex-row flex-col sm:gap-4 gap-0">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-zinc-700/60 animate-pulse" />

      {/* Text - hidden on mobile */}
      <div className="hidden sm:flex flex-1 space-y-2">
        <div className="flex-1 space-y-2">
          <div className="w-32 h-3 rounded bg-zinc-700/60 animate-pulse" />
          <div className="w-20 h-2 rounded bg-zinc-700/40 animate-pulse" />
        </div>

        {/* Status dot */}
        <div className="w-2 h-2 rounded-full bg-zinc-700/50 animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonContactCard;