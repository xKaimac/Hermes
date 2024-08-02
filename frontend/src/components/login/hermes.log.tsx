const HermesLogo = () => {
  return (
    <div className="flex flex-col items-center mb-16 max-w-4/5">
      <div className="relative max-w-full max-h-full flex items-center justify-center">
        <span className="absolute top-0 left-0 text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary transform -translate-y-full">
          Welcome to
        </span>
        <h1 className="text-7xl sm:text-9xl font-extrabold text-primary dark:text-primary-light tracking-tighter">
          Hermes
        </h1>
      </div>
    </div>
  );
};

export default HermesLogo;
