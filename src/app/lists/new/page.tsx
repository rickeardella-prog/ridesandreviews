import { CreateListForm } from "./create-list-form";

export default function NewListPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="eyebrow mb-1">Rank everything</p>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">New list</h1>
      <div className="card p-6">
        <CreateListForm />
      </div>
    </div>
  );
}
