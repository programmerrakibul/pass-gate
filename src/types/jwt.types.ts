import { TUserDocument } from "./user.types";

export type TJwtPayload = Pick<TUserDocument, "email" | "_id">;
