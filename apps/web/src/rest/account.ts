import type { LoginData, Profile, Token } from "@meta-1/wiki-types";
import { RegisterData } from "@meta-1/wiki-types";
import { get, post } from "@/utils/rest";

export const login = (data: LoginData) => post<Token, LoginData>("@api/account/login", data);

export const profile = () => get<Profile, null>("@api/account/profile", null);

export const logout = () => post("@api/account/logout");

export const register = (data: RegisterData) => post<Token, RegisterData>("@api/account/register", data);
