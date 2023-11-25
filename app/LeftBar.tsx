import { nanoid } from "nanoid";
import { FlexCol, FlexRow, Icon } from "./Flex";
import { SessionProivder } from "./Providers";
import { BlockType, Blocks, blocks } from "./model";
import { useContext } from "react";

export default function LeftBar() {
  const session = useContext(SessionProivder);

  return (
    <FlexCol
      style={{
        height: "calc(100% - 24px)",
        backgroundColor: "white",
        borderRadius: "10px",
        border: "2px solid black",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "12px",
        margin: "12px",
      }}
    >
      {/* main loss graph */}
      <FlexRow
        style={{
          width: "300px",
          height: "300px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>Loss Graph</div>
      </FlexRow>

      <FlexRow
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Blocks
      </FlexRow>

      <FlexRow
        style={{
          width: "100%",
          height: "100%",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {Object.keys(Blocks).map((block) => {
          const blockDefinition = Blocks[block as BlockType];
          return (
            <button
              key={"block_name_" + block}
              onClick={() => {
                const newBlockId = "|" + nanoid() + "|";
                const x = Math.random() * 300;
                const y = Math.random() * 300;

                session.setSession({
                  ...session.session,
                  network: {
                    ...session.session.network,
                    blocks: {
                      ...session.session.network.blocks,
                      [newBlockId]: {
                        id: newBlockId,
                        type: block as BlockType,
                        x,
                        y,
                      },
                    },
                  },
                });
              }}
            >
              <FlexCol
                style={{
                  width: "100px",
                  height: "100px",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "2px solid black",
                }}
              >
                <Icon src={blockDefinition.icon} />
                <div>{blockDefinition.name}</div>
              </FlexCol>
            </button>
          );
        })}
      </FlexRow>

      <FlexRow
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Validation
      </FlexRow>
    </FlexCol>
  );
}
