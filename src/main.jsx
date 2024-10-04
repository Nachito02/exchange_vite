import UniSwap from './components/UniSwap';

// Aseguramos que el Custom Element se registre solo una vez
if (!customElements.get('uniswap-enchainte')) {
  window.customElements.define('uniswap-enchainte', UniSwap);
}

// Creamos una instancia segura del root
