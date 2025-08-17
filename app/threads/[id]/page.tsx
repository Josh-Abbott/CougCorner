import React from 'react'

interface ThreadPageProps {
  params: { id: string };
}

function ThreadPage({ params }: ThreadPageProps) {
  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Thread {params.id}</h1>
      <p className="text-gray-600">[ Posts and replies will go here ]</p>
    </section>
  );
}

export default ThreadPage