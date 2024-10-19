import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../config/axiosClient';
import { useParams } from 'react-router-dom';
import ProductSelector from './ProductSelector/ProductSelector';
import styles from './Selector.module.css'; // Importa el archivo CSS Module
import { useTranslation } from 'react-i18next';

const Selector = () => {
  const [products, setProducts] = useState([]);
  const { wineryId } = useParams();

  const { t } = useTranslation();

  const getProductList = async () => {
    const productsWineries = await axiosClient.get('/token', {
      params: { winerie_id: wineryId },
    });
    setProducts(productsWineries.data);
  };

  useEffect(() => {
    getProductList();
  }, []);



  return (
    <div className={styles['selector']}>
      <div className={`${styles['container']} container`} >
        <div className={styles['selector-header']}>
          <picture>
            <source media="(min-width: 576px)" srcSet="/images/logo-costaflores.png" />
            <img src="assets/images/logo-costaflores-reduced.png" alt="Costaflores" style={{ width: 'auto' }} />
          </picture>
        </div>
        <div className={styles['selector-content']}>
          <div>
            <a className={styles['btn-back']} href="/">{t('wineries.back')}</a>
          </div>
          <div className={`${styles['selector-content-header']} py-4 py-sm-5`}>
            <h1>{t('selection.title')}</h1>
            <h2 className={styles['subtitle']}>{t('selection.subtitle')}</h2>
          </div>
          <div className={`row justify-content-center ${styles['selector-content-items']}`}>
            {products && products
              .sort((a, b) => a.year - b.year) // Ordena los productos por el año de menor a mayor
              .map((product) => (
                <ProductSelector key={product.id} product={product} />
              ))}
          </div>
          <div className={styles['selector-content-button']} my-5>
            {t('selection.know-more')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selector;
