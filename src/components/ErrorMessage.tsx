export default function ErrorMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return <p className={`${className} text-red-500 text-sm`}>{message}</p>;
}
