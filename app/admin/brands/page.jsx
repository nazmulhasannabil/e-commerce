import Form from "./component/Form";
import ListView from "./component/ListView";

export default function BrandsPage() {
  return (
    <main className="p-5 flex flex-col lg:flex-row gap-4 bg-gray-100 min-h-screen">
        <div className="lg:w-[400px] w-full">
          <Form />
        </div>
        <div className="flex-1">
          <ListView />
        </div>
    </main>
  )
}