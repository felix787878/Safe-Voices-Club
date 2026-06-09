import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const CommunityMap = nextDynamic(
  () => import("@/components/CommunityMap").then((m) => m.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-gray-500">Memuat peta...</p>
      </div>
    ),
  }
);

export default function PetaPage() {
  return <CommunityMap />;
}
