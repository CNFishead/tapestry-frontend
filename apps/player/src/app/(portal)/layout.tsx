import AuthGate from "@/components/authGate/AuthGate.component";
import PortalShell from "@/components/portalShell/PortalShell.component";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <PortalShell>{children}</PortalShell>
    </AuthGate>
  );
}
