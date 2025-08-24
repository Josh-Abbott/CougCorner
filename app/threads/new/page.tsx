import ThreadForm from "@/app/components/ThreadForm";

function NewThread() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Thread</h1>
      <ThreadForm />
    </main>
  );
}

export default NewThread