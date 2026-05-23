export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
};

export type ROLES = "contributor" | "maintainer";

export const USER_ROLES = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;
