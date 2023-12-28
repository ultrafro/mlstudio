import { twMerge } from "tailwind-merge";
import Chart from "../Chart";

export default function Button({
  src,
  label,
  override,
  imgSize,
}: {
  src: string;
  label: string;
  override?: string;
  imgSize?: number;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-col w-36 h-28 p-2.5 justify-center items-center " +
          override || ""
      )}
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
      <div className="w-32 text-center text-black text-xs font-normal font-['Inter']">
        {label}
      </div>
    </div>
  );
}

export function ShadowButton({ src, label }: { src: string; label: string }) {
  return <Button src={src} label={label} override={"rounded-2xl shadow"} />;
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
