import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactECharts from "echarts-for-react";
import { useState } from "react";
import { FaCode } from "react-icons/fa";

type JSONViewerProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const JSONViewer: React.FC<JSONViewerProps> = ({ data }) => {
  const jsonAsString = JSON.stringify(data.content, null, 2);
  const [tab, setTab] = useState<string>("json");

  return (
    <div className="mt-4 p-4 rounded-sm h-full overflow-y-auto">
      <div className="flex flex-row justify-evenly">
        <button
          onClick={() => setTab("json")}
          className={`p-3 flex flex-row items-center ${
            tab === "json" ? "text-sky-400 border-b-2 border-b-sky-400" : ""
          }`}
        >
          <FaCode className="mr-2" />
          Code
        </button>
        <button
          onClick={() => setTab("tree")}
          className={`p-3 flex flex-row items-center ${
            tab === "tree" ? "text-sky-400 border-b-2 border-b-sky-400" : ""
          }`}
        >
          Tree View
        </button>
      </div>

      {tab === "json" && (
        <SyntaxHighlighter
          language="json"
          style={dracula}
          showLineNumbers
          wrapLongLines
          lineProps={{
            style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
          }}
        >
          {jsonAsString}
        </SyntaxHighlighter>
      )}
      {tab === "tree" && <JSONTree data={data.content} />}
    </div>
  );
};
const convertDataToTree = (data, name = "Main") => {
  const colors = [
    "#5EADFF",
    "#FF7F50",
    "#32CD32",
    "#FFD700",
    "#FF69B4",
    "#008B8B",
    "#9400D3",
    "#FF4500",
    // Add more colors as needed
  ];

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return {
        name,
        children: data.map((item, index) =>
          convertDataToTree(item, `${name}[${index}]`)
        ),
      };
    } else {
      return {
        name,
        children: Object.keys(data).map((key, index) => {
          const color = colors[index % colors.length];
          return {
            name: key,
            children: [convertDataToTree(data[key], key)],
            itemStyle: {
              color: color,
            },
            label: {
              color: "#000", // Label color for better visibility
            },
            lineStyle: {
              color: color,
            },
          };
        }),
      };
    }
  } else {
    return {
      name: `${data}`,
    };
  }
};

const JSONTree: React.FC<{ data: JSON }> = ({ data }) => {
  const treeData = convertDataToTree(data);

  const option = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    toolbox: {
      show: true,
      feature: {
        dataView: {
          show: true,
          readOnly: true,
        },
        restore: {
          show: true,
        },
        saveAsImage: {
          show: true,
        },
      },
    },
    series: [
      {
        type: "tree",
        data: [treeData],
        top: "1%",
        left: "7%",
        bottom: "1%",
        right: "20%",
        symbolSize: 7,
        label: {
          position: "left",
          verticalAlign: "middle",
          align: "right",
          fontSize: 12,
        },
        leaves: {
          label: {
            position: "right",
            verticalAlign: "middle",
            align: "left",
            fontSize: 12,
          },
        },
        expandAndCollapse: false,
        animationDuration: 550,
        animationDurationUpdate: 750,
        lineStyle: {
          color: "#ccc",
          width: 2,
        },
      },
    ],
    backgroundColor: "transparent",
  };

  return (
    <ReactECharts
      option={option}
      notMerge={true}
      lazyUpdate={true}
      theme={"dark"}
      style={{ height: "600px" }}
    />
  );
};

export default JSONViewer;
