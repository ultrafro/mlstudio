import { twMerge } from "tailwind-merge";
import Chart from "../Chart";

export default function Button({
  src,
  label,
  override,
  imgSize,
  interactive = true,
  onClick,
}: {
  src: string;
  label: string;
  override?: string;
  imgSize?: number;
  interactive?: boolean;
  onClick?: () => void;
}) {
  console.log("label: " + label, interactive);
  return (
    <div
      className={twMerge(
        "flex flex-col w-36 h-28 p-2.5 justify-center items-center transition duration-100 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-[.85] " +
          (override || "") +
          (!interactive ? " pointer-events-none  bg-gray-50" : "")
      )}
      onClick={onClick}
    >
      <div
        className={"mb-2 "}
        style={{
          backgroundImage: "url('" + src + "')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          width: imgSize || 24,
          height: imgSize || 24,
        }}
      />
      <div className="w-32 text-center text-black text-xs font-normal font-['Inter']  select-none">
        {label}
      </div>
    </div>
  );
}

export function ShadowButton({
  src,
  label,
  onClick,
}: {
  src: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      src={src}
      label={label}
      override={"rounded-2xl shadow w-36 h-36 "}
      onClick={onClick}
      imgSize={40}
    />
  );
}

export function ShadowGraph({
  xData,
  yData,
  label,
  override,
}: {
  xData: number[];
  yData: number[];
  label: string;
  override?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-col w-[150] h-[150] p-2.5 justify-center items-center " +
          override || ""
      )}
    >
      <Chart x={xData} y={yData} />
      <div className="w-32 text-center text-black text-xs font-normal font-['Inter']">
        {label}
      </div>
    </div>
  );
}
