declare module '@splidejs/react-splide' {
    import React from 'react';
  
    export interface SplideProps {
      options?: any;
      children: React.ReactNode;
      [key: string]: any;
    }
  
    export class Splide extends React.Component<SplideProps> {}
    export class SplideSlide extends React.Component<{ children: React.ReactNode }> {}
  }