import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ duration = 10000, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      expand={true}
      visibleToasts={9}
      gap={8}
      duration={duration}
      toastOptions={{
        duration,
        classNames: {
          toast:
            "group toast bg-black/80 backdrop-blur-lg border border-white/20 text-white shadow-xl rounded-xl",
          description: "text-gray-400",
          actionButton: "bg-ktsa-primary text-black font-semibold",
          cancelButton: "bg-white/10 text-gray-300",
          success:
            "border-green-500/30 bg-black/80 [&>[data-icon]]:text-green-400",
          error:
            "border-red-500/30 bg-black/80 [&>[data-icon]]:text-red-400",
          warning:
            "border-yellow-500/30 bg-black/80 [&>[data-icon]]:text-yellow-400",
          info: "border-ktsa-accent/30 bg-black/80 [&>[data-icon]]:text-ktsa-accent",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
