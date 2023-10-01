import { FlexCol, FlexRow, Icon } from "./Flex";
import { Blocks, blocks } from "./model";

export default function LeftBar() {
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
        {Object.values(Blocks).map((block) => {
          return (
            <FlexCol
              key={"block_name_" + block.name}
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
              <Icon src={block.icon} />
              <div>{block.name}</div>
            </FlexCol>
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
