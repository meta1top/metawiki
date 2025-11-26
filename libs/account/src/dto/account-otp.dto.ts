import { createZodDto } from "nestjs-zod";

import { OTPDisableSchema, OTPEnableSchema, OTPSecretSchema, OTPStatusSchema } from "@meta-1/wiki-types";

export class OTPStatusDto extends createZodDto(OTPStatusSchema) {}

export class OTPSecretDto extends createZodDto(OTPSecretSchema) {}

export class OTPEnableDto extends createZodDto(OTPEnableSchema) {}

export class OTPDisableDto extends createZodDto(OTPDisableSchema) {}
