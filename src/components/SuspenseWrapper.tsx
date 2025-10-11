import { Suspense } from "react";
import Spinner from "./Spinner";

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ children }) => {
  return (
    <Suspense fallback={<Spinner />}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;