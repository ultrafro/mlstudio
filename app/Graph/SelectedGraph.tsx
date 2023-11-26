import { useContext } from "react";
import { FlexCol } from "../Flex";
import { SessionProivder } from "../Providers";

export default function SelectedGraph() {
  const session = useContext(SessionProivder);

  if (!session.session.selectedBlockId) {
    return null;
  }

  return (
    <FlexCol
      style={{
        width: "300px",
        height: "300px",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "green",
      }}
    ></FlexCol>
  );
}
