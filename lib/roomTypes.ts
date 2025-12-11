export enum RoomType {
  STANDARD = "Standard",
  DELUXE = "Deluxe",
  SUITE = "Suite",
  EXECUTIVE = "Executive",
  PRESIDENTIAL = "Presidential",
}

export const ROOM_TYPE_OPTIONS = [
  { value: RoomType.STANDARD, label: "Standard Room" },
  { value: RoomType.DELUXE, label: "Deluxe Room" },
  { value: RoomType.SUITE, label: "Suite" },
  { value: RoomType.EXECUTIVE, label: "Executive Room" },
  { value: RoomType.PRESIDENTIAL, label: "Presidential Suite" },
] as const;
