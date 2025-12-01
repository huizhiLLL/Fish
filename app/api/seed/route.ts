import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EVENTS, RECORDS } from '@/lib/data';
import type { EventId } from '@/lib/types';
import type { RecordType as PrismaRecordType } from '@prisma/client';

async function runSeed() {
  // 先清空旧数据（注意外键顺序）
  await prisma.leaderboardRecord.deleteMany();
  await prisma.event.deleteMany();

  // 写入事件表
  await prisma.event.createMany({
    data: EVENTS.map((evt) => ({
      id: evt.id as EventId,
      name: evt.name,
    })),
    skipDuplicates: true,
  });

  // 写入成绩表
  await prisma.leaderboardRecord.createMany({
    data: RECORDS.map((record) => ({
      name: record.name,
      result: record.result,
      method: record.method,
      eventId: record.eventId as EventId,
      type: record.type as PrismaRecordType,
    })),
  });
}

async function handleSeedRequest() {
  // 保护：生产环境禁用
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seeding is disabled in production.' },
      { status: 403 },
    );
  }

  try {
    await runSeed();
    return NextResponse.json(
      {
        ok: true,
        message: 'Seed completed from lib/data.ts into database.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[GET /api/seed] Seed failed', error);
    return NextResponse.json(
      { error: 'Seed failed, check server logs for details.' },
      { status: 500 },
    );
  }
}

// 为了方便，你可以用 GET 或 POST 触发一次即可
export async function GET() {
  return handleSeedRequest();
}

export async function POST() {
  return handleSeedRequest();
}


