interface EmptyStateProps {
  image: string;
  title: string;
  subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ image, title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <img src={image} alt="No designs found" className="mb-6" />
      <p className="text-lg text-slate-800 font-semibold mb-2">{title}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
};

export default EmptyState;
