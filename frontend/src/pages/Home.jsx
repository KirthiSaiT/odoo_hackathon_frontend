import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="font-handwritten text-primary text-8xl font-bold">
          HOME Page
        </h1>
      </div>
    </div>
  );
};

export default Home;
