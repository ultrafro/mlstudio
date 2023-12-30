import { useContext } from "react";
import { SessionProivder } from "../Providers";
import { Blocks } from "../model";

export default function Logo({ id }: { id: string }) {
  const session = useContext(SessionProivder);

  const block = session.session.network.blocks[id];
  const blockDefinition = Blocks[block.type];

  console.log("going to render logo for", blockDefinition.icon);

  return (
    <div className="bg-white rounded-sm w-[50px] h-[50px]">
      <div
        className={"mb-2 "}
        style={{
          backgroundImage: "url('" + blockDefinition.icon + "')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
