using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using System.Data;
using System.Data.SqlClient;

namespace backend.Repositories
{
    public class ArticuloRepository : IArticuloRepository
    {
        private readonly DatabaseConnection _databaseConnection;

        public ArticuloRepository(DatabaseConnection databaseConnection)
        {
            _databaseConnection = databaseConnection;
        }

        public async Task<IEnumerable<ArticuloDto>> GetAllAsync()
        {
            var articulos = new List<ArticuloDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_GetAll", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                articulos.Add(new ArticuloDto
                {
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Codigo = reader.GetString("Codigo"),
                    Descripcion = reader.GetString("Descripcion"),
                    Precio = reader.GetDecimal("Precio"),
                    Imagen = reader.IsDBNull("Imagen") ? null : reader.GetString("Imagen"),
                    Stock = reader.GetInt32("Stock"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                });
            }

            return articulos;
        }

        public async Task<ArticuloDto?> GetByIdAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_GetById", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloId", id);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new ArticuloDto
                {
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Codigo = reader.GetString("Codigo"),
                    Descripcion = reader.GetString("Descripcion"),
                    Precio = reader.GetDecimal("Precio"),
                    Imagen = reader.IsDBNull("Imagen") ? null : reader.GetString("Imagen"),
                    Stock = reader.GetInt32("Stock"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                };
            }

            return null;
        }

        public async Task<ArticuloDto?> GetByCodigoAsync(string codigo)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_GetByCodigo", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@Codigo", codigo);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new ArticuloDto
                {
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Codigo = reader.GetString("Codigo"),
                    Descripcion = reader.GetString("Descripcion"),
                    Precio = reader.GetDecimal("Precio"),
                    Imagen = reader.IsDBNull("Imagen") ? null : reader.GetString("Imagen"),
                    Stock = reader.GetInt32("Stock"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                };
            }

            return null;
        }

        public async Task<ArticuloDto> CreateAsync(ArticuloCreateDto articuloCreateDto)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_Create", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Codigo", articuloCreateDto.Codigo);
            command.Parameters.AddWithValue("@Descripcion", articuloCreateDto.Descripcion);
            command.Parameters.AddWithValue("@Precio", articuloCreateDto.Precio);
            command.Parameters.AddWithValue("@Imagen", articuloCreateDto.Imagen ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@Stock", articuloCreateDto.Stock);

            var articuloIdParam = new SqlParameter("@ArticuloId", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(articuloIdParam);

            await command.ExecuteNonQueryAsync();

            var articuloId = (int)articuloIdParam.Value;
            var articulo = await GetByIdAsync(articuloId);
            return articulo!;
        }

        public async Task<ArticuloDto?> UpdateAsync(int id, ArticuloUpdateDto articuloUpdateDto)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_Update", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ArticuloId", id);
            command.Parameters.AddWithValue("@Codigo", articuloUpdateDto.Codigo);
            command.Parameters.AddWithValue("@Descripcion", articuloUpdateDto.Descripcion);
            command.Parameters.AddWithValue("@Precio", articuloUpdateDto.Precio);
            command.Parameters.AddWithValue("@Imagen", articuloUpdateDto.Imagen ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@Stock", articuloUpdateDto.Stock);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            if (rowsAffected > 0)
            {
                return await GetByIdAsync(id);
            }

            return null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_Delete", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloId", id);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_Exists", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloId", id);

            var existsParam = new SqlParameter("@Exists", SqlDbType.Bit)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(existsParam);

            await command.ExecuteNonQueryAsync();
            return (bool)existsParam.Value;
        }

        public async Task<bool> CodigoExistsAsync(string codigo)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_CodigoExists", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@Codigo", codigo);

            var existsParam = new SqlParameter("@Exists", SqlDbType.Bit)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(existsParam);

            await command.ExecuteNonQueryAsync();
            return (bool)existsParam.Value;
        }

        public async Task<IEnumerable<ArticuloDto>> GetByTiendaAsync(int tiendaId)
        {
            var articulos = new List<ArticuloDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Articulo_GetByTienda", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@TiendaId", tiendaId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                articulos.Add(new ArticuloDto
                {
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Codigo = reader.GetString("Codigo"),
                    Descripcion = reader.GetString("Descripcion"),
                    Precio = reader.GetDecimal("Precio"),
                    Imagen = reader.IsDBNull("Imagen") ? null : reader.GetString("Imagen"),
                    Stock = reader.GetInt32("Stock"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                });
            }

            return articulos;
        }
    }
}
