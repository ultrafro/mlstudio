import { FlexCol, FlexRow } from "./Flex";

export default function GraphDisplay() {
  return (
    <FlexCol
      style={{
        width: "100%",
        height: "calc(100% - 24px)",
        backgroundColor: "white",
        borderRadius: "10px",
        border: "2px solid black",
        margin: "12px",
      }}
    ></FlexCol>
  );
}
