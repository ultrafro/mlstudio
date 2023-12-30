import { FlexCol, FlexColCenter, FlexRow } from "@/app/Flex";
import { SessionProivder } from "@/app/Providers";
import { useContext, useEffect, useRef, useState } from "react";
import { NumberInput } from "@mantine/core";

export default function LinearBlockEditor({ id }: { id: string }) {
  const session = useContext(SessionProivder);

  const block = session.session.network.blocks[id];
  const inputSize: number | undefined = block?.params?.inputSize as
    | number
    | undefined;

  const outputSize: number | undefined = block?.params?.outputSize as
    | number
    | undefined;

  const [regular, setRegular] = useState<number>(0);

  return (
    <FlexColCenter style={{ width: "85%" }}>
      {/* a number input for picking input size */}
      <FlexColCenter style={{ width: "100%" }}>
        <div>Input Size </div>
        <div style={{ width: "75px", height: "50px" }}>
          <NumberInput
            key={"dimensionality"}
            size={"20px"}
            value={inputSize ?? 0}
            onChange={(newVal) => {
              const newDimensionality = Math.max(
                typeof newVal == "number"
                  ? isNaN(newVal)
                    ? 1
                    : newVal
                  : parseInt(newVal),
                1
              );
              if (inputSize != newDimensionality) {
                const newBlockParams = {
                  ...block?.params,
                  inputSize: newDimensionality,
                };

                const newSession = { ...session.session };
                newSession.network.blocks[id] = {
                  ...newSession.network.blocks[id],
                  params: newBlockParams,
                };

                session.setSession(newSession);
              }
            }}
          />
        </div>
      </FlexColCenter>

      {/* a number input for picking output size */}
      <FlexColCenter style={{ width: "100%" }}>
        <div>Output Size </div>
        <div style={{ width: "75px", height: "50px" }}>
          <NumberInput
            key={"dimensionality"}
            size={"20px"}
            value={outputSize ?? 0}
            onChange={(newVal) => {
              const newDimensionality = Math.max(
                typeof newVal == "number"
                  ? isNaN(newVal)
                    ? 1
                    : newVal
                  : parseInt(newVal),
                1
              );
              if (outputSize != newDimensionality) {
                const newBlockParams = {
                  ...block?.params,
                  outputSize: newDimensionality,
                };

                const newSession = { ...session.session };
                newSession.network.blocks[id] = {
                  ...newSession.network.blocks[id],
                  params: newBlockParams,
                };

                session.setSession(newSession);
              }
            }}
          />
        </div>
      </FlexColCenter>
    </FlexColCenter>
  );
}
