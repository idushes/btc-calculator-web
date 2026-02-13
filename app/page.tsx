import { Metadata } from "next";
import Calculator from "./components/Calculator";
import { decodeShareState, formatShareDescription } from "./lib/shareCodec";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const encoded = typeof params.s === "string" ? params.s : undefined;

  if (encoded) {
    const state = decodeShareState(encoded);
    if (state) {
      const description = formatShareDescription(state);
      return {
        title: "BTC Mining Cost",
        description,
        openGraph: {
          title: "BTC Mining Cost",
          description,
          type: "website",
        },
      };
    }
  }

  return {
    title: "BTC Mining Cost",
    description: "Calculate the energy floor price for Bitcoin mining based on hardware efficiency and electricity costs.",
  };
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Calculator />
    </main>
  );
}
