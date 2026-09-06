import type { User } from "../interface/user";

const getUserInitials = (user: User) => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

const upperCaseFirstLetter = (s: string) => {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export { getUserInitials, upperCaseFirstLetter, formatFileSize };
