import { useState, useEffect, useCallback } from "react";
import { FlexColCenter, FlexRowCenter } from "../Flex";
import { SupervisedDataShape } from "../model";
import mnist from "mnist";
import mnistSampler from "../MNISTSampler";
import { Button } from "@mantine/core";
import Chart from "../SimpleChart";

export default function DataPreview({ data }: { data: SupervisedDataShape }) {
  const [src, setSrc] = useState<"train" | "val" | "test">("train");
  const [sample, setSample] = useState<{
    input: ImageData | string | number[] | null;
    output: ImageData | string | number[] | null;
  } | null>(null);

  const [sampleIdx, setSampleIdx] = useState<number>(0);

  const [inputImg, setInputImg] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [inputNumbers, setInputNumbers] = useState<number[]>([]);

  const [outputImg, setOutputImg] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [outputNumbers, setOutputNumbers] = useState<number[]>([]);

  const updateSample = useCallback(async () => {
    if (data.srcType == "MNIST") {
      const sample = mnistSampler.getSample(src);
      if (sample) {
        const newSample: {
          input: ImageData | string | number[] | null;
          output: ImageData | string | number[] | null;
        } = { input: null, output: null };
        newSample.input = sample.img;
        newSample.output = sample.label;
        setSample(newSample);
      }
    } else {
      if (data.fetchScript) {
        //TODO: Figure this out
        // var func = new Function(data.fetchScript);
        // func.call(null, 1, 2); //invoke the function using arguments
        // await eval(data.fetchScript);
      }
    }
  }, [data.srcType, data.fetchScript, src]);

  useEffect(() => {
    const _stuff = sampleIdx;
    mnistSampler.setProportions(
      data.trainProportion,
      data.valProportion,
      data.testProportion
    );
    updateSample();
  }, [data, sampleIdx, updateSample, src]);

  useEffect(() => {
    if (!sample) {
      return;
    }

    if (data.inputType == "image") {
      //convert sample input (image data) to image string

      const img = sample.input as ImageData;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.putImageData(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      setInputImg(dataURL);
    }

    if (data.outputType == "image") {
      //convert sample input (image data) to image string

      const img = sample.output as ImageData;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.putImageData(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      setInputImg(dataURL);
    }

    if (data.inputType == "text") {
      setInputText(sample.input as string);
    }

    if (data.outputType == "text") {
      setOutputText(sample.output as string);
    }

    if (data.inputType == "numbers") {
      setInputNumbers(sample.input as number[]);
    }

    if (data.outputType == "numbers") {
      setOutputNumbers(sample.output as number[]);
    }
  }, [data.inputType, data.outputType, sample]);

  useEffect(() => {
    mnistSampler.setProportions(
      data.trainProportion,
      data.valProportion,
      data.testProportion
    );
  }, [data.trainProportion, data.valProportion, data.testProportion]);

  const updateImage = async (
    srcType: string,
    update: (img: string) => void,
    fetchScript?: string
  ) => {
    if (srcType == "MNIST") {
      var set = mnist.set(8000, 2000);

      var trainingSet = set.training;
      var testSet = set.test;
    }
  };

  const updateText = async (
    srcType: string,
    update: (img: string) => void,
    fetchScript?: string
  ) => {};

  const updateNumbers = async (
    srcType: string,
    update: (img: number[]) => void,
    fetchScript?: string
  ) => {};

  return (
    <FlexColCenter>
      <HorizontalSelector selectedOption={src} onSelect={setSrc} />
      <FlexRowCenter>
        {/* input */}
        {data.inputType == "image" && (
          <div>
            <div>Input Image</div>
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundImage: `url(${inputImg})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div>
              {data.inputDimensions[0]} x {data.inputDimensions[1]} x{" "}
              {data.inputDimensions[2]}
            </div>
          </div>
        )}

        {/* output */}
        {data.outputType == "image" && (
          <div>
            <div>Output Image</div>
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundImage: `url(${outputImg})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div>
              {data.outputDimensions[0]} x {data.outputDimensions[1]} x{" "}
              {data.outputDimensions[2]}
            </div>
          </div>
        )}

        {/* output */}
        {data.outputType == "numbers" && (
          <div>
            <div
              style={{
                width: "100px",
                height: "100px",
              }}
            >
              <Chart y={sample?.output as number[]} />
            </div>
          </div>
        )}
      </FlexRowCenter>

      <Button
        onClick={() => {
          setSampleIdx(sampleIdx + 1);
        }}
      >
        Resample
      </Button>
    </FlexColCenter>
  );
}

const HorizontalSelector = ({ selectedOption, onSelect }: any) => {
  const options = ["train", "val", "test"];

  return (
    <div>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          style={{
            backgroundColor: option === selectedOption ? "blue" : "gray",
            color: option === selectedOption ? "white" : "black",
            border: "1px solid black",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
