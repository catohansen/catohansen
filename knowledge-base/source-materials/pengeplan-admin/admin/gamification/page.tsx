import { Metadata } from 'next';
import GamificationDashboard from '@/components/gamify/GamificationDashboard';

export const metadata: Metadata = {
  title: 'Spill-modus | Pengeplan Admin',
  description: 'Test hele spill-systemet med XP, oppdrag og modul-låsing',
};

export default function GamificationPage() {
  return <GamificationDashboard />;
}
