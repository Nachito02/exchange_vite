import React from 'react';
import styles from './Heatmap.module.css';

const Heatmap = () => {
  const tabs = ["Tab 1", "Tab 2", "Tab 3"]; // Sample static tabs
  const zones = ["Zone 1", "Zone 2", "Zone 3"]; // Sample static zones
  const days = [1, 2, 3, 4, 5]; // Sample static days
  const zoneData = { 1: { label: "Day 1" }, 2: { label: "Day 2" }, 3: { label: "Day 3" } }; // Sample static data

  return (
    <div className={styles["heatmap"]}>
      <div className={styles["heatmap-tabs"]}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={styles["heatmap-tabs-item"]}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className={styles["heatmap-chart"]}>
        <div className={styles["heatmap-chart-content"]}>
          <div className={styles["heatmap-chart-label-y"]}>
            {zones.map((zone, index) => (
              <div key={index} className={styles["heatmap-chart-row-label"]}>
                {zone}
              </div>
            ))}
            <div className={styles["heatmap-chart-row-label"]} style={{ marginTop: "21px", height: "auto" }}>
              Day
            </div>
          </div>
          <div className={styles["heatmap-chart-data"]}>
            <div className={styles["heatmap-chart-data-container"]}>
              {zones.map((zone, i) => (
                <div key={i} className={styles["heatmap-chart-row"]}>
                  {days.map((day, j) => (
                    <div key={j} className={styles["heatmap-chart-row-data"]}>
                      {/* Example Data */}
                      {Math.random().toFixed(2)} 
                    </div>
                  ))}
                </div>
              ))}

              <div className={styles["heatmap-chart-divider"]}></div>

              <div className={styles["heatmap-chart-row"]}>
                {days.map((day, j) => (
                  <div key={j} className={styles["heatmap-chart-row-label-x"]}>
                    {zoneData[day]?.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["heatmap-legend"]}>
        <div className={styles["heatmap-legend-label"]}>Wet</div>
        <div className={styles["heatmap-legend-gradient"]}></div>
        <div className={styles["heatmap-legend-label"]}>Dry</div>
      </div>
    </div>
  );
};

export default Heatmap;
