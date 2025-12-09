"use client";

export default function Description({ data, handleData }) {
  const handleChange = (e) => {
    handleData("description", e.target.value);
  };
  
  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl h-full">
      <h1 className="font-semibold">Description</h1>
      <textarea
        value={data?.description ?? ""}
        onChange={handleChange}
        placeholder="Enter your description here..."
        className="w-full h-64 border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </section>
  );
}