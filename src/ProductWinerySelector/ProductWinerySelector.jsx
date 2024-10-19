import React from 'react';
import styles from './ProductWinerySelector.module.css'; // Importa los módulos CSS

const ProductWinerySelector = ({ winery }) => {
    return (
       <div className={styles['card-winery']}>
         <div className={styles.card}>
            <div className={styles['card-body']}>
                <p className={styles['card-img-link']}> Visita la bodega </p>

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
