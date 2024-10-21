import React, { useState } from 'react';
import styles from './Tabs.module.css';
import { useTranslation } from 'react-i18next';

const Tabs = () => {
    const { t } = useTranslation();

    // Estado para la pestaña activa
    const [activeTab, setActiveTab] = useState("SENSORIC");

    const TABS = [
        {
            id: "SENSORIC",
            name: "product.tabs.sensoric",
        },
        {
            id: "WORK",
            name: "product.tabs.work",
        },
        {
            id: "BUSINESS",
            name: "product.tabs.business",
        },
        {
            id: "EVIDENCES",
            name: "product.tabs.evidences",
        }
    ];

    // Función para manejar el cambio de pestaña
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);  // Cambia la pestaña activa
    };

    return (
        <div className={styles.tabs}>
            <div className={styles.container}>
                {TABS.map((tab) => (
                    <div
                        key={tab.id}
                        className={`${styles.tabsItem} ${activeTab === tab.id ? styles.tabsItemActive : ''}`}
                        onClick={() => handleTabClick(tab.id)} // Cambia la pestaña al hacer clic
                    >
                        {t(tab.name)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
