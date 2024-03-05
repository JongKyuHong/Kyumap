"use client";

import { useMediaQuery } from "./useMediaQuery";

export default function useDeviceSize() {
  const isDesktop = useMediaQuery("(min-width: 1264px)");
  const isTablet = useMediaQuery("(min-width:768px) and (max-width:1263px)");
  const isMobile = useMediaQuery("(max-width:767px)");

  return { isDesktop, isTablet, isMobile };
}
