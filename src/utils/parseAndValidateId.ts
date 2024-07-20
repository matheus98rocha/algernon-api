import { UnprocessableEntityException } from "@nestjs/common";

export function parseAndValidateId(userId: string): number {
  const parsedId = parseInt(userId, 10);
  if (isNaN(parsedId)) {
    throw new UnprocessableEntityException(`Invalid userID: ${userId}`);
  }
  return parsedId;
}