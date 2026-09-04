import type { User } from "../interface/user";

const getUserInitials = (user: User) => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

const upperCaseFirstLetter = (s: string) => {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

export { getUserInitials, upperCaseFirstLetter };
