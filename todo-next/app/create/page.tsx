    // app/create/page.tsx
    'use client';

    import React from 'react';
    import { useForm, type SubmitHandler } from 'react-hook-form';
    import { useRouter } from 'next/navigation';
    import { createTask } from '../../services/api';
    import { useAuth } from '../../context/AuthContext';
    import type { Todo } from '../../types/todo';

    type FormValues = {
    name: string;
    description: string;
    status: Todo['status'];
    priority: Todo['priority'];
    };

    export default function CreateTaskPage(): React.ReactElement {
    const { user } = useAuth();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
        useForm<FormValues>({
        defaultValues: { name: '', description: '', status: 'TODO', priority: 'Low' },
        });

    const [err, setErr] = React.useState<string | null>(null);

    if (!user) return <div className="p-6">Redirecting…</div>;

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setErr(null);
        try {
        await createTask(data, user.id as string | number);
        reset();
        router.push('/?r=1');
        } catch (e) {
        setErr((e as Error).message);
        }
    };

    return (
        <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">New Task</h1>
        {err && <div className="mb-3 p-3 border border-red-300 text-red-700 rounded">{err}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Name"
                {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Description"
            {...register('description')}
            />
            <div className="flex gap-3">
            <select className="border rounded px-3 py-2" {...register('status')}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
            </select>
            <select className="border rounded px-3 py-2" {...register('priority')}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            </div>
            <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            >
            {isSubmitting ? 'Saving…' : 'Create'}
            </button>
        </form>
        </main>
    );
    }
