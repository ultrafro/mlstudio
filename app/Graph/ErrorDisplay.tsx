import { useContext, useEffect, useState } from "react";
import { FlexCol } from "../Flex";
import { SessionProivder } from "../Providers";
import { getBrokenBlocksList } from "../Blocks/ActualBlocks";

export default function ErrorDisplay() {
  const session = useContext(SessionProivder);
  const [errors, setErrors] = useState<{ id: string; reason?: string }[]>([]);

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
        height: "350px",
        position: "absolute",
        bottom: 25,
        right: 25,
        border: "2px solid black",
        borderRadius: "10px",
        backgroundColor: "white",
      }}
    >
      {/* A title that looks plane but cool */}
      <div
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
      </div>

      {/* A list of errors, with error.id in bold and red, and the reason on a new line beneath it in plane text */}
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
              <div style={{ fontWeight: "bold", color: "red" }}>{error.id}</div>
              <div>{error.reason}</div>
            </div>
          );
        })}
      </div>
    </FlexCol>
  );
}
