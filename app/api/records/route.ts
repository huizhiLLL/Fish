import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { EventId, LeaderboardPayload, RecordType } from '@/lib/types';
import type { RecordType as PrismaRecordType } from '@prisma/client';

type QueryParams = {
  eventId?: EventId;
  recordType?: RecordType;
};

async function fetchFromDatabase(params: QueryParams): Promise<LeaderboardPayload> {
  const { eventId, recordType } = params;

  const [events, records] = await Promise.all([
    prisma.event.findMany({ orderBy: { id: 'asc' } }),
    prisma.leaderboardRecord.findMany({
      where: {
        ...(eventId && { eventId }),
        ...(recordType && { type: recordType }),
      },
      orderBy: [{ type: 'asc' }, { result: 'asc' }],
    }),
  ]);

  return {
    events: events.map((event) => ({ id: event.id as EventId, name: event.name })),
    records: records.map((record) => ({
      name: record.name,
      result: record.result,
      method: record.method,
      eventId: record.eventId as EventId,
      type: record.type as RecordType,
    })),
  };
}

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'DATABASE_URL is not configured. API can only read from database now.' },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const eventId = url.searchParams.get('eventId') as EventId | null;
  const recordType = url.searchParams.get('type') as RecordType | null;

  const queryParams: QueryParams = {
    eventId: eventId ?? undefined,
    recordType: recordType ?? undefined,
  };

  try {
    const payload = await fetchFromDatabase(queryParams);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('[GET /api/records] Prisma 查询失败', error);
    return NextResponse.json(
      { error: 'Failed to fetch records from database.' },
      { status: 500 },
    );
  }
}

// ===== POST: Astrbot 用来录入成绩 =====

type CreateRecordBody = {
  /** 昵称，如：张三 */
  name: string;
  /** 项目 ID，例如：'333' | '222' | '444' | '333oh' | 'pyram' | 'clock' */
  eventId: string;
  /**
   * 成绩类型：支持
   * - 'single' | 'average' | 'ao12'
   * - 'SINGLE' | 'AVERAGE' | 'AO5' | 'AO12'
   */
  resultType: string;
  /** 解法方法，如：'CFOP' */
  method: string;
  /** 成绩时间字符串，如：'12.22'、'1:05.22'、'DNF' */
  result: string;
};

function normalizeEventId(raw: string): EventId | null {
  const v = raw.trim().toLowerCase();
  if (v === '333' || v === '3x3' || v === '3x3x3') return '333';
  if (v === '222' || v === '2x2' || v === '2x2x2') return '222';
  if (v === '444' || v === '4x4' || v === '4x4x4') return '444';
  if (v === '333oh' || v === 'oh' || v === '3oh') return '333oh';
  if (v === 'pyram' || v === 'pyraminx') return 'pyram';
  if (v === 'clock') return 'clock';
  return null;
}

function normalizeRecordType(raw: string): PrismaRecordType | null {
  const v = raw.trim().toLowerCase();
  if (v === 'single' || v === 's') return 'single';
  if (v === 'average' || v === 'avg' || v === 'mean' || v === 'ao5' || v === 'ao-5') {
    return 'average';
  }
  if (v === 'ao12' || v === 'ao-12') return 'ao12';
  return null;
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'DATABASE_URL is not configured. API can only write to database.' },
      { status: 500 },
    );
  }

  let body: CreateRecordBody;

  try {
    body = (await request.json()) as CreateRecordBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { name, eventId: rawEventId, resultType: rawResultType, method, result } = body;

  if (!name || !rawEventId || !rawResultType || !method || !result) {
    return NextResponse.json(
      { error: 'Missing required fields: name, eventId, resultType, method, result.' },
      { status: 400 },
    );
  }

  const eventId = normalizeEventId(rawEventId);
  const type = normalizeRecordType(rawResultType);

  if (!eventId) {
    return NextResponse.json(
      { error: `Unsupported eventId: ${rawEventId}.` },
      { status: 400 },
    );
  }

  if (!type) {
    return NextResponse.json(
      { error: `Unsupported resultType: ${rawResultType}.` },
      { status: 400 },
    );
  }

  try {
    // 确保 Event 存在（如果被删掉则自动创建）
    const existingEvent = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existingEvent) {
      await prisma.event.create({
        data: {
          id: eventId,
          name: eventId,
        },
      });
    }

    const created = await prisma.leaderboardRecord.create({
      data: {
        name,
        result,
        method,
        eventId,
        type,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        record: {
          id: created.id,
          name: created.name,
          result: created.result,
          method: created.method,
          eventId: created.eventId,
          type: created.type,
          createdAt: created.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/records] Failed to create record', error);
    return NextResponse.json(
      { error: 'Failed to create record.' },
      { status: 500 },
    );
  }
}
