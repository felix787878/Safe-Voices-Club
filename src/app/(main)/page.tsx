import { EmergencyContacts } from "@/components/EmergencyContacts";
import FeatureCarousel from "@/components/FeatureCarousel";
import { PanicZone } from "@/components/PanicZone";
import { UserGuide } from "@/components/UserGuide";

export default function HomePage() {
  return (
    <>
      <EmergencyContacts />
      <PanicZone />
      <FeatureCarousel />
      <UserGuide />
    </>
  );
}
