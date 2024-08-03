import NavTab from "./NavTab";
import { auth } from "@/auth";

export default async function Nav() {
  const session = await auth();

  if (!session) return null;

  return <NavTab session={session} />;
}
