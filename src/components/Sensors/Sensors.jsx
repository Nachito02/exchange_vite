import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Sensors.module.css';
import Heatmap from '../../HeatMap/HeatMap';
const Sensors = () => {
    // Example static data (replace with dynamic data if needed)
    const randomCycle = "Cycle Example";
    const lastUpdatedDate = "2023-10-15";
    const dashboardSensorData = [25, 60, 12, 180, 250, 100, 5, 90];
    const dashboardAnalysisData = [8, 14, 28, 50];

    return (
        <div className="container">
            <h2 className="text-center mt-5">Sensor Dashboard</h2>

            <div className={styles['dashboard']}>
                <div className={styles['dashboard-header']}>
                    <div className={styles['dashboard-header-state']}>
                        <h4>{randomCycle}</h4>
                        <div>
                            <ul>
                                <a href="https://example-link.com" target="_blank" rel="noopener noreferrer">
                                    <li>Location</li>
                                </a>
                            </ul>
                        </div>
                    </div>

                    <div className={styles['dashboard-header-stream']}>
                        <div>
                            <p>Last Update: {lastUpdatedDate}</p>
                        </div>
                    </div>
                </div>

                <div className={styles['dashboard-data-hz']}>
                    <div className={styles['dashboard-data-hz-group']} style={{ marginRight: '10px' }}>
                        <div className={styles['dashboard-data-hz-unit']}>
                            <span>Temperature</span>
                            <p>{dashboardSensorData[0]} ºC</p>
                        </div>
                        <div className={styles['dashboard-data-group-hz-unit']}>
                            <span>Humidity</span>
                            <p>{dashboardSensorData[1]} %</p>
                        </div>
                        <div className={styles['dashboard-data-group-hz-unit']}>
                            <span>Wind Speed</span>
                            <p>{dashboardSensorData[2]} km/h</p>
                        </div>
                        <div className={styles['dashboard-data-group-hz-unit']}>
                            <span>Wind Direction</span>
                            <p>{dashboardSensorData[3]} º</p>
                        </div>
                    </div>

                    <div className={styles['dashboard-data-hz-group']}>
                        <div className={styles['dashboard-data-hz-unit']}>
                            <span>Solar IR</span>
                            <p>{dashboardSensorData[4]}</p>
                        </div>
                        <div className={styles['dashboard-data-group-hz-unit']}>
                            <span>Solar VI</span>
                            <p>{dashboardSensorData[5]}</p>
                        </div>
                        <div className={styles['dashboard-data-group-hz-unit']}>
                            <span>Solar UV</span>
                            <p>{dashboardSensorData[6]}</p>
                        </div>
                        <div className={styles['dashboard-data-group-hz-unit']}>
                            <span>Pressure</span>
                            <p>{dashboardSensorData[7]} hPa</p>
                        </div>
                    </div>
                </div>

                <div className={styles['dashboard-data-vr']}>
                    <div className={styles['dashboard-data-vr-group']} style={{ width: '25%', marginRight: '10px' }}>
                        <h5>Input Molecules</h5>
                        <div className={styles['dashboard-data-vr-group-unit']}>
                            <span>CO</span>
                            <div>
                                <p>{dashboardAnalysisData[0]}</p>
                                <span>kg/ha</span>
                            </div>
                        </div>
                        <hr />
                        <div className={styles['dashboard-data-vr-group-unit']}>
                            <span>S</span>
                            <div>
                                <p>{dashboardAnalysisData[1]}</p>
                                <span>kg/ha</span>
                            </div>
                        </div>
                        <hr />
                        <div className={styles['dashboard-data-vr-group-unit']}>
                            <span>Guano</span>
                            <div>
                                <p>{dashboardAnalysisData[2]}</p>
                                <span>kg/ha</span>
                            </div>
                        </div>
                        <hr />
                        <div className={styles['dashboard-data-vr-group-unit']}>
                            <span>H2O</span>
                            <div>
                                <p>{dashboardAnalysisData[3]}</p>
                                <span>l/ha</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles['dashboard-data-vrandhz']} style={{ width: '75%' }}>
                        <div className={styles['dashboard-data-vrandhz-group']}>
                            <h5>Grape Status</h5>
                            <div className={styles['dashboard-data-vrandhz-subgroup']}>
                                <span>Sample 1</span>
                                <div className={styles['dashboard-data-hz-group-unit']}>
                                    <span>pH</span>
                                    <p>7</p>
                                </div>
                                <div className={styles['dashboard-data-hz-group-unit']}>
                                    <span>Brix</span>
                                    <p>5</p>
                                </div>
                                <div className={styles['dashboard-data-hz-group-unit']}>
                                    <span>Acidity</span>
                                    <p>10 %</p>
                                </div>
                                <div className={styles['dashboard-data-hz-group-unit']}>
                                    <span>Weight (kg)</span>
                                    <p>50</p>
                                </div>
                            </div>
                            <hr />
                            {/* Repeat for other samples */}
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="text-center mt-5 mb-4">Bottle Data</h3>
            <div className={styles['bottle-img']}>
                <div className={styles['bottle']}>
                    <img
                        src="/images/bottle-chart-dynamic.png"
                        style={{ width: '33%', minWidth: '350px', height: '100%' }}
                        alt="Wine bottle with percentages"
                    />
                    <div className={`${styles['bottle-metric']} ${styles['bottle-metric-1']}`}>
                        <span className={styles['bottle-metric-percent']}>40%</span>
                        <span className={styles['bottle-metric-label']}>Cultivation</span>
                    </div>
                    <div className={`${styles['bottle-metric']} ${styles['bottle-metric-2']}`}>
                        <span className={styles['bottle-metric-percent']}>30%</span>
                        <span className={styles['bottle-metric-label']}>Production</span>
                    </div>
                    <div className={`${styles['bottle-metric']} ${styles['bottle-metric-3']}`}>
                        <span className={styles['bottle-metric-percent']}>15%</span>
                        <span className={styles['bottle-metric-label']}>Packaging</span>
                    </div>
                    <div className={`${styles['bottle-metric']} ${styles['bottle-metric-4']}`}>
                        <span className={styles['bottle-metric-percent']}>10%</span>
                        <span className={styles['bottle-metric-label']}>Logistics</span>
                    </div>
                    <div className={`${styles['bottle-metric']} ${styles['bottle-metric-5']}`}>
                        <span className={styles['bottle-metric-percent']}>5%</span>
                        <span className={styles['bottle-metric-label']}>Marketing</span>
                    </div>
                </div>
            </div>





            <h3 className="text-center mt-5 mb-4">Date Selector</h3>
            <div className={styles['date-selector']}>
                <p>Selected Date: 2023</p>
            </div>

            <div style={{display: 'flex', width:"100%" }}>
                <div>   
                <div className={styles['product-content-title']}>Subsoil Humidity</div>
                <div>Heatmap Chart</div>

               

                <div className={styles['product-content-title']}>Pressure</div>
                <div>Line Chart</div>

                <div className={styles['product-content-title']}>Rain</div>
                <div>Line Chart</div>

                <div className={styles['product-content-title']}>Irradiance UV</div>
                <div>Line Chart</div>

                <div className={styles['product-content-title']}>Irradiance VI</div>
                <div>Line Chart</div>

                <div className={styles['product-content-title']}>Irradiance IR</div>
                <div>Line Chart</div>
                </div>

                <Heatmap />
            

            </div>
            <div style={{display: 'flex', width:"100%" }}>
                <div>   
                <div className={styles['product-content-title']}>Subsoil Humidity</div>
                <div>Heatmap Chart</div>

               

                <div className={styles['product-content-title']}>Pressure</div>
                <div>Line Chart</div>

                <div className={styles['product-content-title']}>Rain</div>
                <div>Line Chart</div>

                <div className={styles['product-content-title']}>Irradiance UV</div>
                <div>Line Chart</div>

                <div className={styles['product-content-title']}>Irradiance VI</div>
                <div>Line Chart</div>

                <div className={styles['product-content-title']}>Irradiance IR</div>
                <div>Line Chart</div>
                </div>

                <Heatmap />
            

            </div>

        </div>
    );

}

export default Sensors