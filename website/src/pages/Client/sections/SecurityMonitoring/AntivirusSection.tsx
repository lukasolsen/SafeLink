import React, { useState, useEffect } from "react";
import { FiShield, FiAlertCircle, FiCheck, FiArrowUp } from "react-icons/fi";
import * as echarts from "echarts";

const AntivirusSection: React.FC = () => {
  const [antivirusStatus, setAntivirusStatus] = useState({
    upToDate: true,
    lastScan: "2023-01-15 14:30:00",
    threats: [
      { id: 1, name: "Malware", date: "2022-05-12", info: "Malware info..." },
      { id: 2, name: "Adware", date: "2022-08-20", info: "Adware info..." },
      { id: 3, name: "Spyware", date: "2023-02-10", info: "Spyware info..." },
      {
        id: 4,
        name: "Ransomware",
        date: "2021-11-30",
        info: "Ransomware info...",
      },
      { id: 5, name: "Rootkit", date: "2022-12-05", info: "Rootkit info..." },
      { id: 6, name: "Rootkit", date: "2022-12-05", info: "Rootkit info..." },
    ],
  });

  useEffect(() => {
    const threatLevels = {
      Low: "rgba(0, 128, 0, 0.6)", // Green
      Medium: "rgba(255, 165, 0, 0.6)", // Orange
      High: "rgba(255, 0, 0, 0.6)", // Red
    };

    const chartData = antivirusStatus.threats.map((threat) => ({
      name: threat.name,
      value: [new Date(threat.date), threat.id], // Use the unique ID
      symbolSize: 10,
      itemStyle: {
        color: threatLevels[threat.severity] || threatLevels["High"], // Default to High if not found
      },
    }));

    const option = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "time",
      },
      yAxis: {
        type: "value",
        name: "Threat Severity",
        min: 0,
        max: 15,
      },
      tooltip: {
        // allow save as image
        trigger: "axis",
        formatter: function (params) {
          const threats = params.map((param) => {
            const threat = antivirusStatus.threats.find(
              (t) => t.id === param.value[1]
            );
            return `<b>${param.marker}${threat.name}</b><br>Threat: ${threat.name}<br>Date: ${threat.date}<br>Severity: ${threat.severity}<br>Info: ${threat.info}`;
          });
          return threats.join("<br>");
        },
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          dataView: { readOnly: false },
          magicType: { type: ["line", "bar"] },
          restore: {},
          saveAsImage: {},
        },
      },
      series: [
        {
          type: "scatter",
          symbol: "circle",
          symbolSize: 10,
          data: chartData,
          markPoint: {
            data: [
              { type: "max", name: "Max" },
              { type: "min", name: "Min" },
            ],
          },
        },
      ],
    };

    const chartInstance = document.getElementById(
      "threatChart"
    ) as HTMLDivElement;
    const chart = echarts.init(chartInstance);
    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [antivirusStatus.threats]);

  return (
    <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md">
      <h2 className="text-lg text-sky-400 flex items-center">
        <FiShield className="mr-2" /> Antivirus Status
      </h2>
      <div className="mt-4">
        {antivirusStatus.upToDate ? (
          <div className="flex items-center">
            <span className="text-green-400">
              <FiCheck className="mr-2" />
            </span>
            Antivirus is up to date
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-red-400">
              <FiAlertCircle className="mr-2" />
            </span>
            Your antivirus is outdated
          </div>
        )}
        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-sky-400">
              <FiArrowUp className="mr-2" />
            </span>
            Last Scan: {antivirusStatus.lastScan}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sky-400 text-lg">Threats Detected</h3>
          <div
            id="threatChart"
            style={{ height: "250px", width: "100%" }}
            className="text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default AntivirusSection;
