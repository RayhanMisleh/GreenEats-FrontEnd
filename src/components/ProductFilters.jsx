const CATEGORY_OPTIONS = ['Todas', 'Fruta', 'Legume', 'Verdura'];

const ProductFilters = ({
  searchTerm,
  category,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
  onAddProduct
}) => {
  return (
    <div className="filters-bar">
      <div className="filters-bar__inputs">
        <div className="filters-bar__field">
          <label htmlFor="buscar" className="filters-bar__label">
            Buscar por título
          </label>
          <input
            id="buscar"
            type="search"
            className="input-control"
            placeholder="Ex.: Alface Crespa"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="filters-bar__field">
          <label htmlFor="categoria" className="filters-bar__label">
            Categoria
          </label>
          <select
            id="categoria"
            className="input-control"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters-bar__actions">
        <button type="button" className="btn btn--ghost" onClick={onClearFilters}>
          Limpar filtros
        </button>
        <button type="button" className="btn btn--primary" onClick={onAddProduct}>
          + Adicionar Produto
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
