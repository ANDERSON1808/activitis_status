import * as dayjs from 'dayjs';
import { IActivities } from 'app/entities/activities/activities.model';

export interface IEmployee {
  id?: number;
  name?: string;
  created?: dayjs.Dayjs | null;
  activities?: IActivities[] | null;
}

export class Employee implements IEmployee {
  constructor(public id?: number, public name?: string, public created?: dayjs.Dayjs | null, public activities?: IActivities[] | null) {}
}

export function getEmployeeIdentifier(employee: IEmployee): number | undefined {
  return employee.id;
}
