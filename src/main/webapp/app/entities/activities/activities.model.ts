import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IActivities {
  id?: number;
  name?: string;
  detalle?: string | null;
  status?: Status | null;
  terminationDate?: dayjs.Dayjs | null;
  daysLate?: number | null;
  employee?: IEmployee | null;
}

export class Activities implements IActivities {
  constructor(
    public id?: number,
    public name?: string,
    public detalle?: string | null,
    public status?: Status | null,
    public terminationDate?: dayjs.Dayjs | null,
    public daysLate?: number | null,
    public employee?: IEmployee | null
  ) {}
}

export function getActivitiesIdentifier(activities: IActivities): number | undefined {
  return activities.id;
}
