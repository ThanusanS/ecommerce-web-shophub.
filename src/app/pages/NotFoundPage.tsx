import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-block bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] px-6 py-3 rounded-md font-semibold transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
