    // app/todos/page.tsx
    'use client';

    import React, { useEffect, useMemo, useState } from 'react';
    import Link from 'next/link';
    import { useRouter } from 'next/navigation';
    import { useAuth } from '../../context/AuthContext';
    import { fetchTasks } from '../../services/api';
    import type { Todo } from '../../types/todo';

    export default function TodosPage(): React.ReactElement {
    const router = useRouter();
    const { user } = useAuth();

    const userId = useMemo(
        () => (typeof user?.id === 'string' || typeof user?.id === 'number' ? user.id : undefined),
        [user]
    );

    const [tasks, setTasks] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
        router.replace('/login');
        return;
        }
        let mounted = true;
        (async () => {
        try {
            setLoading(true);
            if (userId !== undefined) {
            const list = await fetchTasks(userId);
            if (mounted) setTasks(list);
            }
        } finally {
            if (mounted) setLoading(false);
        }
        })();
        return () => { mounted = false; };
    }, [user, userId, router]);

    if (!user) return <div className="p-8">Redirecting...</div>;

    return (
        <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">All Tasks</h1>
            <Link href="/create" className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">
            + New Task
            </Link>
        </div>

        {loading ? (
            <div>Loading…</div>
        ) : tasks.length === 0 ? (
            <div className="text-slate-600">No tasks yet.</div>
        ) : (
            <ul className="grid gap-3">
            {tasks.map(t => (
                <li key={t.id} className="p-4 rounded border flex items-center justify-between">
                <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-slate-600">
                    {t.status} • {t.priority}
                    </div>
                </div>
                <Link href={`/todos/${t.id}`} className="px-3 py-1 border rounded text-sm hover:bg-slate-100">
                    View
                </Link>
                </li>
            ))}
            </ul>
        )}
        </main>
    );
    }
