    // app/todos/[id]/page.tsx
    'use client';

    import React, { useEffect, useState } from 'react';
    import { useParams, useRouter } from 'next/navigation';
    import { fetchTaskById } from '../../../services/api';
    import type { Todo } from '../../../types/todo';

    export default function TaskDetailsPage(): React.ReactElement {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [task, setTask] = useState<Todo | null>(null);
    const [loading, setLoading] = useState(true);

    const id = params?.id;

    useEffect(() => {
        let mounted = true;
        (async () => {
        try {
            if (!id) return;
            const t = await fetchTaskById(id);
            if (mounted) setTask(t);
        } finally {
            if (mounted) setLoading(false);
        }
        })();
        return () => { mounted = false; };
    }, [id]);

    if (!id) return <div className="p-6">Missing id</div>;
    if (loading) return <div className="p-6">Loading…</div>;
    if (!task) return <div className="p-6">Not found</div>;

    return (
        <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">{task.name}</h1>
        <div className="text-sm text-slate-600 mb-4">
            {task.status} • {task.priority}
        </div>
        <p className="mb-6 whitespace-pre-wrap">{task.description}</p>
        <button onClick={() => router.back()} className="px-3 py-2 border rounded">
            Back
        </button>
        </main>
    );
    }
