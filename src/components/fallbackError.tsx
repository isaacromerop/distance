import { Skeleton } from "primereact/skeleton";

const FallbackError = (): React.ReactElement => {
  return (
    <div className="my-6 flex flex-col items-center justify-center">
      <i className="pi pi-refresh text-9xl"></i>
      <p>Oops! This is awkward... Try refreshing</p>
    </div>
  );
};

export default FallbackError;
