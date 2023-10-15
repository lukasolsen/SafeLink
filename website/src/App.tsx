const App: React.FC = () => {
  return (
    <>
      <div className="flex flex-row justify-between container mx-auto mt-16">
        <section className="w-6/12">
          <span className="text-xl font-bold text-sky-700 select-none whitespace-pre-line">
            - SafeLink
          </span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
            A better way to manage your clients.
          </h1>
          <p className="text-gray-500 mt-2">
            A way to keep track of your clients, and their security.
          </p>
          <div className="flex flex-row space-x-2 items-center mt-8 justify-evenly mx-auto">
            <a
              href={"/register"}
              className="border border-sky-500 hover:border-sky-600 text-sky-500 px-4 py-2 rounded-md text-center"
            >
              Try it out
            </a>
            <a href={"/login"} className="text-sky-500">
              Login
            </a>
          </div>
        </section>
        <section></section>
      </div>
    </>
  );
};

export default App;
