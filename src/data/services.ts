export interface Service {
  title: string;
  text: string;
  tone: 'light' | 'dark' | 'lime';
}

export interface ServiceGroup {
  name: string;
  tag: string;
  services: Service[];
}

export const serviceGroups: ServiceGroup[] = [
  {
    name: 'Security',
    tag: 'our core',
    services: [
      {
        title: 'Audits & code review',
        text: 'Line-by-line review of your code, from smart contracts to backends and apps.',
        tone: 'light',
      },
      {
        title: 'Penetration testing',
        text: 'We attack your apps and infrastructure, then tell you what broke and how to fix it.',
        tone: 'dark',
      },
      {
        title: 'Infrastructure security',
        text: 'Review and hardening of your cloud, servers and network.',
        tone: 'dark',
      },
      {
        title: 'Advisory & training',
        text: 'Help with security decisions, and training for your developers.',
        tone: 'light',
      },
    ],
  },
  {
    name: 'Engineering',
    tag: 'built secure',
    services: [
      {
        title: 'Software development',
        text: 'We build software too, secure by default.',
        tone: 'lime',
      },
      {
        title: 'Infrastructure & DevOps',
        text: "We set up and run infrastructure that doesn't fall over.",
        tone: 'lime',
      },
    ],
  },
];
