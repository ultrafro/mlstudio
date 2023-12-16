import { FlexCol, FlexRow } from "@/app/Flex";
import { SessionProivder } from "@/app/Providers";
import { useContext, useEffect, useRef, useState } from "react";
import { NumberInput } from "@mantine/core";

export default function VariableBlockEditor({ id }: { id: string }) {
  const session = useContext(SessionProivder);

  const block = session.session.network.blocks[id];
  const shape: number[] | undefined = block.params?.shape as
    | number[]
    | undefined;

  const [regular, setRegular] = useState<number>(0);

  console.log("render variable block editor: " + id);

  return (
    <FlexCol>
      <div>Variable</div>
      <div>Shape: {shape?.toString()}</div>

      {/* mantine number input */}
      {/* <NumberInput
        value={regular}
        onChange={(val) => {
          if (typeof val == "number") {
            setRegular(val);
          }
        }}
      /> */}

      {/* <input
        type="number"
        ref={ref1}
        value={regular}
        onChange={(evt) => {
          setRegular(parseInt(evt.target.value));
        }}
      /> */}

      {/* <button
        onClick={() => {
          setRegular(Math.random());
        }}
      >
        Randomize
      </button> */}

      {/* a number input for picking dimension size */}
      <NumberInput
        key={"dimensionality"}
        value={shape?.length ?? 0}
        onChange={(newVal) => {
          const newDimensionality = Math.max(
            typeof newVal == "number" ? newVal : parseInt(newVal),
            1
          );
          if ((shape?.length ?? 0) != newDimensionality) {
            const newShape = new Array(newDimensionality).fill(1);

            const newBlockParams = { ...block.params, shape: newShape };

            const newSession = { ...session.session };
            newSession.network.blocks[id] = {
              ...newSession.network.blocks[id],
              params: newBlockParams,
            };

            session.setSession(newSession);
          }
        }}
      />

      {/* a list of number inputs for the size of each dimension */}
      {shape?.map((dimSize, i) => {
        return (
          <FlexRow key={i}>
            <div>Dim {i}</div>
            <NumberInput
              value={dimSize}
              onChange={(nv) => {
                const newVal = Math.max(
                  typeof nv == "number" ? nv : parseInt(nv),
                  1
                );

                const newShape: number[] = [];

                if (shape) {
                  for (let j = 0; j < shape.length; j++) {
                    if (j == i) {
                      newShape.push(newVal);
                    } else {
                      newShape.push(shape[j]);
                    }
                  }
                } else {
                  const newShape = new Array(dimSize).fill(1);
                  newShape[i] = newVal;
                }

                const newSession = { ...session.session };
                newSession.network.blocks[id] = {
                  ...newSession.network.blocks[id],
                  params: { ...block.params, shape: newShape },
                };

                session.setSession(newSession);
              }}
            />
          </FlexRow>
        );
      })}
    </FlexCol>
  );
}
