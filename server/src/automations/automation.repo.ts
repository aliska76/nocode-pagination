import fs from 'fs';
import path from 'path';
import { Automation } from '@sharedTypes/types';
import { GetAutomationsException } from '@common/errors';

export class AutomationRepo {
  public static async getAutomations(options?: {
    page?: number;
    limit?: number;
    sortBy?: keyof Automation;
    order?: 'asc' | 'desc';
    filters?: Record<string, string>}): Promise<{ total: number; data: Automation[] }> {
    try {
      const dataFilePath = path.resolve(__dirname, 'automations.json');
      const rawData = fs.readFileSync(dataFilePath, 'utf-8');
      let automations: Automation[] = JSON.parse(rawData);
     
      const {
        page = 1,
        limit = 10,
        sortBy,
        order = 'asc',
        filters = {},
      } = options || {};

      //filters
      for (const [key, value] of Object.entries(filters)) {
        automations = automations.filter(
          (item) => String(item[key as keyof Automation]) === value
        );
      }

      //sorting
      if (sortBy) {
        automations.sort((a, b) => {
          let aValue: any = a[sortBy];
          let bValue: any = b[sortBy];
      
          // Date
          if (sortBy === 'creationTime') {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
          }
          
          // status
          if (sortBy === 'status') {
            const statusOrder = { active: 1, inactive: 2, deleted: 3 };
            aValue = statusOrder[aValue as keyof typeof statusOrder];
            bValue = statusOrder[bValue as keyof typeof statusOrder];
          }
          
          // strings
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
      
          if (aValue === bValue) return 0;
          if (order === 'asc') return aValue > bValue ? 1 : -1;
          return aValue < bValue ? 1 : -1;
        });
      }
      

      const total = automations.length;

      //pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = automations.slice(start, end);

      return { total, data };
    } catch (err: any) {
      throw new GetAutomationsException(err?.message);
    }
  }
}
