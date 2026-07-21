import React from 'react';
import { Globe, Crosshair, Shield, Users, Clock, Bookmark } from 'lucide-react';

export default function IconSidebar() {
  return (
    <div className="w-[50px] bg-bg-sidebar border-r border-border-main flex flex-col items-center py-4 gap-6 text-text-muted shrink-0 h-full">
      <button className="text-accent-yellow hover:text-accent-yellow-dim transition-colors"><Globe size={20} /></button>
      <button className="hover:text-text-main transition-colors"><Crosshair size={20} /></button>
      <button className="hover:text-text-main transition-colors"><Shield size={20} /></button>
      <button className="hover:text-text-main transition-colors"><Users size={20} /></button>
      <button className="hover:text-text-main transition-colors"><Clock size={20} /></button>
      <button className="hover:text-text-main transition-colors"><Bookmark size={20} /></button>
    </div>
  );
}
