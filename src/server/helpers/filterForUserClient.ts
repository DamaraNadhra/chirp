import type { User } from "@clerk/nextjs/server"

export const filterUserForClient = (user: User) => {
  return {
    id: user.id, 
    username: user.username, 
    imageUrl: user.imageUrl,
    publicMetadata: user.publicMetadata,
    createdAt: user.createdAt,
    unsafeMetadata: user.unsafeMetadata
  };
};