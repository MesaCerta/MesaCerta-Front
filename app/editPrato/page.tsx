'use client';

import { useState, useRef } from 'react';
import styles from './editPrato.module.scss';
import { Lobster } from 'next/font/google';

const lobster = Lobster({ subsets: ['latin'], weight: '400' });

export default function EditPrato() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={`${styles.title} ${lobster.className}`}>
          Editar prato
        </h2>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do prato"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite a descrição do prato"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="preco">Preço (R$)</label>
            <input
              type="number"
              id="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="Digite o preço"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imagem">Upload de imagem do prato</label>
            <input
              type="file"
              id="imagem"
              accept="image/*"
              ref={inputRef}
              onChange={handleImagemChange}
            />
          </div>

          <div className={styles.buttonWrapper}>
            <button type="button" className={styles.deleteButton}>
              Deletar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
