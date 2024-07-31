import NavTab from "./NavTab";

type Props = {
  me: any;
};

export default async function Nav({ me }: Props) {
  return <NavTab session={me} />;
}
