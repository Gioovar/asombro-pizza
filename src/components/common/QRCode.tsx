"use client";

import Image from "next/image";

interface QRCodeProps {
  data: string;
  size?: number;
}

export function QRCode({ data, size = 200 }: QRCodeProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

  return (
    <div className="bg-white p-3 rounded-2xl shadow-inner inline-block">
      <Image 
        src={qrUrl} 
        alt="QR Code" 
        width={size} 
        height={size} 
        className="rounded-lg"
      />
    </div>
  );
}
