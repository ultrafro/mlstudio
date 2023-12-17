import { Button } from "@mantine/core";
import { FlexCol, FlexRow, Icon } from "./Flex";
import {
  ActualBlocks,
  forwardBlocks,
  getBrokenBlocksList,
  initializeBlocks,
  trainBlocks,
} from "./Blocks/ActualBlocks";
import { useContext } from "react";
import { SessionProivder } from "./Providers";
import { BlockType } from "./model";

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
        <Icon
          src="/icons/play.png"
          onClick={async () => {
            const result = getBrokenBlocksList(session.session.network);

            if (result.length > 0) {
              console.log("found broken blocks! not going to train", result);
              return;
            }

            //forwardBlocks(session.session.network);

            //todo: make this find the "final loss" block, right now it's hard coded
            trainBlocks("|7|", session.session.network, {}, 1);

            //find any variable blocks and print them out
            for (const block of Object.values(ActualBlocks)) {
              if (block.type == BlockType.VARIABLE) {
                console.log("variable value: " + block.getValue());
                console.log("variable grda: " + block.getValue());
              }
            }

            // //print the value of the "|2|" block
            // const variableBlock = ActualBlocks["|2|"];
            // console.log("variable value: " + variableBlock.getValue());
            // console.log("variable grad: " + variableBlock.getGrads());

            session.setSession({ ...session.session, blocksChanged: {} });
          }}
        />
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
          onClick={() => {
            //print out the network
            console.log(session.session.network);
          }}
        />
      </FlexRow>
    </FlexRow>
  );
}
