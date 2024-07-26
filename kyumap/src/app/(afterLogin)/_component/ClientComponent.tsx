"use client";

import ResponsiveNav from "./ResponsiveNav";
import useDeviceSize from "./useDeviceSize";

export default function ClientComponent() {
  const { isMobile } = useDeviceSize();
  return <>{isMobile && <ResponsiveNav />}</>;
}
