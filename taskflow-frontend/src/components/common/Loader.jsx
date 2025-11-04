const Loader = ({ text = "Chargement..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-background z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
      <div className="text-center text-muted-foreground text-sm">
        {text}
      </div>
    </div>
  );
};

export default Loader;