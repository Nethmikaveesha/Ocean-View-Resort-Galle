import React from "react";

const RoomCard = ({ room }) => {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="text-lg font-bold">{room.name}</h3>
      <p>{room.description}</p>
      <p className="font-semibold">LKR {room.price}</p>
    </div>
  );
};

export default RoomCard;
