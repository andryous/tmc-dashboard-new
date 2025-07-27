export default function Placeholder({
  title = "Coming Soon",
}: {
  title?: string;
}) {
  console.log("Placeholder title:", title);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-600">This section is coming soon.</p>
    </div>
  );
}
