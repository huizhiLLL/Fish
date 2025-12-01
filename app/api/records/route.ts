import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockLeaderboardData } from '@/lib/data';
import type { EventId, LeaderboardPayload, RecordType } from '@/lib/types';

type QueryParams = {
  eventId?: EventId;
  recordType?: RecordType;
};

const hasDatabaseConfig = Boolean(process.env.DATABASE_URL);

async function fetchFromDatabase(params: QueryParams): Promise<LeaderboardPayload | null> {
  if (!hasDatabaseConfig) {
    return null;
  }

  const { eventId, recordType } = params;

  try {
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
  } catch (error) {
    console.error('[GET /api/records] Prisma 查询失败，回退到本地数据。', error);
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const eventId = url.searchParams.get('eventId') as EventId | null;
  const recordType = url.searchParams.get('type') as RecordType | null;

  const queryParams: QueryParams = {
    eventId: eventId ?? undefined,
    recordType: recordType ?? undefined,
  };

  const dbPayload = await fetchFromDatabase(queryParams);
  const responsePayload = dbPayload ?? getMockLeaderboardData(queryParams);

  return NextResponse.json(responsePayload, {
    status: 200,
  });
}

