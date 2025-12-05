"use client";
import { Button } from "@heroui/react";


export default function Form() {
  return (
    <div className=" bg-white w-full md:w-[400px] rounded-xl p-5 flex flex-col gap-3">
      <h1 className="font-semibold text-lg">Create Category</h1>
      <form className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="category-image" className="block text-sm font-medium mb-1">Image</label>
          <input type="file" name="category-image" className="w-full p-2 border rounded-md focus:outline-none " />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input type="text" name="name" className="w-full p-2 border rounded-md focus:outline-none " placeholder="Enter category name" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" name="slug" className="w-full p-2 border rounded-md focus:outline-none " placeholder="Enter Slug" />
        </div>
        <Button type="submit" className="w-full py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">Create</Button>
      </form>
    </div>
  )
}
