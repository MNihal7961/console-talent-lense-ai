interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export type { RegisterDTO, LoginDTO };
