import { EmergencyContacts } from "@/components/EmergencyContacts";
import { PanicZone } from "@/components/PanicZone";
import { UserGuide } from "@/components/UserGuide";

export default function HomePage() {
  return (
    <>
      <EmergencyContacts />
      <PanicZone />
      <UserGuide />
    </>
  );
}
