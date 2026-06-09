export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl mb-4">📡</p>
      <h1 className="text-xl font-bold text-primary mb-2">Tidak Ada Koneksi</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-xs">
        Anda sedang offline. Beberapa fitur seperti peta komunitas membutuhkan
        koneksi internet.
      </p>
    </div>
  );
}
