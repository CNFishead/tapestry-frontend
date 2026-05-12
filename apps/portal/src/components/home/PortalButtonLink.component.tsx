"use client";

import { Button } from "@tapestry/ui";

type PortalButtonLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function PortalButtonLink({ href, children }: PortalButtonLinkProps) {
  return (
    <Button size="lg" type="button" onClick={() => window.location.assign(href)}>
      {children}
    </Button>
  );
}
