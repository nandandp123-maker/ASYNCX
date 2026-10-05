import React from 'react';
import { Language, MaterialItem, PoojaService, PageRoute } from '../types';
import { Hero } from '../components/Hero';
import { VedicOfferingsHub } from '../components/VedicOfferingsHub';

interface HomePageProps {
  lang: Language;
  onNavigate: (page: PageRoute) => void;
  onBookService?: (service: PoojaService) => void;
  onAddMaterial?: (item: MaterialItem) => void;
  onViewMaterialDetails?: (item: MaterialItem) => void;
  selectedItemIds?: Set<string>;
  materials?: MaterialItem[];
  services?: PoojaService[];
}

export const HomePage: React.FC<HomePageProps> = ({
  lang,
  onNavigate,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero
        lang={lang}
        onOpenBooking={() => onNavigate('booking')}
        onExploreServices={() => onNavigate('services')}
        onExploreMaterials={() => onNavigate('materials')}
      />

      {/* 2. Highlighted Vedic Offerings Hub (from user's handwritten diagram) */}
      <VedicOfferingsHub
        lang={lang}
        onNavigate={onNavigate}
        onOpenBooking={(_serviceName) => {
          onNavigate('booking');
        }}
      />
    </div>
  );
};
