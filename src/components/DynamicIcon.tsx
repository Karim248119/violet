import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

export type IconName = keyof typeof Icons;

interface IconProps extends LucideProps {
  name: IconName;
}

const DynamicIcon = ({ name, ...props }: IconProps) => {
  const IconComponent = Icons[name] as React.ComponentType<LucideProps>;

  if (IconComponent) {
    return <IconComponent {...props} />;
  }

  console.log(`Icon "${name}" is not a valid Lucide icon.`);
  return null;
};

export default DynamicIcon;
