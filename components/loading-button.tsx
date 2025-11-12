import { Loader } from "@deemlol/next-icons";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function LoadingButton({
  children,
  isLoading,
  ...props
}: Props) {
  return (
    <button disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <Loader
          size={20}
          className="mx-auto my-0.5 text-slate-100 animate-spin"
        />
      ) : (
        children
      )}
    </button>
  );
}
