# Ethereum Local Network Dashboard

Un dashboard interactivo para gestionar una red Ethereum local, construido con React y TypeScript. Este proyecto demuestra la integración de tecnologías blockchain con aplicaciones web modernas.

## 🚀 Características

- Visualización de balances en tiempo real
- Transferencia de ETH entre cuentas
- Interfaz moderna y responsiva
- Integración con nodo Ethereum local
- Conversión automática entre unidades (Wei, Gwei, ETH)
- Manejo de transacciones seguras
- Actualización automática de balances

## 🛠️ Tecnologías Utilizadas

- React 18
- TypeScript 5
- Vite
- TailwindCSS
- Web3.js
- Ethereum (Geth)
- Node.js

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- Geth (cliente Ethereum)
- Git

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Richygarcia7/ethereum-dashboard.git
cd ethereum-dashboard
```

2. Instalar dependencias:
```bash
cd front
npm install
```

3. Iniciar el nodo Ethereum local:
```bash
cd nodo
geth --datadir ./data init genesis.json
geth --datadir ./data --networkid 15 --http --http.addr "0.0.0.0" --http.port 5556 --http.api "eth,net,web3" --http.corsdomain "*" --allow-insecure-unlock
```

4. Iniciar la aplicación:
```bash
cd front
npm run dev
```

## 🌐 Uso

1. Abre tu navegador en `http://localhost:5173`
2. Selecciona una cuenta origen
3. Elige una cuenta destino
4. Ingresa la cantidad de ETH a enviar
5. Confirma la transacción

## 📊 Estructura del Proyecto

```
ethereum-dashboard/
├── front/                 # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── App.tsx       # Componente principal
│   │   └── main.tsx      # Punto de entrada
│   └── package.json
├── nodo/                  # Configuración del nodo Ethereum
│   ├── genesis.json      # Configuración inicial
│   └── data/             # Datos del nodo
└── README.md
```

## 🔐 Cuentas Disponibles

El proyecto incluye tres cuentas preconfiguradas con saldo inicial de 300,000 ETH cada una:

1. `0x47c5d423684Fd66a33c70B464884D052e9c3eA93`
2. `0x25e604dc2c1347d8a2998675152ac2803acacf23`
3. `0x8c1f450809eb0c5cc1982db461aa9c64eb7c5d0b`

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

Richard Garcia - [@Richygarcia7](https://twitter.com/Richygarcia7)

Desarrollador Full Stack especializado en tecnologías blockchain y desarrollo web moderno.

## 🙏 Agradecimientos

- [Ethereum](https://ethereum.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Web3.js](https://web3js.readthedocs.io/) 