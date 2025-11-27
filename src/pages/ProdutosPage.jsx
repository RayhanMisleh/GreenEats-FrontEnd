import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductFormModal from '../components/ProductFormModal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { createProduto, deleteProduto, getProdutos, updateProduto, validarProduto } from '../services/api.js';

const initialFilters = {
  search: '',
  category: 'Todas'
};

const parseLocaleNumber = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  return Number(String(value).replace(',', '.'));
};

const sortByCreatedAtDesc = (list) => [...list].sort((a, b) => {
  const dateA = new Date(a?.dataCriacao || 0).getTime();
  const dateB = new Date(b?.dataCriacao || 0).getTime();
  return dateB - dateA;
});

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [toast, setToast] = useState(null);

  const loadProdutos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getProdutos();
      setProdutos(sortByCreatedAtDesc(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error('Falha ao buscar produtos', err);
      setError('Não foi possível carregar os produtos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProdutos();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeoutId);
  }, [toast]);

  const filteredProdutos = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return produtos.filter((produto) => {
      const matchesSearch =
        !normalizedSearch ||
        produto?.titulo?.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        filters.category === 'Todas' || produto?.categoria === filters.category;
      return matchesSearch && matchesCategory;
    });
  }, [produtos, filters]);

  const handleSearchChange = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (value) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const openCreateModal = () => {
    setProdutoSelecionado(null);
    setIsModalOpen(true);
  };

  const openEditModal = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProdutoSelecionado(null);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleDeleteProduto = async (produto) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir ${produto?.titulo || 'este produto'}?`
    );

    if (!confirmed) return;

    try {
      await deleteProduto(produto.id);
      setProdutos((prev) => prev.filter((item) => item.id !== produto.id));
      showToast('Produto excluído com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao excluir produto', err);
      showToast('Erro ao excluir produto. Tente novamente.', 'error');
    }
  };

  const handlePersistProduto = async (formData, produtoId) => {
    const payload = {
      titulo: formData.titulo.trim(),
      descricao: formData.descricao.trim(),
      preco: parseLocaleNumber(formData.preco),
      categoria: formData.categoria,
      estoque:
        formData.estoque === '' || formData.estoque === null
          ? undefined
          : parseLocaleNumber(formData.estoque),
      dataCriacao: formData.dataCriacao || undefined
    };

    try {
      const validation = await validarProduto(payload);
      if (!validation?.valido) {
        const err = new Error('Validação do backend falhou');
        err.validationErrors = validation?.erros || ['Dados inválidos.'];
        throw err;
      }
    } catch (err) {
      if (err?.validationErrors) {
        throw err;
      }
      console.warn('Validação remota indisponível, prosseguindo com payload.', err);
    }

    if (produtoId) {
      const atualizado = await updateProduto(produtoId, payload);
      setProdutos((prev) =>
        sortByCreatedAtDesc(prev.map((item) => (item.id === atualizado.id ? atualizado : item)))
      );
      showToast('Produto atualizado com sucesso!', 'success');
      return atualizado;
    }

    const criado = await createProduto(payload);
    setProdutos((prev) => sortByCreatedAtDesc([criado, ...prev]));
    showToast('Produto criado com sucesso!', 'success');
    return criado;
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={loadProdutos} />;
    }

    if (!filteredProdutos.length) {
      return (
        <div className="empty-state card-surface">
          <div className="empty-state__icon" role="img" aria-label="Semente">🌿</div>
          <h3> Nenhum produto cadastrado ainda </h3>
          <p>Adicione novos itens clicando em "Adicionar Produto".</p>
        </div>
      );
    }

    return (
      <ProductGrid
        produtos={filteredProdutos}
        onEdit={openEditModal}
        onDelete={handleDeleteProduto}
      />
    );
  };

  return (
    <>
      <Header />

      <section className="card-surface">
        <ProductFilters
          searchTerm={filters.search}
          category={filters.category}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onClearFilters={handleClearFilters}
          onAddProduct={openCreateModal}
        />
      </section>

      {renderContent()}

      <ProductFormModal
        isOpen={isModalOpen}
        produto={produtoSelecionado}
        onClose={closeModal}
        onSubmit={(formValues) => handlePersistProduto(formValues, produtoSelecionado?.id)}
      />

      {toast && <div className={`toast toast--${toast.type}`}>{toast.message}</div>}
    </>
  );
};

export default ProdutosPage;
