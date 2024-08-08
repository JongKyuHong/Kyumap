"use client";

import React, { useState } from "react";
import SearchTab from "../../_component/SearchTab";

export default function page() {
  const mountedProps = () => {
    console.log("");
  };

  return <SearchTab onClickMounted={mountedProps} />;
}
