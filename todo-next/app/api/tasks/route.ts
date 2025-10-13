// app/api/tasks/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import type { Todo } from '@/types/todo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const key = '__TODO_STORE__';
type GlobalWithStore = { [k: string]: unknown };
const g = globalThis as unknown as GlobalWithStore;
const store: Todo[] = (g[key] as Todo[] | undefined) ?? ((g[key] = []) as Todo[]);

type CreatePayload = {
  id?: string;
  name: string;
  description?: string;
  status?: Todo['status'];
  priority?: Todo['priority'];
  userId?: string | number;
  owner?: string | number;
  user_id?: string | number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('userId');
  if (!uid) return NextResponse.json(store);
  const filtered = store.filter(t => String(t.userId ?? t.owner ?? t.user_id) === uid);
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const raw = (await req.json()) as unknown;
  const body = raw as Partial<CreatePayload>;
  if (!body.name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const todo: Todo & { userId?: string | number; owner?: string | number; user_id?: string | number } = {
    id: body.id ?? crypto.randomUUID(),
    name: body.name,
    description: body.description ?? '',
    status: body.status ?? 'TODO',
    priority: body.priority ?? 'Low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: body.userId,
    owner: body.owner,
    user_id: body.user_id,
  };

  store.push(todo);
  return NextResponse.json(todo, { status: 201 });
}
