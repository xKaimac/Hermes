const HermesLogo = () => {
  return (
    <div className="max-w-4/5 mb-16 flex flex-col items-center">
      <div className="relative flex max-h-full max-w-full items-center justify-center">
        <span className="text-text-light-secondary dark:text-text-dark-secondary absolute left-0 top-0 -translate-y-full transform text-xl font-semibold">
          Welcome to
        </span>
        <h1 className="md:text-11xl text-primary dark:text-primary-light text-7xl font-extrabold tracking-tighter sm:text-9xl">
          Hermes
        </h1>
      </div>
    </div>
  );
};

export default HermesLogo;
