import Link from "next/link";
import Image from "next/image";
import { usePublicKey } from "~/hooks/use-public-key";

export const Navbar = () => {
  const { setShowModal } = usePublicKey();
  return (
    <nav className="bg-white">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
        <Link href="/">
          <Image
            src="/generic-telemedicine-logo.png"
            alt="Logo de Ejemplo de integración Skip Spot"
            width={75}
            height={75}
          />
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Configuración ejemplo
        </button>
        <Link href="https://gokei.readme.io/" target="_blank">
          <p className="text-center text-lg font-semibold">Ver documentación</p>
        </Link>
      </div>
    </nav>
  );
};
