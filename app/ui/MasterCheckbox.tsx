"use client";

import React from "react";

export default function MasterCheckbox() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxes = document.getElementsByClassName("row-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      (checkboxes[i] as HTMLInputElement).checked = e.target.checked;
    }
  };

  return (
    <input
      type="checkbox"
      id="master-checkbox"
      onChange={handleChange}
    />
  );
}