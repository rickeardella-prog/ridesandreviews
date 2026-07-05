import { CreateListForm } from "./create-list-form";

export default function NewListPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">New list</h1>
      <CreateListForm />
    </div>
  );
}
