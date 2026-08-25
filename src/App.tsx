import { Header } from './components/Header';
import { Catalog } from './components/Catalog';

function App() {
  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Header />
        <Catalog />
      </main>
    </div>
  );
}

export default App;