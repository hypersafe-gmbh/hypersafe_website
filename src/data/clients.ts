export interface Client {
  name: string;
  src: string;
  height: number;
  label?: string;
  filter?: 'icon';
}

export const clients: Client[] = [
  { name: 'MetaMask', src: '/clients/metamask.svg', height: 22 },
  { name: 'Aave', src: '/clients/aave.svg', height: 22 },
  { name: 'Uniswap', src: '/clients/uniswap.svg', height: 32 },
  { name: 'Lido', src: '/clients/lido.svg', height: 30 },
  { name: 'Linea', src: '/clients/linea.svg', height: 26 },
  { name: 'Rocket Pool', src: '/clients/rocketpool.svg', height: 30, label: 'Rocket Pool', filter: 'icon' },
  { name: 'Lake', src: '/clients/lak3.png', height: 30 },
  { name: 'Infomaniak', src: '/clients/infomaniak.svg', height: 20 },
];
