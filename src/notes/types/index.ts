export enum NotesToUserRole {
  AUTHOR = 'author',
  VIEWER = 'viewer'
}

export interface ICurrentUser {
  sub: number;
  username: string;
}