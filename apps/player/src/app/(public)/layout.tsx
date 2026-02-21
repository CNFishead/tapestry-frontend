import PortalShell from "@/components/portalShell/PortalShell.component";
import PublicGate from "@/components/publicGate/PublicGate.component";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicGate>{children}
    </PublicGate>
  );
}
