"use client";

import React from "react";

interface ConfirmationFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  action: (formData: FormData) => void;
  message?: string;
  children: React.ReactNode;
}

/**
 * A reusable Client Component form that prompts the user for confirmation before submission.
 * Useful for "Are you sure you want to update?" type scenarios in Server Components.
 */
export default function ConfirmationForm({
  action,
  message = "Are you sure you want to proceed?",
  children,
  ...props
}: ConfirmationFormProps) {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm(message)) {
      e.preventDefault();
      // Stop propagation if necessary to prevent other handlers from firing
      e.stopPropagation();
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}
