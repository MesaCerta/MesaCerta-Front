'use client';

import { useState } from 'react';
import styles from './pratos.module.scss';

const pratos = [
  { id: 1, imagem: '/avalia_prato1.jpg' },
  { id: 2, imagem: '/avalia_prato2.jpg' },
  { id: 3, imagem: '/avalia_prato3.jpg' },
  { id: 4, imagem: '/avalia_prato4.jpg' },
];

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

  const [notaGeral, setNotaGeral] = useState(0);

  const handleAvaliacaoChange = (index: number, campo: string, valor: number) => {
    const novasAvaliacoes = [...avaliacoes];
    novasAvaliacoes[index] = { ...novasAvaliacoes[index], [campo]: valor };
    setAvaliacoes(novasAvaliacoes);
  };

  const handleNotaGeralChange = (valor: number) => {
    setNotaGeral(valor);
  };

  const handleComentarioChange = (index: number, comentario: string) => {
    const novasAvaliacoes = [...avaliacoes];
    novasAvaliacoes[index].comentario = comentario;
    setAvaliacoes(novasAvaliacoes);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Pratos</h1>
      <div className={styles.grid}>
        {pratos.map((prato, index) => (
          <div key={prato.id} className={styles.card}>
            <img src={prato.imagem} alt={`Prato ${prato.id}`} className={styles.imagem} />
            <div className={styles.info}>
              <h2 className={styles.subtitulo}>Pontuações e avaliações</h2>
              <div className={styles.notaGeral}>
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <span
                    key={estrela}
                    className={notaGeral >= estrela ? styles.estrelaAtiva : styles.estrela}
                    onMouseEnter={() => handleNotaGeralChange(estrela)}
                    onMouseLeave={() => handleNotaGeralChange(notaGeral)}
                    onClick={() => handleNotaGeralChange(estrela)}
                  >
                    ★
                  </span>
                ))}
                <span className={styles.numAvaliacoes}> 1.500 avaliações</span>
              </div>
              <p className={styles.restauranteInfo}>Nº 48 de 682 restaurantes em Donostia-San Sebastián</p>
              <h3 className={styles.subtitulo}>Pontuações</h3>
              {[
                { campo: 'comida', emoji: '🍽️' },
                { campo: 'servico', emoji: '🛎️' },
                { campo: 'preco', emoji: '💰' },
                { campo: 'ambiente', emoji: '🌿' },
              ].map(({ campo, emoji }) => (
                <div key={campo} className={styles.avaliacao}>
                  <span>{emoji} {campo.charAt(0).toUpperCase() + campo.slice(1)}</span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}