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
