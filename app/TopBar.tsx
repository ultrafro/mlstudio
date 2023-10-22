import { Button } from "@mantine/core";
import { FlexCol, FlexRow, Icon } from "./Flex";
import { forwardBlocks, initializeBlocks } from "./Blocks/ActualBlocks";
import { useContext } from "react";
import { SessionProivder } from "./Providers";

export default function TopBar(props: { openData: () => void }) {
  const session = useContext(SessionProivder);
  return (
    <FlexRow
      style={{
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* file */}
      <FlexCol style={{ width: "300px", alignItems: "flex-start" }}>
        <FlexRow
          style={{
            height: "100%",
            justifyContent: "flex-start",
          }}
        >
          <Icon src="/icons/files.png" />
          <div>File name</div>
          <Icon src="/icons/share.png" />
        </FlexRow>
        <FlexRow
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <Button>
            <Icon src="/icons/db.png" onClick={props.openData} />
          </Button>
        </FlexRow>
      </FlexCol>

      {/* Center Buttons */}
      <FlexRow
        style={{
          width: "400px",
          height: "100%",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "white",
          border: "2px solid black",
          borderRadius: "10px",
          margin: "24px",
        }}
      >
        <Icon src="/icons/trash.png" />
        <Icon src="/icons/play.png" />
        <Icon src="/icons/ff.png" />
      </FlexRow>

      {/* Learning Rate settings */}
      <Icon src="/icons/settings.png" />

      {/* Mode */}
      <FlexRow
        style={{
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <Icon
          src="/icons/run.png"
          onClick={async () => {
            await initializeBlocks(session.session.network);
            forwardBlocks(session.session.network);
          }}
        />
      </FlexRow>
    </FlexRow>
  );
}
