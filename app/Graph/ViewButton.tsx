import { useContext } from "react";
import { SessionProivder } from "../Providers";

export default function ViewButton({ id }: { id: string }) {
  const session = useContext(SessionProivder);

  //render an icon of an eye which is a button
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      <button
        onClick={() => {
          //set selected to id in session
          const newSession = { ...session.session };
          newSession.selectedBlockId = id;
          session.setSession(newSession);
        }}
      >
        <img src="https://img.icons8.com/material-outlined/24/000000/visible--v1.png" />
      </button>
    </div>
  );
}
