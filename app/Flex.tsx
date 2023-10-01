export function FlexRow(props: any) {
  const style = {
    ...(props?.style || {}),
    display: "flex",
    flexDirection: "row",
  };
  return (
    <div {...props} style={style}>
      {props.children}
    </div>
  );
}

export function FlexCol(props: any) {
  const style = {
    ...(props?.style || {}),
    display: "flex",
    flexDirection: "column",
  };
  return (
    <div {...props} style={style}>
      {props.children}
    </div>
  );
}

export function FlexColCenter(props: any) {
  return (
    <FlexCol
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        ...(props?.style || {}),
      }}
    >
      {props.children}
    </FlexCol>
  );
}

export function FlexRowCenter(props: any) {
  return (
    <FlexRow
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        ...(props?.style || {}),
      }}
    >
      {props.children}
    </FlexRow>
  );
}

export function Icon(props: { src: string } & any) {
  const style = {
    ...(props?.style || {}),
    position: "relative",
    backgroundImage: `url(${props.src})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    width: 32,
    height: 32,
  };
  return (
    <div {...props} style={style}>
      {props.children}
    </div>
  );
}

export function Modal(props: any) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // width: "50%",
          // height: "50%",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
