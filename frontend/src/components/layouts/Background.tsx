import { ReactNode } from "@tanstack/react-router";

const Background = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark transition-colors duration-200">
      {children}
    </div>
  );
};

export default Background;
