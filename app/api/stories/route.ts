import type { Locale } from '@prezly/theme-kit-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

import { app } from '@/adapters/server';
import { parseNumber } from '@/utils';

const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const offset = parseNumber(params.get('offset'));
    const limit = parseNumber(params.get('limit')) ?? DEFAULT_LIMIT;
    const locale = params.get('locale') as Locale.Code | null;
    const categoryId = parseNumber(params.get('category'));
    const tag = params.get('tag');
    const queryParam = params.get('query');

    let query: { uuid?: { $nin: string[] } } | undefined;
    if (queryParam) {
        try {
            query = JSON.parse(queryParam);
        } catch {
            // Invalid JSON, ignore
        }
    }

    const { stories, pagination } = await app().stories({
        offset,
        limit,
        categories: categoryId ? [{ id: categoryId }] : undefined,
        locale: locale ? { code: locale } : undefined,
        tags: tag ? [tag] : undefined,
        query,
    });

    return NextResponse.json({ data: stories, total: pagination.matched_records_number });
}
