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
            alt="Logo de Ejemplo de integración Gokei Spot"
            width={75}
            height={75}
          />
        </Link>
        <button
          onClick={() => setShowModal(true)}
        >
          Configuración
        </button>
        <Link href="https://gokei.readme.io/" target="_blank">
          <p className="text-center text-lg font-semibold">Ver documentación</p>
        </Link>
      </div>
    </nav>
  );
};
