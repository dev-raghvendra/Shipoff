import { AsyncLocalStorage } from "async_hooks";
import {UserType} from "@shipoff/types"



export const requestContext = new AsyncLocalStorage<{user:UserType}>();

export function getUser(): UserType {
  const ctx = requestContext.getStore();
  if (!ctx) throw new Error("No request context found — called outside of a request scope");
  return ctx.user;
}