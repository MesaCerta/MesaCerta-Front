'use client';

import { useState, useRef } from 'react';
import styles from './addPrato.module.scss';
import { Lobster } from 'next/font/google';

const lobster = Lobster({ subsets: ['latin'], weight: '400' });

export default function AddPrato() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Criando a referência para o campo de upload

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      nome,
      descricao,
      preco,
      imagem,
    });
  };

  const handleCancel = () => {
    setNome('');
    setDescricao('');
    setPreco('');
    setImagem(null);

    // Reseta o campo de upload
    if (inputRef.current) {
      inputRef.current.value = ''; 
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={`${styles.title} ${lobster.className}`}>
          Cadastre seu prato
        </h2>
        <form onSubmit={handleSubmit}>
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
              ref={inputRef} // Referência ao campo de upload
              onChange={handleImagemChange}
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
