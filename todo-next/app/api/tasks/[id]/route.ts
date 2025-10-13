// app/api/tasks/[id]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import type { Todo } from '@/types/todo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const key = '__TODO_STORE__';
type GlobalWithStore = { [k: string]: unknown };
const g = globalThis as unknown as GlobalWithStore;
const store: Todo[] = (g[key] as Todo[] | undefined) ?? ((g[key] = []) as Todo[]);

type Params = { id: string };

export async function GET(_req: NextRequest, ctx: { params: Promise<Params> }) {
  const { id } = await ctx.params;
  const todo = store.find(t => String(t.id) === id);
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(todo);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<Params> }) {
  const { id } = await ctx.params;
  const raw = (await req.json()) as unknown;
  const body = raw as Partial<Todo>;
  const idx = store.findIndex(t => String(t.id) === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  store[idx] = { ...store[idx], ...body, updatedAt: new Date().toISOString() } as Todo;
  return NextResponse.json(store[idx]);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<Params> }) {
  const { id } = await ctx.params;
  const idx = store.findIndex(t => String(t.id) === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const [deleted] = store.splice(idx, 1);
  return NextResponse.json(deleted);
}
