import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MapEmbedProps {
  address?: string;
  className?: string;
}

export default function MapEmbed({ address = "123 Rental Street, New York", className }: MapEmbedProps) {
  // In a real app, we would encode the address and use the Google Maps API
  const encodedAddress = encodeURIComponent(address);
  
  return (
    <AspectRatio ratio={16 / 9} className={className}>
      <div className="bg-gray-200 w-full h-full flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">Google Map Integration would be here</span>
          <br />
          <span className="text-gray-400 text-sm">{address}</span>
        </div>
      </div>
    </AspectRatio>
  );
}
