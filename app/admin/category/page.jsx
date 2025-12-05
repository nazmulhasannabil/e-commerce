import Form from "./component/Form";
import ListVies from "./component/ListVies";

export default function CategoryPage() {
  return (
    <main className="p-5 flex gap-4 bg-gray-100 min-h-screen">
        <Form />
        <ListVies />

    </main>
  )
}
