import React from 'react';
import styles from './ProductWinerySelector.module.css'; // Importa los módulos CSS
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProductWinerySelector = ({ winery }) => {

    const navigate = useNavigate();
    const {t} = useTranslation();

    const handleWineryClick = (wineryId) => {
        navigate(`/${wineryId}`);
    }
    return (
        <div className={styles['card-winery']} onClick={() =>handleWineryClick(winery?.name.toLowerCase())}>
            <div className={styles.card}>
                <div className={styles['card-body']}>
                    <p className={styles['card-img-link']}> {t('wineries.visit-winery')} </p>

                    {winery?.image ? (
                        <div>
                            <img className={styles['card-img-top']} src={winery?.image} alt="Winery" />
                        </div>
                    ) : (
                        <div>
                            <img className={styles['card-img-top']} src={'/images/empty_winery.png'} alt="Empty Winery" />
                        </div>
                    )}

                    <h5 className={styles['card-title']} style={{ color: "#141414" }}>
                        {winery?.name}
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default ProductWinerySelector;
