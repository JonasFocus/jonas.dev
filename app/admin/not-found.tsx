import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="admin-error-page">
      <h1>Record not found</h1>
      <p>This record may no longer be available.</p>
      <Link className="admin-button" href="/admin">
        Back to overview
      </Link>
    </div>
  );
}
