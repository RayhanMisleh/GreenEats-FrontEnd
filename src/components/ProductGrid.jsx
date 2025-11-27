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

const truncate = (text, limit = 140) => {
  if (!text) return '';
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const ProductGrid = ({ produtos, onEdit, onDelete }) => {
  return (
    <section className="product-grid">
      {produtos.map((produto) => (
        <article key={produto.id} className="product-card">
          <header>
            <div className="product-card__title">{produto.titulo}</div>
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

          <p className="product-card__description">{truncate(produto.descricao)}</p>

          <div className="product-card__details">
            <span>Preço: {currencyFormatter.format(Number(produto.preco) || 0)}</span>
            <span>Estoque: {produto.estoque ?? '—'}</span>
            <span>Criado em: {formatDate(produto.dataCriacao)}</span>
          </div>

          <div className="product-card__actions">
            <button type="button" className="btn btn--ghost" onClick={() => onEdit(produto)}>
              Editar
            </button>
            <button type="button" className="btn btn--danger" onClick={() => onDelete(produto)}>
              Excluir
            </button>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ProductGrid;
