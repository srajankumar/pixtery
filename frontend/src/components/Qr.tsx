import React, { useEffect, useState } from "react";
import axios from "axios";
import NextImage from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const Qr = ({ id }: { id: string }) => {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const response = await axios.get(
          `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://pixtery.vercel.app/${id}&color=042F21&bgcolor=DFECE8`,
          {
            responseType: "arraybuffer", // Ensure binary data is correctly received
          }
        );

        const base64Image = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        setQrCodeImage(base64Image);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQRCode();
  }, [id]);

  const handleQrCodeLoad = () => {
    setQrCodeLoaded(true);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {qrCodeImage ? (
        <NextImage
          width={250}
          height={250}
          src={`data:image/png;base64,${qrCodeImage}`}
          alt={id}
          className="w-40 h-40 p-3 border-4 border-[#209770] rounded-2xl"
          onLoad={handleQrCodeLoad}
        />
      ) : (
        <Skeleton className="w-40 h-40 rounded-2xl" />
      )}
    </div>
  );
};

export default Qr;
