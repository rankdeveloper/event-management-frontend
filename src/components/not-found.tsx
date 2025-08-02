import { AlertTriangle } from "lucide-react";

type props = {
  message: string;
  className?: string;
};

export default function NotFound({ message, className = "" }: props) {
  return (
    <div
      className={`text-indigo-600 text-base my-auto mx-auto flex items-center gap-2 ${className}`}
    >
      <div className="flex flex-col items-center justify-center ">
        <AlertTriangle className="text-red-500  h-8 w-8" />
        <span>{message}</span>
      </div>
    </div>
  );
}
