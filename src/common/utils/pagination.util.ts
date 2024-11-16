import { PaginatedResponse } from '../../users/interfaces';

export class PaginationUtil {
  static getPaginationParams(page: number, limit: number) {
    const take = limit;
    const skip = (page - 1) * take;

    return { take, skip };
  }

  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
