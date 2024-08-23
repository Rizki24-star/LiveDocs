"use server";
import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();
  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while creating document: ${error}`);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updateRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updateRoom);
  } catch (error) {
    console.log(error);
  }
};

export const getDocument = async (email: string) => {
  try {
    const room = await liveblocks.getRooms({ userId: email });
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while getting rooms : ${error}`);
  }
};
