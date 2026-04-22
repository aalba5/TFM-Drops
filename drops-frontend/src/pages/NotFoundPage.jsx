import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-gray-500 mt-4 mb-8">Página no encontrada</p>
        <Link to="/habits">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
