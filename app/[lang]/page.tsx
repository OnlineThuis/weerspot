import MapWrapper from "@/components/map/MapWrapper";

export default function Home({ params }: { params: { lang: string } }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-100 z-0">
      <MapWrapper lang={params.lang} />
    </div>
  );
}
