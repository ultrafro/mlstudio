import { useContext, useEffect, useState } from "react";
import { FlexCol, FlexRow } from "../Flex";
import { SessionProivder } from "../Providers";
import { getBrokenBlocksList } from "../Blocks/ActualBlocks";

export default function ErrorDisplay() {
  const session = useContext(SessionProivder);
  const [errors, setErrors] = useState<{ id: string; reason?: string }[]>([]);
  const [minimized, setMinimized] = useState<boolean>(false);

  useEffect(() => {
    const newErrors = getBrokenBlocksList(session.session.network);
    setErrors(newErrors);
  }, [session]);

  if (errors.length == 0) {
    return null;
  }

  return (
    <FlexCol
      style={{
        width: "350px",
        height: minimized ? undefined : "350px",
        position: "absolute",
        bottom: 25,
        right: 25,
        border: "2px solid black",
        borderRadius: "10px",
        backgroundColor: "white",
      }}
    >
      {/* A title that looks plane but cool. It should also have a carrot to minimize/unminimize */}
      <FlexRow
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "black",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Errors
        {/* a count of the errors in a pip with red font */}
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "10px",
            backgroundColor: "red",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "10px",
          }}
        >
          {errors.length}
        </div>
        {/* A carrot to minimize/unminimize */}
        <img
          alt="minimize"
          src="/icons/downCarrot.png"
          style={{
            width: "20px",
            height: "20px",
            marginLeft: "10px",
            backgroundColor: "white",
            borderRadius: "5px",

            position: "absolute",
            right: "10px",

            //if its minimized, rotate the carrot 180 degrees using css transform
            transform: minimized ? "rotate(180deg)" : undefined,
          }}
          onClick={() => {
            setMinimized(!minimized);
          }}
        />
      </FlexRow>

      {/* A list of errors, with error.id in bold and red, and the reason on a new line beneath it in plane text */}
      {!minimized && (
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            padding: "10px",
          }}
        >
          {errors.map((error) => {
            return (
              <div key={error.id}>
                <div style={{ fontWeight: "bold", color: "red" }}>
                  {error.id}
                </div>
                <div>{error.reason}</div>
              </div>
            );
          })}
        </div>
      )}
    </FlexCol>
  );
}
