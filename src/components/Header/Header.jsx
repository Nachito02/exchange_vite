import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css'; // Importa el archivo CSS Module
import { useTranslation } from 'react-i18next';

const Header = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className={styles['product-header']}>
      <div className={styles['product-header-logo']}>
        <picture>
          <source media='(min-width: 576px)' srcSet='/images/logo-costaflores.png' />
          <img
            src="/images/logo-costaflores-reduced.png"
            alt="Costaflores"
            style={{ width: 'auto' }}
          />
        </picture>

        <div className={styles['product-header-change']} onClick={() => navigate(-1)}>
          {t('labels.change')}
        </div>
      </div>

      <div className={'container'}>
        {children}
      </div>
    </div>
  );
};

export default Header;
