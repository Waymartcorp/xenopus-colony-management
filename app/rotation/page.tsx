// This page now redirects conceptually to /bins which is the primary bin-centered view.
// Keeping this route for backward compatibility but pointing users to the new structure.

import { redirect } from "next/navigation";

export default function RotationPage() {
  redirect("/bins");
}
