import { FlexCol, FlexRow, Icon } from "./Flex";

export default function TopBar() {
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
          <Icon src="/icons/db.png" />
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
        <Icon src="/icons/settings.png" />
        <Icon src="/icons/play.png" />
        <Icon src="/icons/step.png" />
        <Icon src="/icons/trash.png" />
      </FlexRow>

      {/* Mode */}
      <FlexRow
        style={{
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <Icon src="/icons/run.png" />
      </FlexRow>
    </FlexRow>
  );
}
