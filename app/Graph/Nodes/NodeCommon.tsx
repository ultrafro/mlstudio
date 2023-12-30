import { useContext } from "react";
import Logo from "../Logo";
import ViewButton from "../ViewButton";
import { SessionProivder } from "@/app/Providers";
import { Blocks } from "@/app/model";

export default function NodeCommon({
  id,
  label,
  renderEmpty,
}: {
  id: string;
  label?: string;
  renderEmpty?: boolean;
}) {
  const session = useContext(SessionProivder);

  const block = session.session.network.blocks[id];

  if (!block) {
    return null;
  }
  const blockDefinition = Blocks[block.type];

  return (
    <>
      <div className="flex flex-row w-full h-[50px] items-center justify-center absolute top-[-50px] left-0 bg-gray-500 rounded-sm text-center">
        {!renderEmpty && (
          <div className="absolute left-0 top-0">
            <Logo id={id} />
          </div>
        )}
        {label}
        <ViewButton id={id} />
      </div>
      <div className="flex flex-row w-full absolute left-0 bottom-[-20px] items-center justify-center text-xs">
        <p>{id.substring(0, 15)}</p>
      </div>
      {!!renderEmpty && (
        <div className="flex flex-row w-full h-full items-center justify-center p-8">
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: "url('" + blockDefinition.icon + "')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>
      )}
    </>
  );
}
