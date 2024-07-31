const HermesLogo = () => {
  return (
    <div className="flex flex-col items-center mb-16">
      <div className="relative">
        <span className="absolute top-0 left-0 text-xl font-semibold text-text-light-secondary dark:text-text-dark-secondary transform -translate-y-full">
          Welcome to
        </span>
        <h1 className="text-9xl font-extrabold text-primary dark:text-primary-light tracking-tighter">
          Hermes
        </h1>
      </div>
    </div>
  );
};

export default HermesLogo;
