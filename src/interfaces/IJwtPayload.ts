import { ERole } from '../Enums/ERole';

export interface IJwtPayload {
  sub: string;
  role: ERole;
}
