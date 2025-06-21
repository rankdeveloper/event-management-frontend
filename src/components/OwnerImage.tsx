export default function OwnerImage({
  image,
  className,
}: {
  image: string;
  className?: string;
}) {
  return <img src={image} alt="owner" className={className} />;
}
