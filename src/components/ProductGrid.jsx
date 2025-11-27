import Badge from './Badge.jsx';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
};

const isProductNew = (dataCriacao) => {
  if (!dataCriacao) return false;
  const createdAt = new Date(dataCriacao);
  if (Number.isNaN(createdAt.getTime())) return false;
  const diffInDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
};

const getCategoryVariant = (categoria) => {
  if (!categoria) return '';
  return `category-${categoria.toLowerCase()}`;
};

const getCategoryClassName = (categoria) => {
  if (!categoria) return 'default';
  return categoria.toLowerCase();
};

const categoryIcons = {
  Fruta: '🍊',
  Legume: '🥕',
  Verdura: '🥬'
};

const truncate = (text, limit = 140) => {
  if (!text) return '';
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const ProductGrid = ({ produtos, onEdit, onDelete }) => {
  return (
    <section className="product-grid">
      {produtos.map((produto) => (
        <article
          key={produto.id}
          className={`product-card product-card--${getCategoryClassName(produto.categoria)}`}
        >
          <div className="product-card__hero">
            <div className="product-card__hero-left">
              <span className="product-card__icon" role="img" aria-label={produto.categoria}>
                {categoryIcons[produto.categoria] || '🌿'}
              </span>
              <div>
                <p className="product-card__label">Categoria</p>
                <h3>{produto.categoria || '—'}</h3>
              </div>
            </div>
            <div className="product-card__hero-right">
              <p className="product-card__label">Preço</p>
              <strong>{currencyFormatter.format(Number(produto.preco) || 0)}</strong>
            </div>
          </div>

          <div className="product-card__body">
            <header className="product-card__header">
              <h2 className="product-card__title">{produto.titulo}</h2>
              <div className="product-card__meta">
                <Badge
                  label={produto.categoria}
                  variant={getCategoryVariant(produto.categoria)}
                />
                {isProductNew(produto.dataCriacao) && (
                  <Badge label="Novo" variant="status-novo" />
                )}
              </div>
            </header>

            <p className="product-card__description">
              <span className="product-card__label">Descrição</span>
              {truncate(produto.descricao)}
            </p>

            <div className="product-card__stats">
              <div>
                <p className="product-card__label">Estoque</p>
                <strong>{produto.estoque ?? '—'}</strong>
              </div>
              <div>
                <p className="product-card__label">Criado em</p>
                <strong>{formatDate(produto.dataCriacao)}</strong>
              </div>
            </div>

            <div className="product-card__actions">
              <button type="button" className="btn btn--ghost" onClick={() => onEdit(produto)}>
                Editar
              </button>
              <button type="button" className="btn btn--danger" onClick={() => onDelete(produto)}>
                Excluir
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ProductGrid;
