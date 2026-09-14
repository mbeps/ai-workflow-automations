import { AlertTriangleIcon } from "lucide-react";

interface ErrorViewProps {
  message?: string;
}

/**
 * A centered error state display with an alert icon and optional message.
 *
 * @author Maruf Bepary
 */
export const ErrorView = ({ message }: ErrorViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
