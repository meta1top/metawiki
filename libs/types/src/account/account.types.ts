export type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
};

export type Profile = User & {
  authorities: string[];
  otpStatus?: 0 | 1;
  atlassianBindStatus?: 0 | 1;
};
