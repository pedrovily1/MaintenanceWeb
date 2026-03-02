import { T } from "@/lib/tokens";

type AvatarProps = {
  name: string;
  color?: string;
  size?: number;
  imageUrl?: string;
};

export const Avatar = ({ name, color = T.blue, size = 30, imageUrl }: AvatarProps) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: imageUrl ? undefined : `linear-gradient(145deg,${color},${color}88)`,
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.38,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
      boxShadow: `0 0 0 1.5px ${T.surface},0 0 0 3px ${color}44`,
    }}
  >
    {!imageUrl && name ? name[0].toUpperCase() : null}
  </div>
);
