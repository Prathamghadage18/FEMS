import { Navbar, Footer, Header } from "../components";

const PageWraper = (PageComponent, id = null) =>
  function Page() {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <Header />
        <Navbar />
        <main className="flex-1 flex items-start justify-center w-full py-8 px-4 md:px-8 lg:px-16">
          <div className="w-full max-w-6xl">
            <PageComponent />
          </div>
        </main>
        <Footer />
      </div>
    );
  };

export default PageWraper;
