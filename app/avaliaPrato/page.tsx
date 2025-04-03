'use client';

import { useState } from 'react';
import styles from './avaliaPrato.module.scss';

const pratos = [
  { id: 1, imagem: '/avalia_prato1.jpg' },
  { id: 2, imagem: '/avalia_prato2.jpg' },
  { id: 3, imagem: '/avalia_prato3.jpg' },
  { id: 4, imagem: '/avalia_prato4.jpg' },
];

const icones: { [key: string]: string } = {
  comida: '🍽️ Comida',
  servico: '🛎️ Serviço',
  preco: '💰 Preço',
  ambiente: '🏠 Ambiente'
};

export default function AvaliacaoPratos() {
  const [avaliacoes, setAvaliacoes] = useState(
    pratos.map(() => ({
      comida: 0,
      servico: 0,
      preco: 0,
      ambiente: 0,
      comentario: '',
    }))
  );

  const handleAvaliacaoChange = (index: number, campo: string, valor: number) => {
    const novasAvaliacoes = [...avaliacoes];
    novasAvaliacoes[index] = { ...novasAvaliacoes[index], [campo]: valor };
    setAvaliacoes(novasAvaliacoes);
  };

  const handleComentarioChange = (index: number, comentario: string) => {
    const novasAvaliacoes = [...avaliacoes];
    novasAvaliacoes[index].comentario = comentario;
    setAvaliacoes(novasAvaliacoes);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Avaliação de Pratos</h1>
      <div className={styles.grid}>
        {pratos.map((prato, index) => (
          <div key={prato.id} className={styles.card}>
            <img src={prato.imagem} alt={`Prato ${prato.id}`} className={styles.imagem} />
            <div className={styles.info}>
              <h2 className={styles.subtitulo}>Pontuações</h2>
              {['comida', 'servico', 'preco', 'ambiente'].map((campo) => (
                <div key={campo} className={styles.avaliacao}>
                  <span>{icones[campo as keyof typeof icones]}</span>
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <span
                      key={estrela}
                      className={Number(avaliacoes[index][campo as keyof typeof avaliacoes[0]]) >= estrela ? styles.estrelaAtiva : styles.estrela}
                      onClick={() => handleAvaliacaoChange(index, campo, estrela)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              ))}
              <textarea
                className={styles.comentario}
                placeholder="Comentários"
                value={avaliacoes[index].comentario}
                onChange={(e) => handleComentarioChange(index, e.target.value)}
              />
              <button className={styles.botao}>Enviar Avaliação</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
