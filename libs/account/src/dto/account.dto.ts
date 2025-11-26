import { createZodDto } from "nestjs-zod";

import { BaseRegisterSchema, LoginSchema } from "@meta-1/wiki-types";

export class RegisterDto extends createZodDto(BaseRegisterSchema) {}

export class LoginDto extends createZodDto(LoginSchema) {}
