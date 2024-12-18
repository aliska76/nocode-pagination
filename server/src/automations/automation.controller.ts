  import { Request, Response } from 'express';
  import { AutomationRepo } from './automation.repo';
  import type { Automation } from '@sharedTypes/types';

  export class AutomationsCtrl {
    public static async getAutomations(req: Request, res: Response): Promise<void> {
      try {
        const {
          page = '1',
          limit = '10',
          sortBy,
          order = 'asc',
          ...filters
        } = req.query;

        const pageNum = parseInt(page as string, 10);
        const limitNumRaw = limit === 'all' ? 'all' : (limit as string);
        const limitNum = limitNumRaw === 'all' ? Number.MAX_SAFE_INTEGER : parseInt(limitNumRaw, 10);
        const safeLimitNum = Number.isNaN(limitNum) ? 10 : limitNum;

        const filtersObj = { ...filters } as Record<string, string>;
       
        const validSortKeys: Array<keyof Automation> = ['id', 'name', 'status', 'creationTime', 'type'];

        let sortKey: keyof Automation | undefined = undefined;
        
        if (typeof sortBy === 'string' && validSortKeys.includes(sortBy as keyof Automation)) {
          sortKey = sortBy as keyof Automation;
        }
        
        const { total, data } = await AutomationRepo.getAutomations({
          page: pageNum,
          limit: safeLimitNum,
          sortBy: sortKey,
          order: order === 'desc' ? 'desc' : 'asc',
          filters: filtersObj,
        });

        res.status(200).json({
          total,
          page: pageNum,
          limit: safeLimitNum,
          data
        });
      } catch (error: any) {
        res.status(500).json({ message: error?.message });
      }
    }
  }
